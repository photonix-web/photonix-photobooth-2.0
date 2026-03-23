import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const booths = [
  {
    name: "Basic",
    subtitle: "Standard Boxed Photobooth",
    prices: [
      { format: "4R Style (4\" × 6\")", price: "₱10,000" },
      { format: "Photo-strip", price: "₱10,500" },
      { format: "5 Frames", price: "₱11,000" },
    ],
    features: [
      "2-Hour photo session",
      "Unlimited photo shoots",
      "1 print-out per session",
      "Live interactive touch operation",
      "Customized layouts/templates",
      "Photo Standee Included",
      "Photobooth Attendant available",
      "Free use of sanitized props",
      "Logistics, Set-up & Takedown",
    ],
  },
  {
    name: "Classic",
    subtitle: "Curtain Wide-Angle Photobooth",
    popular: true,
    prices: [
      { format: "4R Style (4\" × 6\")", price: "₱10,500" },
      { format: "Photo-strip", price: "₱11,000" },
      { format: "5 Frames", price: "₱11,500" },
    ],
    features: [
      "2-Hour photo session",
      "Box Frame & Acrylic Light Sign Included",
      "Unlimited photo shoots",
      "1 print-out per session",
      "Live interactive touch operation",
      "Customized layouts/templates",
      "Photo Standee Included",
      "Photobooth Attendant available",
      "Free use of sanitized props",
      "Logistics, Set-up & Takedown",
    ],
  },
  {
    name: "High-Angle",
    subtitle: "High-Angle Photobooth",
    prices: [
      { format: "4R Style (4\" × 6\")", price: "₱12,000" },
      { format: "Photo-strip", price: "₱12,500" },
      { format: "5 Frames", price: "₱13,000" },
    ],
    features: [
      "2-Hour photo session",
      "Unlimited photo shoots",
      "1 print-out per session",
      "Live interactive touch operation",
      "Customized layouts/templates",
      "Photo Standee Included",
      "Attendant available",
      "Free use of sanitized props",
      "Logistics, Set-up & Takedown",
    ],
  },
];

const Services = () => (
  <Layout>
    <section className="section-padding">
      <div className="container mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-5xl font-bold text-center mb-4"
        >
          OUR <span className="text-primary">SERVICES</span>
        </motion.h1>
        <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
          Choose the perfect photobooth package for your event
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {booths.map((booth, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`relative bg-card border rounded-lg overflow-hidden ${
                booth.popular ? "border-primary ring-2 ring-primary" : "border-border"
              }`}
            >
              {booth.popular && (
                <div className="bg-primary text-primary-foreground text-center py-1 text-xs font-heading tracking-widest">
                  MOST POPULAR
                </div>
              )}
              <div className="p-8">
                <h3 className="font-heading text-2xl font-bold">{booth.name}</h3>
                <p className="text-muted-foreground text-sm mt-1">{booth.subtitle}</p>

                {/* Prices */}
                <div className="mt-6 space-y-3">
                  {booth.prices.map((price, j) => (
                    <div key={j} className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-sm text-muted-foreground">{price.format}</span>
                      <span className="font-heading font-bold text-primary text-lg">{price.price}</span>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <ul className="mt-6 space-y-2">
                  {booth.features.map((f, j) => (
                    <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span> {f}
                    </li>
                  ))}
                </ul>

                {/* Add-ons */}
                <div className="mt-6 pt-4 border-t border-border text-xs text-muted-foreground space-y-1">
                  <p>Extension Rate per hour: ₱2,500</p>
                  <p>Add Unli Reprint: ₱2,000</p>
                  <p className="italic mt-2">*Prices subject to change without prior notice.</p>
                </div>

                <Button asChild className="w-full mt-6 font-heading tracking-widest">
                  <Link to="/book">BOOK THIS PACKAGE</Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sample photos placeholder */}
        <div className="mt-16">
          <h2 className="font-heading text-3xl font-bold text-center mb-8">
            SAMPLE <span className="text-primary">PHOTOS</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["4R Style", "Photo-strip", "5 Frames", "Polaroid"].map((label, i) => (
              <div key={i} className="bg-card border border-border rounded-lg aspect-[3/4] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-muted rounded-lg flex items-center justify-center text-primary font-heading text-xl mb-3">
                    📸
                  </div>
                  <p className="text-sm text-muted-foreground font-heading tracking-widest">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default Services;
