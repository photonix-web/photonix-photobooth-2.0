import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FareMatrixNotice from "../components/FareMatrixNotice";
import sample4R from "@/assets/sample-4r.png";
import samplePhotostrip from "@/assets/sample-photostrip.png";
import sample5Frames from "@/assets/sample-5frames.png";
import samplePolaroid from "@/assets/sample-polaroid.png";
import boothBasicFinal from "@/assets/Basic-Final.png";
import boothCurtainFinal from "@/assets/Curtain-Final.png";
import boothClassicFinal from "@/assets/Classic-Final.png";
import boothHighangleFinal from "@/assets/High-Angle-Final.png";
import boothBasicHover from "@/assets/Basic-Hover.jpg";
import boothCurtainHover from "@/assets/Curtain-Hover.jpg";
import boothClassicHover from "@/assets/Classic-Hover.jpg";
import boothHighangleHover from "@/assets/High-Angle-Hover.jpg";

const booths = [
  {
    name: "Basic",
    subtitle: "Backdrop + Stand only",
    image: boothBasicFinal,
    prices: [
      { format: "4R Style (4\" × 6\")", price: "₱4,000" },
      { format: "Photostrip / Polaroid", price: "₱4,500" },
      { format: "5 Frames", price: "₱5,000" },
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
    name: "Curtain",
    subtitle: "Curtain Photobooth",
    image: boothCurtainFinal,
    prices: [
      { format: "4R Style (4\" × 6\")", price: "₱6,000" },
      { format: "Photostrip / Polaroid", price: "₱6,500" },
      { format: "5 Frames", price: "₱7,000" },
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
    subtitle: "Boxed Retro Style Photobooth",
    image: boothClassicFinal,
    popular: true,
    prices: [
      { format: "4R Style (4\" × 6\")", price: "₱10,000" },
      { format: "Photostrip / Polaroid", price: "₱10,500" },
      { format: "5 Frames", price: "₱11,000" },
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
    image: boothHighangleFinal,
    prices: [
      { format: "4R Style (4\" × 6\")", price: "₱12,000" },
      { format: "Photostrip / Polaroid", price: "₱12,500" },
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {booths.map((booth, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative bg-card border rounded-lg overflow-hidden ${
                booth.popular ? "border-primary ring-2 ring-primary" : "border-border"
              }`}
            >
              {booth.popular && (
                <div className="bg-primary text-primary-foreground text-center py-1 text-xs font-heading tracking-widest">
                  MOST POPULAR
                </div>
              )}
              <div className="w-full h-48 overflow-hidden">
                <img
                  src={booth.image}
                  alt={booth.name}
                  className="w-full h-full object-cover"
                />
                </div>
              <div className="p-6">
                <h3 className="font-heading text-xl font-bold">{booth.name}</h3>
                <p className="text-muted-foreground text-sm mt-1">{booth.subtitle}</p>

                <div className="mt-5 space-y-2">
                  {booth.prices.map((price, j) => (
                    <div key={j} className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-xs text-muted-foreground">{price.format}</span>
                      <span className="font-heading font-bold text-primary text-base">{price.price}</span>
                    </div>
                  ))}
                </div>

                <ul className="mt-5 space-y-1.5">
                  {booth.features.map((f, j) => (
                    <li key={j} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span> {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 pt-3 border-t border-border text-xs text-muted-foreground space-y-1">
                  <p>Extension Rate per hour: ₱2,500</p>
                  <p>Add Unli Reprint: ₱2,000</p>
                  <p className="italic mt-2">*Prices subject to change without prior notice.</p>
                </div>

                <Button asChild className="w-full mt-5 font-heading tracking-widest text-sm">
                  <Link to="/book">BOOK THIS PACKAGE</Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <FareMatrixNotice />

        {/* Sample photos */}
        <div className="mt-16">
          <h2 className="font-heading text-3xl font-bold text-center mb-8">
            SAMPLE <span className="text-primary">PHOTOS</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "4R Style", img: sample4R },
              { label: "Photo-strip", img: samplePhotostrip },
              { label: "5 Frames", img: sample5Frames },
              { label: "Polaroid", img: samplePolaroid },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-lg overflow-hidden"
              >
                <img src={item.img} alt={item.label} className="w-full object-cover" />
                <p className="text-sm text-muted-foreground font-heading tracking-widest text-center py-3">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default Services;
