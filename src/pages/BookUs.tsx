import { motion } from "framer-motion";
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { ChevronRight, Clock, CalendarDays } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
  "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM",
];

const boothOptions = ["Basic (Standard Boxed)", "Classic (Curtain Wide-Angle)", "High-Angle"];

const BookUs = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", booth: "", eventType: "", notes: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Booking Request Submitted!",
      description: `We'll confirm your booking for ${date?.toLocaleDateString()} at ${time}. Check your email for confirmation.`,
    });
    setStep(1);
    setDate(undefined);
    setTime("");
    setForm({ name: "", email: "", phone: "", booth: "", eventType: "", notes: "" });
  };

  return (
    <Layout>
      <section className="section-padding">
        <div className="container mx-auto max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-5xl font-bold text-center mb-4"
          >
            BOOK <span className="text-primary">US</span>
          </motion.h1>
          <p className="text-center text-muted-foreground mb-12">
            Schedule your event photobooth in 3 easy steps
          </p>

          {/* Steps indicator */}
          <div className="flex items-center justify-center gap-4 mb-12">
            {[
              { num: 1, label: "Select Date" },
              { num: 2, label: "Choose Time" },
              { num: 3, label: "Your Details" },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-heading text-sm ${
                    step >= s.num
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s.num}
                </div>
                <span className="hidden md:inline text-sm text-muted-foreground font-heading tracking-widest">
                  {s.label}
                </span>
                {i < 2 && <ChevronRight size={16} className="text-muted-foreground mx-2" />}
              </div>
            ))}
          </div>

          {/* Step 1: Calendar */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center"
            >
              <div className="flex items-center gap-2 mb-6 text-muted-foreground">
                <CalendarDays size={20} className="text-primary" />
                <span className="font-heading tracking-widest text-sm">SELECT YOUR EVENT DATE</span>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) => d < new Date()}
                  className="pointer-events-auto"
                />
              </div>
              <Button
                onClick={() => date && setStep(2)}
                disabled={!date}
                size="lg"
                className="mt-8 font-heading tracking-widest"
              >
                CONTINUE <ChevronRight size={16} className="ml-2" />
              </Button>
            </motion.div>
          )}

          {/* Step 2: Time */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center"
            >
              <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                <Clock size={20} className="text-primary" />
                <span className="font-heading tracking-widest text-sm">SELECT START TIME</span>
              </div>
              <p className="text-muted-foreground text-sm mb-6">{date?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3 w-full max-w-lg">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setTime(slot)}
                    className={`py-3 px-4 rounded-lg border text-sm font-heading tracking-wider transition-colors ${
                      time === slot
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground hover:border-primary"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
              <div className="flex gap-4 mt-8">
                <Button variant="outline" onClick={() => setStep(1)} className="font-heading tracking-widest border-border">
                  BACK
                </Button>
                <Button onClick={() => time && setStep(3)} disabled={!time} className="font-heading tracking-widest">
                  CONTINUE <ChevronRight size={16} className="ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Form */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-card border border-border rounded-lg p-4 mb-8 flex flex-wrap gap-6 justify-center text-sm">
                <span className="text-muted-foreground">📅 {date?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
                <span className="text-muted-foreground">🕐 {time}</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 max-w-lg mx-auto">
                <div>
                  <label className="text-sm text-muted-foreground font-heading tracking-widest block mb-2">FULL NAME *</label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" required className="bg-card border-border" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground font-heading tracking-widest block mb-2">EMAIL *</label>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" required className="bg-card border-border" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground font-heading tracking-widest block mb-2">PHONE</label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+63 XXX XXX XXXX" className="bg-card border-border" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground font-heading tracking-widest block mb-2">BOOTH PACKAGE *</label>
                  <select
                    value={form.booth}
                    onChange={(e) => setForm({ ...form, booth: e.target.value })}
                    required
                    className="w-full rounded-md border border-border bg-card text-foreground px-3 py-2 text-sm"
                  >
                    <option value="">Select a package</option>
                    {boothOptions.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground font-heading tracking-widest block mb-2">EVENT TYPE</label>
                  <Input value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value })} placeholder="e.g. Wedding, Birthday, Corporate" className="bg-card border-border" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground font-heading tracking-widest block mb-2">ADDITIONAL NOTES</label>
                  <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Any special requests or details..." rows={3} className="bg-card border-border" />
                </div>
                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={() => setStep(2)} className="font-heading tracking-widest border-border">
                    BACK
                  </Button>
                  <Button type="submit" size="lg" className="flex-1 font-heading tracking-widest">
                    CONFIRM BOOKING
                  </Button>
                </div>
              </form>

              <p className="text-center text-xs text-muted-foreground mt-8">
                By booking, your appointment will be synced to our calendar. We'll send a confirmation email shortly.
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default BookUs;
