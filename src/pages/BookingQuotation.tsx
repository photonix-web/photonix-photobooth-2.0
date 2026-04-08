import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, X, FileText, CreditCard } from "lucide-react";

const priceMap: Record<string, Record<string, string>> = {
  Basic: { "4R": "₱4,000", Photostrip: "₱4,500", Polaroid: "₱4,500", "5 Frames": "₱5,000" },
  Curtain: { "4R": "₱6,000", Photostrip: "₱6,500", Polaroid: "₱6,500", "5 Frames": "₱7,000" },
  Classic: { "4R": "₱10,000", Photostrip: "₱10,500", Polaroid: "₱10,500", "5 Frames": "₱11,000" },
  "High-Angle": { "4R": "₱12,000", Photostrip: "₱12,500", Polaroid: "₱12,500", "5 Frames": "₱13,000" },
};

const generateBookingNumber = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "PTX-";
  for (let i = 0; i < 6; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
};

const BookingQuotation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state as Record<string, string> | null;

  const [disclaimerChecked, setDisclaimerChecked] = useState(false);
  const [detailsChecked, setDetailsChecked] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const receiptInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!data) navigate("/book");
  }, [data, navigate]);

  if (!data) return null;

  const eventDate = new Date(data.date);
  const price = priceMap[data.booth]?.[data.packageType] || "TBD";
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

  const canSubmit = disclaimerChecked && detailsChecked && receiptFile;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const bookingNumber = generateBookingNumber();
    navigate("/book/confirmed", {
      state: { bookingNumber, email: data.email, eventName: data.eventName },
    });
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
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="font-heading tracking-widest text-lg">TOTAL</span>
                <span className="font-heading text-2xl md:text-3xl font-bold text-primary">{price}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {data.booth} Package — {data.packageType}
              </p>
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

            {/* QR Placeholders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-background border border-border rounded-lg p-6 text-center">
                <div className="w-40 h-40 mx-auto bg-muted rounded-lg flex items-center justify-center mb-3">
                  <span className="text-muted-foreground text-xs font-heading tracking-widest">GCASH QR</span>
                </div>
                <p className="font-heading text-sm tracking-widest">GCash</p>
              </div>
              <div className="bg-background border border-border rounded-lg p-6 text-center">
                <div className="w-40 h-40 mx-auto bg-muted rounded-lg flex items-center justify-center mb-3">
                  <span className="text-muted-foreground text-xs font-heading tracking-widest">UNIONBANK QR</span>
                </div>
                <p className="font-heading text-sm tracking-widest">UnionBank</p>
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
            PAYMENT & BOOKING
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default BookingQuotation;
