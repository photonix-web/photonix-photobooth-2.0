import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, X, FileText, CreditCard, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getTravelFee, formatPHP, parsePriceString } from "@/lib/travelFee";
import gcashQR from "@/assets/gcash_qr.jpg";
import unionbankQR from "@/assets/unionbank_qr.jpg";

const priceMap: Record<string, Record<string, string>> = {
  Basic: { "4R": "₱4,000", Photostrip: "₱4,500", Polaroid: "₱4,500", "5 Frames": "₱5,000" },
  Curtain: { "4R": "₱6,000", Photostrip: "₱6,500", Polaroid: "₱6,500", "5 Frames": "₱7,000" },
  Classic: { "4R": "₱10,000", Photostrip: "₱10,500", Polaroid: "₱10,500", "5 Frames": "₱11,000" },
  "High-Angle": { "4R": "₱12,000", Photostrip: "₱12,500", Polaroid: "₱12,500", "5 Frames": "₱13,000" },
};

const generateBookingNumber = () => {
  const now = new Date();
  const year = now.getFullYear();
  const seq = Math.floor(Math.random() * 99999).toString().padStart(5, "0");
  return `PX-${year}-${seq}`;
};

const BookingQuotation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const data = location.state as (Record<string, string> & {
    extensionEnabled?: boolean;
    extensionHours?: number;
    unlimitedPrinting?: boolean;
    extensionRate?: number;
  }) | null;

  const [disclaimerChecked, setDisclaimerChecked] = useState(false);
  const [detailsChecked, setDetailsChecked] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const receiptInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!data) navigate("/book");
  }, [data, navigate]);

  if (!data) return null;

  const eventDate = new Date(data.date);
  const price = priceMap[data.booth]?.[data.packageType] || "TBD";
  const basePrice = parsePriceString(price);
  const { fee: travelFee, zone: travelZone } = getTravelFee(data.city);
  const extensionHours = data.extensionEnabled ? Math.max(1, Number(data.extensionHours) || 1) : 0;
  const extensionRate = Number(data.extensionRate) || (data.booth === "Classic" || data.booth === "High-Angle" ? 3000 : 2500);
  const extensionTotal = extensionHours * extensionRate;
  const unlimitedPrintingTotal = data.unlimitedPrinting ? 2000 : 0;
  const addOnsTotal = extensionTotal + unlimitedPrintingTotal;
  const totalPrice = basePrice + travelFee + addOnsTotal;
  const extensionDisplay = extensionHours > 0
    ? `Extension: ${extensionHours} hour${extensionHours > 1 ? "s" : ""} – ${formatPHP(extensionTotal)}`
    : null;
  const unlimitedDisplay = data.unlimitedPrinting ? `Unlimited Printing – ${formatPHP(2000)}` : null;
  const addOnsSummary = (extensionDisplay || unlimitedDisplay)
    ? [extensionDisplay, unlimitedDisplay].filter(Boolean).join(" • ")
    : "None";
  const fullAddress = [data.streetAddress, data.barangay, data.city, data.province, data.postalCode].filter(Boolean).join(", ");

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => setReceiptPreview(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setReceiptPreview(null);
      }
    }
  };

  const removeReceipt = () => {
    setReceiptFile(null);
    setReceiptPreview(null);
    if (receiptInputRef.current) receiptInputRef.current.value = "";
  };

  const canSubmit = disclaimerChecked && detailsChecked && receiptFile && !isSubmitting;

  const formatFileName = (fullName: string, date: Date, type: "RECEIPT" | "THEME", ext: string) => {
    const sanitized = fullName.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").toUpperCase();
    const dateStr = `${(date.getMonth() + 1).toString().padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}${date.getFullYear()}`;
    return `${sanitized}-${dateStr}-${type}.${ext}`;
  };

  const uploadFile = async (file: File, folder: string, formattedName: string) => {
    const filePath = `${folder}/${formattedName}`;
    const { error } = await supabase.storage.from("booking-files").upload(filePath, file);
    if (error) throw error;
    const { data: urlData } = supabase.storage.from("booking-files").getPublicUrl(filePath);
    return urlData.publicUrl;
  };

  const handleSubmit = async () => {
    if (!canSubmit || !receiptFile) return;
    setIsSubmitting(true);

    try {
      const bookingNumber = generateBookingNumber();

      // Upload receipt
      const receiptExt = receiptFile.name.split(".").pop() || "jpg";
      const receiptFormattedName = formatFileName(data.name, eventDate, "RECEIPT", receiptExt);
      const receiptUrl = await uploadFile(receiptFile, "receipts", receiptFormattedName);

      // Upload theme file if exists
      let themeFileUrl: string | null = null;
      let themeFormattedName: string | null = null;
      if (data.themePreview && data.themeFileName) {
        const res = await fetch(data.themePreview);
        const blob = await res.blob();
        const themeExt = data.themeFileName.split(".").pop() || "jpg";
        themeFormattedName = formatFileName(data.name, eventDate, "THEME", themeExt);
        const themeFile = new File([blob], themeFormattedName, { type: blob.type });
        themeFileUrl = await uploadFile(themeFile, "themes", themeFormattedName);
      }

      // Save booking to database
      const { error } = await supabase.from("bookings").insert({
        booking_number: bookingNumber,
        client_name: data.name,
        email: data.email,
        phone: data.phone,
        booth_package: data.booth,
        package_type: data.packageType,
        event_name: data.eventName,
        event_date: eventDate.toISOString().split("T")[0],
        start_time: data.startTime,
        venue: data.venue,
        pax_guest: data.paxGuest || null,
        theme_motif: data.themeMotif || null,
        street_address: data.streetAddress || null,
        barangay: data.barangay || null,
        city: data.city || null,
        province: data.province || null,
        postal_code: data.postalCode || null,
        price: formatPHP(totalPrice),
        theme_file_url: themeFileUrl,
        theme_file_name: themeFormattedName || null,
        receipt_file_url: receiptUrl,
        receipt_file_name: receiptFormattedName,
        backdrop_color: data.backdropColor || null,
        disclaimer_agreed: true,
        details_agreed: true,
      });

      if (error) throw error;

      // Send confirmation + admin notification emails (non-blocking for navigation)
      try {
        await supabase.functions.invoke("send-booking-emails", {
          body: {
            bookingNumber,
            clientName: data.name,
            email: data.email,
            phone: data.phone,
            booth: data.booth,
            packageType: data.packageType,
            eventName: data.eventName,
            eventDate: eventDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }),
            startTime: data.startTime,
            venue: data.venue,
            fullAddress,
            paxGuest: data.paxGuest || "",
            extensionHours,
            extensionTotal: extensionTotal ? formatPHP(extensionTotal) : "",
            unlimitedPrinting: !!data.unlimitedPrinting,
            unlimitedPrintingTotal: unlimitedPrintingTotal ? formatPHP(unlimitedPrintingTotal) : "",
            addOnsSummary,
            themeMotif: data.themeMotif || "",
            backdropColor: data.backdropColor || "",
            basePrice: formatPHP(basePrice),
            travelFee: formatPHP(travelFee),
            travelZone,
            totalPrice: formatPHP(totalPrice),
            paymentMethod: "GCash / UnionBank QR",
            submittedAt: new Date().toLocaleString("en-PH", { dateStyle: "long", timeStyle: "short" }),
            themeFileName: themeFormattedName,
            themeFileUrl,
            receiptFileName: receiptFormattedName,
            receiptFileUrl: receiptUrl,
          },
        });
      } catch (emailErr) {
        console.error("Email send failed (booking still saved):", emailErr);
      }

      // Create Google Calendar event (non-blocking)
      try {
        await supabase.functions.invoke("calendar-create-event", {
          body: {
            bookingNumber,
            clientName: data.name,
            email: data.email,
            phone: data.phone,
            booth: data.booth,
            packageType: data.packageType,
            eventName: data.eventName,
            eventDate: eventDate.toISOString().split("T")[0],
            startTime: data.startTime,
            durationHours: 4,
            fullAddress,
            paxGuest: data.paxGuest || "",
            themeMotif: data.themeMotif || "",
            backdropColor: data.backdropColor || "",
            totalPrice: formatPHP(totalPrice),
          },
        });
      } catch (calErr) {
        console.error("Calendar event creation failed (booking still saved):", calErr);
      }

      navigate("/book/confirmed", {
        state: { bookingNumber, email: data.email, eventName: data.eventName },
      });
    } catch (err: any) {
      console.error("Booking submission error:", err);
      toast({
        title: "Submission Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const summaryRows = [
    { label: "Name", value: data.name },
    { label: "Email", value: data.email },
    { label: "Contact", value: data.phone },
    { label: "Event Package", value: data.booth },
    { label: "Package Type", value: data.packageType },
    { label: "Event Name", value: data.eventName },
    { label: "Event Date", value: eventDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) },
    { label: "Location", value: fullAddress },
    { label: "Start Time", value: data.startTime },
    { label: "Venue", value: data.venue },
    { label: "Pax / Guest", value: data.paxGuest },
    { label: "Theme / Motif", value: data.themeMotif || "—" },
    { label: "Backdrop Color", value: data.backdropColor || "—" },
    { label: "Add-ons", value: addOnsSummary },
  ];

  return (
    <Layout>
      <section className="section-padding">
        <div className="container mx-auto max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-4xl md:text-5xl font-bold text-center mb-4"
          >
            QUOTATION & <span className="text-primary">PAYMENT</span>
          </motion.h1>
          <p className="text-center text-muted-foreground mb-10">
            Review your booking details and complete payment
          </p>

          {/* Booking Summary */}
          <div className="bg-card border border-border rounded-lg p-6 md:p-8 mb-6">
            <h2 className="font-heading text-xl tracking-widest mb-6 flex items-center gap-2">
              <FileText size={20} className="text-primary" /> BOOKING SUMMARY
            </h2>
            <div className="space-y-3">
              {summaryRows.map((row) => (
                <div key={row.label} className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-border pb-3 last:border-0">
                  <span className="text-sm text-muted-foreground font-heading tracking-wider">{row.label}</span>
                  <span className="text-sm text-foreground sm:text-right">{row.value}</span>
                </div>
              ))}
            </div>

            {/* Theme Reference Preview */}
            {data.themePreview && (
              <div className="mt-4 pt-4 border-t border-border">
                <span className="text-sm text-muted-foreground font-heading tracking-wider block mb-2">Theme Reference</span>
                <img src={data.themePreview} alt="Theme reference" className="w-24 h-24 object-cover rounded-lg border border-border" />
                {data.themeFileName && <p className="text-xs text-muted-foreground mt-1">{data.themeFileName}</p>}
              </div>
            )}

            {/* Price Quotation */}
            <div className="mt-6 pt-6 border-t border-border space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{data.booth} Package — {data.packageType}</span>
                <span className="text-foreground">{formatPHP(basePrice)}</span>
              </div>
              <div className="flex justify-between items-start text-sm">
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Travel Fee (Based on Event Location)</span>
                  <span className="text-xs text-muted-foreground/70 italic">{data.city ? `${data.city} — ${travelZone}` : travelZone}</span>
                </div>
                <span className="text-foreground">{formatPHP(travelFee)}</span>
              </div>
              {extensionHours > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Extension — {extensionHours} hour{extensionHours > 1 ? "s" : ""} (₱{extensionRate.toLocaleString()}/hr)</span>
                  <span className="text-foreground">{formatPHP(extensionTotal)}</span>
                </div>
              )}
              {data.unlimitedPrinting && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Unlimited Printing</span>
                  <span className="text-foreground">{formatPHP(2000)}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-3 border-t border-border">
                <span className="font-heading tracking-widest text-lg">TOTAL</span>
                <span className="font-heading text-2xl md:text-3xl font-bold text-primary">{formatPHP(totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Disclaimers */}
          <div className="bg-card border border-border rounded-lg p-6 md:p-8 mb-6 space-y-4">
            <h2 className="font-heading text-xl tracking-widest mb-4">AGREEMENTS</h2>
            <div className="bg-background border border-border rounded-lg p-4 mb-4">
              <p className="text-xs font-heading tracking-widest text-muted-foreground mb-2">PHOTOBOOTH DISCLAIMER</p>
              <p className="text-sm text-foreground leading-relaxed">
                I understand and agree that the Photo Booth service runs continuously during the booked rental period and cannot be paused, stopped, refunded, or extended due to inactivity or event delays.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Checkbox
                id="disclaimer"
                checked={disclaimerChecked}
                onCheckedChange={(v) => setDisclaimerChecked(v === true)}
                className="mt-0.5"
              />
              <label htmlFor="disclaimer" className="text-sm text-foreground cursor-pointer leading-relaxed">
                I agree with the <span className="text-primary font-medium">Continuous Photo Booth Disclaimer</span> above.
              </label>
            </div>
            <div className="flex items-start gap-3">
              <Checkbox
                id="details"
                checked={detailsChecked}
                onCheckedChange={(v) => setDetailsChecked(v === true)}
                className="mt-0.5"
              />
              <label htmlFor="details" className="text-sm text-foreground cursor-pointer leading-relaxed">
                I agree with all the details above.
              </label>
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-card border border-border rounded-lg p-6 md:p-8 mb-6">
            <h2 className="font-heading text-xl tracking-widest mb-6 flex items-center gap-2">
              <CreditCard size={20} className="text-primary" /> PAYMENT
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Scan any of the QR codes below to send your payment, then upload the receipt.
            </p>

            {/* QR Codes — hover to zoom on desktop for easier scanning */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-background border border-border rounded-lg p-6 text-center group relative overflow-visible">
                <div className="w-48 h-48 mx-auto mb-3 relative">
                  <img
                    src={gcashQR}
                    alt="GCash payment QR code for Photonix"
                    className="w-48 h-48 object-contain rounded-lg transition-transform duration-300 md:group-hover:scale-[2] md:group-hover:relative md:group-hover:z-30 md:group-hover:shadow-2xl bg-white"
                  />
                </div>
                <p className="font-heading text-sm tracking-widest">GCash</p>
                <p className="text-xs text-muted-foreground mt-1 hidden md:block">Hover to zoom</p>
              </div>
              <div className="bg-background border border-border rounded-lg p-6 text-center group relative overflow-visible">
                <div className="w-48 h-48 mx-auto mb-3 relative">
                  <img
                    src={unionbankQR}
                    alt="UnionBank QR Ph payment code for Photonix Photo Booth Services"
                    className="w-48 h-48 object-contain rounded-lg transition-transform duration-300 md:group-hover:scale-[2] md:group-hover:relative md:group-hover:z-30 md:group-hover:shadow-2xl bg-white"
                  />
                </div>
                <p className="font-heading text-sm tracking-widest">UnionBank</p>
                <p className="text-xs text-muted-foreground mt-1 hidden md:block">Hover to zoom</p>
              </div>
            </div>

            {/* Receipt Upload */}
            <div>
              <label className="text-sm text-muted-foreground font-heading tracking-widest block mb-3">UPLOAD RECEIPT *</label>
              <input
                ref={receiptInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                onChange={handleReceiptUpload}
                className="hidden"
                id="receipt-upload"
              />
              {!receiptFile ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => receiptInputRef.current?.click()}
                  className="gap-2"
                >
                  <Upload size={16} /> Upload Receipt
                </Button>
              ) : (
                <div className="flex items-center gap-3 bg-background border border-border rounded-lg p-3">
                  {receiptPreview ? (
                    <img src={receiptPreview} alt="Receipt" className="w-16 h-16 object-cover rounded" />
                  ) : (
                    <FileText size={24} className="text-muted-foreground" />
                  )}
                  <span className="text-sm text-foreground flex-1 truncate">{receiptFile.name}</span>
                  <button type="button" onClick={removeReceipt} className="text-muted-foreground hover:text-foreground">
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <Button
            size="lg"
            className="w-full font-heading tracking-widest"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <><Loader2 size={18} className="animate-spin mr-2" /> SUBMITTING...</>
            ) : (
              "PAYMENT & BOOKING"
            )}
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default BookingQuotation;
