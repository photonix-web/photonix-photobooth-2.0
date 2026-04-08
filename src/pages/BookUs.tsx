import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays, Upload, X, Image } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const boothOptions = ["Basic", "Curtain", "Classic", "High-Angle"];
const packageTypes = ["4R", "Photostrip", "Polaroid", "5 Frames"];
const venueOptions = ["Indoor", "Outdoor"];

const provinces = [
  "Metro Manila", "Cavite", "Laguna", "Batangas", "Rizal", "Bulacan",
  "Pampanga", "Tarlac", "Zambales", "Pangasinan", "Cebu", "Davao del Sur",
  "Iloilo", "Negros Occidental", "Quezon",
];

const getMinDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  d.setHours(0, 0, 0, 0);
  return d;
};

const BookUs = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>();
  const [themeFile, setThemeFile] = useState<File | null>(null);
  const [themePreview, setThemePreview] = useState<string | null>(null);
  const themeInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    booth: "",
    packageType: "",
    eventName: "",
    streetAddress: "",
    barangay: "",
    city: "",
    province: "",
    postalCode: "",
    startTime: "",
    venue: "",
    paxGuest: "",
    themeMotif: "",
  });

  const handleThemeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThemeFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setThemePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeThemeFile = () => {
    setThemeFile(null);
    setThemePreview(null);
    if (themeInputRef.current) themeInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;

    const bookingData = {
      ...form,
      date: date.toISOString(),
      themeFileName: themeFile?.name || null,
      themePreview,
    };

    navigate("/book/quotation", { state: bookingData });
  };

  const minDate = getMinDate();

  const labelClass = "text-sm text-muted-foreground font-heading tracking-widest block mb-2";

  return (
    <Layout>
      <section className="section-padding">
        <div className="container mx-auto max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-5xl font-bold text-center mb-4"
          >
            BOOK <span className="text-primary">US</span>
          </motion.h1>
          <p className="text-center text-muted-foreground mb-12">
            Fill out the form below to book your photobooth experience
          </p>

          <form onSubmit={handleSubmit} className="space-y-5 bg-card border border-border rounded-lg p-6 md:p-10">
            {/* Name */}
            <div>
              <label className={labelClass}>NAME *</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" required className="bg-background border-border" />
            </div>

            {/* Email */}
            <div>
              <label className={labelClass}>EMAIL *</label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" required className="bg-background border-border" />
              <p className="text-xs text-muted-foreground mt-1.5 italic">
                Please use an active email, as we will contact you there for any questions and clarifications.
              </p>
            </div>

            {/* Contact Number */}
            <div>
              <label className={labelClass}>CONTACT NUMBER *</label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+63 XXX XXX XXXX" required className="bg-background border-border" />
            </div>

            {/* Event Package & Package Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>EVENT PACKAGE *</label>
                <Select value={form.booth} onValueChange={(v) => setForm({ ...form, booth: v })}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Select package" />
                  </SelectTrigger>
                  <SelectContent>
                    {boothOptions.map((o) => (
                      <SelectItem key={o} value={o}>{o}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className={labelClass}>PACKAGE TYPE *</label>
                <Select value={form.packageType} onValueChange={(v) => setForm({ ...form, packageType: v })}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {packageTypes.map((o) => (
                      <SelectItem key={o} value={o}>{o}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Event Name */}
            <div>
              <label className={labelClass}>EVENT NAME (TO BE ADDED IN DESIGN FRAME) *</label>
              <Input value={form.eventName} onChange={(e) => setForm({ ...form, eventName: e.target.value })} placeholder="e.g. John & Jane's Wedding" required className="bg-background border-border" />
            </div>

            {/* Date */}
            <div>
              <label className={`${labelClass} flex items-center gap-2`}>
                <CalendarDays size={16} className="text-primary" /> DATE *
              </label>
              <div className="bg-background border border-border rounded-lg p-4 inline-block">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) => d < minDate}
                  className="pointer-events-auto"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2 italic">
                We only accept and accommodate events booked at least 3 days in advance.
              </p>
              {date && (
                <p className="text-sm text-foreground mt-2">
                  Selected: {date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                </p>
              )}
            </div>

            {/* Event Location Address */}
            <div className="space-y-4">
              <label className={labelClass}>EVENT LOCATION ADDRESS *</label>
              <Input value={form.streetAddress} onChange={(e) => setForm({ ...form, streetAddress: e.target.value })} placeholder="Street Address / Building / Lot" required className="bg-background border-border" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input value={form.barangay} onChange={(e) => setForm({ ...form, barangay: e.target.value })} placeholder="Barangay" required className="bg-background border-border" />
                <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City / Municipality" required className="bg-background border-border" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select value={form.province} onValueChange={(v) => setForm({ ...form, province: v })}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Province" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} placeholder="Postal Code" required className="bg-background border-border" />
              </div>
            </div>

            {/* Time to Start & Venue */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>TIME TO START BOOTH *</label>
                <Input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} required className="bg-background border-border" />
              </div>
              <div>
                <label className={labelClass}>VENUE *</label>
                <Select value={form.venue} onValueChange={(v) => setForm({ ...form, venue: v })}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Select venue type" />
                  </SelectTrigger>
                  <SelectContent>
                    {venueOptions.map((o) => (
                      <SelectItem key={o} value={o}>{o}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Pax Guest */}
            <div>
              <label className={labelClass}>PAX GUEST *</label>
              <Input type="number" value={form.paxGuest} onChange={(e) => setForm({ ...form, paxGuest: e.target.value })} placeholder="Number of guests" required className="bg-background border-border" />
            </div>

            {/* Event Theme Motif */}
            <div>
              <label className={labelClass}>EVENT THEME MOTIF</label>
              <Input value={form.themeMotif} onChange={(e) => setForm({ ...form, themeMotif: e.target.value })} placeholder="e.g. Rustic, Minimalist, Tropical" className="bg-background border-border" />
            </div>

            {/* Theme Photo Upload */}
            <div>
              <label className={labelClass}>EVENT THEME / MOTIF REFERENCE (OPTIONAL)</label>
              <p className="text-xs text-muted-foreground mb-3">
                Let us know what you're specifically aiming for — upload your event invitation or any event photo/material so we can match it to your event.
              </p>
              <input
                ref={themeInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleThemeUpload}
                className="hidden"
                id="theme-upload"
              />
              {!themeFile ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => themeInputRef.current?.click()}
                  className="gap-2"
                >
                  <Upload size={16} /> Upload Photo
                </Button>
              ) : (
                <div className="flex items-center gap-3 bg-background border border-border rounded-lg p-3">
                  {themePreview ? (
                    <img src={themePreview} alt="Theme preview" className="w-16 h-16 object-cover rounded" />
                  ) : (
                    <Image size={24} className="text-muted-foreground" />
                  )}
                  <span className="text-sm text-foreground flex-1 truncate">{themeFile.name}</span>
                  <button type="button" onClick={removeThemeFile} className="text-muted-foreground hover:text-foreground">
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            <Button type="submit" size="lg" className="w-full font-heading tracking-widest mt-4" disabled={!date || !form.booth || !form.packageType || !form.venue || !form.province}>
              PROCEED TO QUOTATION
            </Button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default BookUs;
