import { motion } from "framer-motion";
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Phone, Mail, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("send-contact-inquiry", {
        body: form,
      });
      if (error) throw error;
      toast({
        title: "Message sent!",
        description: "Thank you for your email. We'll respond as soon as possible.",
      });
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.error(err);
      toast({
        title: "Could not send message",
        description: "Please try again or message us on Messenger.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <section className="section-padding">
        <div className="container mx-auto max-w-5xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-5xl font-bold text-center mb-4"
          >
            <span className="text-primary">CONTACT</span> US
          </motion.h1>
          <p className="text-center text-muted-foreground mb-16 max-w-lg mx-auto">
            Have questions or inquiries? Send us a message or contact us via Messenger!
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-5"
            >
              <div>
                <label className="text-sm text-muted-foreground font-heading tracking-widest block mb-2">NAME</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name"
                  required
                  className="bg-card border-border"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground font-heading tracking-widest block mb-2">EMAIL</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="your@email.com"
                  required
                  className="bg-card border-border"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground font-heading tracking-widest block mb-2">PHONE</label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+63 XXX XXX XXXX"
                  className="bg-card border-border"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground font-heading tracking-widest block mb-2">MESSAGE</label>
                <Textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us about your event..."
                  rows={5}
                  required
                  className="bg-card border-border"
                />
              </div>
              <Button type="submit" size="lg" className="w-full font-heading tracking-widest">
                SEND MESSAGE
              </Button>
            </motion.form>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-8"
            >
              <div className="bg-card border border-border rounded-lg p-8 space-y-6">
                <div className="flex items-start gap-4">
                  <Phone className="text-primary mt-1" size={20} />
                  <div>
                    <h3 className="font-heading text-sm tracking-widest mb-1">PHONE</h3>
                    <p className="text-muted-foreground">+63 970 155 2933</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="text-primary mt-1" size={20} />
                  <div>
                    <h3 className="font-heading text-sm tracking-widest mb-1">EMAIL</h3>
                    <p className="text-muted-foreground">photonix.biz@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="text-primary mt-1" size={20} />
                  <div>
                    <h3 className="font-heading text-sm tracking-widest mb-1">LOCATION</h3>
                    <p className="text-muted-foreground">Tagum City, Davao del Norte, 8100</p>
                  </div>
                </div>
              </div>

              <a
                href="http://m.me/299017183285410"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-primary text-primary-foreground rounded-lg p-4 font-heading tracking-widest text-sm hover:opacity-90 transition-opacity"
              >
                <MessageCircle size={20} />
                MESSAGE US ON MESSENGER
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
