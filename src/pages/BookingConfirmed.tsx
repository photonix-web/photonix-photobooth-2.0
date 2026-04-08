import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { CheckCircle, PartyPopper, Mail } from "lucide-react";

const BookingConfirmed = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state as { bookingNumber: string; email: string; eventName: string } | null;

  useEffect(() => {
    if (!data) navigate("/book");
  }, [data, navigate]);

  if (!data) return null;

  return (
    <Layout>
      <section className="section-padding min-h-[70vh] flex items-center">
        <div className="container mx-auto max-w-2xl text-center">
          {/* Celebration animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            className="mb-6"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-4">
              <CheckCircle size={48} className="text-primary" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <PartyPopper size={24} className="text-primary" />
              <PartyPopper size={24} className="text-primary" />
            </div>

            <h1 className="font-heading text-3xl md:text-5xl font-bold mb-4 leading-tight">
              YOUR BOOKING HAS BEEN <br />
              <span className="text-primary">SUBMITTED & CONFIRMED!</span>
            </h1>

            <p className="text-muted-foreground text-lg mb-4 max-w-lg mx-auto leading-relaxed">
              Please be on the lookout for any emails for any questions and/or clarification. See you at the event!
            </p>

            <p className="text-muted-foreground text-sm mb-4 max-w-lg mx-auto leading-relaxed">
              We will validate your payment and contact you via email if we need any questions or clarifications regarding your booking.
            </p>

            <p className="text-muted-foreground text-sm mb-8 max-w-lg mx-auto leading-relaxed">
              For faster assistance, you may also message us on our{" "}
              <a href="https://www.facebook.com/photonixphotobooth" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">Facebook Page</a>{" "}
              and include your Booking Number for any additional input or adjustments.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card border border-border rounded-lg p-6 md:p-8 mb-8 inline-block"
          >
            <p className="text-xs text-muted-foreground font-heading tracking-widest mb-2">BOOKING NUMBER</p>
            <p className="font-heading text-3xl font-bold text-primary">{data.bookingNumber}</p>
            {data.eventName && (
              <p className="text-sm text-muted-foreground mt-2">{data.eventName}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail size={14} />
              <span>Confirmation sent to <span className="text-foreground">{data.email}</span></span>
            </div>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="font-heading tracking-widest mt-4"
            >
              BACK TO HOME
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default BookingConfirmed;
