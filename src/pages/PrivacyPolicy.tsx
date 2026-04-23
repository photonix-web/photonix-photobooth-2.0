import { motion } from "framer-motion";
import Layout from "@/components/Layout";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-8">
    <h2 className="font-heading text-xl md:text-2xl mb-3 text-foreground">{title}</h2>
    <div className="text-muted-foreground leading-relaxed space-y-2 text-sm md:text-base">
      {children}
    </div>
  </div>
);

const PrivacyPolicy = () => {
  return (
    <Layout>
      <section className="section-padding container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-heading text-3xl md:text-5xl mb-2">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-8">
            <span className="font-semibold">Effective Date:</span> April 10, 2026
          </p>

          <p className="text-muted-foreground leading-relaxed mb-10 text-sm md:text-base">
            At <span className="font-semibold text-foreground">Photonix Photobooth</span>, we respect your privacy and are
            committed to protecting your personal data in compliance with the Data Privacy Act of 2012.
          </p>

          <Section title="1. Information We Collect">
            <p>When you book our services or interact with us, we may collect the following personal information:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Full Name</li>
              <li>Contact Information (Email Address, Mobile Number)</li>
              <li>Event Details (Date, Venue, Occasion)</li>
              <li>Payment Information (for booking confirmation)</li>
              <li>Photos and videos taken during the event</li>
            </ul>
          </Section>

          <Section title="2. How We Use Your Information">
            <p>We use your information strictly for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>To process and manage your booking</li>
              <li>To communicate with you regarding your event</li>
              <li>To deliver our photobooth services</li>
              <li>To send confirmations, receipts, and updates</li>
              <li>To improve our services</li>
            </ul>
            <p>
              Photos and videos captured during events{" "}
              <span className="font-semibold text-foreground">
                may be used for portfolio, marketing, and social media purposes
              </span>
              , unless you request otherwise.
            </p>
          </Section>

          <Section title="3. Consent">
            <p>
              By submitting your information and availing of our services, you consent to the collection and use of your
              personal data as outlined in this policy.
            </p>
          </Section>

          <Section title="4. Data Sharing">
            <p>We do not sell, trade, or rent your personal data to third parties.</p>
            <p>Your information may only be shared when necessary with:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Payment processors</li>
              <li>Service providers directly related to your booking</li>
              <li>Legal authorities when required by law</li>
            </ul>
          </Section>

          <Section title="5. Data Retention">
            <p>We retain your personal data only for as long as necessary:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Booking information: for record-keeping and legal compliance</li>
              <li>Event photos/videos: for portfolio and marketing use, unless deletion is requested</li>
            </ul>
          </Section>

          <Section title="6. Your Rights">
            <p>Under the Data Privacy Act of 2012, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access your personal data</li>
              <li>Correct inaccurate or incomplete data</li>
              <li>Withdraw consent at any time</li>
              <li>Request deletion of your personal data and/or event photos</li>
            </ul>
            <p>To exercise these rights, you may contact us using the details below.</p>
          </Section>

          <Section title="7. Data Protection Measures">
            <p>
              We implement appropriate security measures to protect your personal data from unauthorized access,
              disclosure, or misuse.
            </p>
          </Section>

          <Section title="8. Requests for Removal">
            <p>
              If you wish to have your photos or personal data removed from our records or online platforms, you may
              send us a request, and we will process it within a reasonable timeframe.
            </p>
          </Section>

          <Section title="9. Contact Information">
            <p>For any privacy-related concerns or requests, you may contact us at:</p>
            <ul className="space-y-1">
              <li>📧 photonix.biz@gmail.com</li>
              <li>📱 +63 970 155 2933</li>
              <li>📍 Tagum City, Davao del Norte, 8100</li>
            </ul>
          </Section>
        </motion.div>
      </section>
    </Layout>
  );
};

export default PrivacyPolicy;
