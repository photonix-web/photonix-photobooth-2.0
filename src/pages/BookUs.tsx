import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { ChevronRight, CalendarDays, X } from "lucide-react";
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

const generateBookingNumber = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "PTX-";
  for (let i = 0; i < 6; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
};

const BookUs = () => {
  const [date, setDate] = useState<Date | undefined>();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingNumber, setBookingNumber] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    booth: "",
    packageType: "",
    eventName: "",
    location: "",
    startTime: "",
    venue: "",
    paxGuest: "",
    themeMotif: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = generateBookingNumber();
    setBookingNumber(num);
    setShowConfirmation(true);
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
    setDate(undefined);
    setForm({
      name: "", email: "", phone: "", booth: "", packageType: "",
      eventName: "", location: "", startTime: "", venue: "", paxGuest: "", themeMotif: "",
    });
  };

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
              <label className="text-sm text-muted-foreground font-heading tracking-widest block mb-2">NAME *</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" required className="bg-background border-border" />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-muted-foreground font-heading tracking-widest block mb-2">EMAIL *</label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" required className="bg-background border-border" />
            </div>

            {/* Contact Number */}
            <div>
              <label className="text-sm text-muted-foreground font-heading tracking-widest block mb-2">CONTACT NUMBER *</label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+63 XXX XXX XXXX" required className="bg-background border-border" />
            </div>

            {/* Event Package & Package Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm text-muted-foreground font-heading tracking-widest block mb-2">EVENT PACKAGE *</label>
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
                <label className="text-sm text-muted-foreground font-heading tracking-widest block mb-2">PACKAGE TYPE *</label>
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
              <label className="text-sm text-muted-foreground font-heading tracking-widest block mb-2">EVENT NAME (TO BE ADDED IN DESIGN FRAME) *</label>
              <Input value={form.eventName} onChange={(e) => setForm({ ...form, eventName: e.target.value })} placeholder="e.g. John & Jane's Wedding" required className="bg-background border-border" />
            </div>

            {/* Date */}
            <div>
              <label className="text-sm text-muted-foreground font-heading tracking-widest block mb-2 flex items-center gap-2">
                <CalendarDays size={16} className="text-primary" /> DATE *
              </label>
              <div className="bg-background border border-border rounded-lg p-4 inline-block">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) => d < new Date()}
                  className="pointer-events-auto"
                />
              </div>
              {date && (
                <p className="text-sm text-muted-foreground mt-2">
                  Selected: {date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                </p>
              )}
            </div>

            {/* Event Location */}
            <div>
              <label className="text-sm text-muted-foreground font-heading tracking-widest block mb-2">EVENT LOCATION ADDRESS *</label>
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Full address of the venue" required className="bg-background border-border" />
            </div>

            {/* Time to Start & Venue */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm text-muted-foreground font-heading tracking-widest block mb-2">TIME TO START BOOTH *</label>
                <Input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} required className="bg-background border-border" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground font-heading tracking-widest block mb-2">VENUE *</label>
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
              <label className="text-sm text-muted-foreground font-heading tracking-widest block mb-2">PAX GUEST *</label>
              <Input type="number" value={form.paxGuest} onChange={(e) => setForm({ ...form, paxGuest: e.target.value })} placeholder="Number of guests" required className="bg-background border-border" />
            </div>

            {/* Event Theme Motif */}
            <div>
              <label className="text-sm text-muted-foreground font-heading tracking-widest block mb-2">EVENT THEME MOTIF</label>
              <Input value={form.themeMotif} onChange={(e) => setForm({ ...form, themeMotif: e.target.value })} placeholder="e.g. Rustic, Minimalist, Tropical" className="bg-background border-border" />
            </div>

            <Button type="submit" size="lg" className="w-full font-heading tracking-widest mt-4" disabled={!date}>
              SUBMIT BOOKING
            </Button>
          </form>
        </div>
      </section>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={closeConfirmation}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white text-black rounded-lg p-8 md:p-10 max-w-md w-full text-center relative"
            >
              <button onClick={closeConfirmation} className="absolute top-4 right-4 text-black/50 hover:text-black">
                <X size={20} />
              </button>
              <div className="text-4xl mb-4">✅</div>
              <h2 className="font-heading text-2xl font-bold mb-2">Booking Submitted!</h2>
              <p className="text-sm text-black/70 leading-relaxed mb-4">
                Kindly be on the lookout for a confirmation email with the quotation. Please contact us on Messenger for any additional inquiries.
              </p>
              <div className="bg-gray-100 rounded-lg p-4 mb-6">
                <p className="text-xs text-black/50 font-heading tracking-widest mb-1">BOOKING NUMBER</p>
                <p className="font-heading text-xl font-bold">{bookingNumber}</p>
              </div>
              <Button onClick={closeConfirmation} className="w-full font-heading tracking-widest bg-black text-white hover:bg-black/90">
                CLOSE
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default BookUs;
