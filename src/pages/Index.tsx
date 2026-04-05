import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useState } from "react";
import Layout from "@/components/Layout";
import heroImage from "@/assets/PTX-hero-new.png";
import heroGallery from "@/assets/hero-2-new.png";
import logo from "@/assets/photonix-logo.png";
import school from "@/assets/school-event.jpg";
import wedding from "@/assets/weddings-event.jpg";
import corporate from "@/assets/corporates-event.jpg";
import { Button } from "@/components/ui/button";

const events = [
  { img: school, title: "University Intramural Meet", desc: "Fun-filled photo sessions with students" },
  { img: wedding, title: "Wedding Celebrations", desc: "Capturing love stories beautifully" },
  { img: corporate, title: "Corporate Year-End Party", desc: "Making corporate events memorable" },
];

const testimonials = [
  { name: "Shane", text: "I had such a great time! First of all, super accommodating ang mga tig handle and comfortable kaayo sila ka talk. Budget-friendly with nice quality. Makagwapa jud kaayo ilang booth guys 🤩" },
  { name: "Ruby Pearl", text: "Thank you so much for the fantastic photobooth experience at our wedding day! Everyone loved the fun props and the high-quality photos. Your team was friendly and made everything run smoothly. 🫶🏼" },
  { name: "Eina", text: "As one of the organizers, it makes me happy seeing our students enjoy having their photos taken here in photonix. The staff are very kind and considerate to each of our requests. 🩷" },
  { name: "Kin", text: "Photos turned out vibrant and clear, lots of frames to choose from at an affordable price. Friendly staff and lots of props to make your photos more fun. Would recommend!" },
  { name: "Iris", text: "The quality of the pictures was great for a student-friendly price. Thank you for capturing the moment with us with your friendly service. Bless your business! 🫶" },
  { name: "Saeed", text: "Huge thanks for making an unforgettable night! Your photobooth's creativity, quality and fun factors exceeded our expectations! Your team's professionalism made every guest feel special. 🫶🏻" },
];

const Index = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const next = () => setCurrentTestimonial((p) => (p + 1) % testimonials.length);
  const prev = () => setCurrentTestimonial((p) => (p - 1 + testimonials.length) % testimonials.length);

  return (
    <Layout>
      {/* Hero */}
      <section
        className="relative min-h-[70vh] flex items-center section-padding overflow-hidden"
      >
        <img
          src={heroImage}
          alt=""
          className="absolute right-[-25px] bottom-[-25px] w-auto h-[78%] object-contain"
        />
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <img src={logo} alt="Photonix Photobooth" className="h-28 md:h-36 mb-6" />
            <p className="text-muted-foreground text-lg max-w-md leading-relaxed">
              Your mobile pop-up photobooth — making your events memorable.
            </p>
            <div className="flex gap-4 mt-8">
              <Button asChild size="lg" className="font-heading tracking-widest">
                <Link to="/book">BOOK NOW</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-heading tracking-widest border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <Link to="/services">OUR SERVICES</Link>
              </Button>
            </div>
            <div className="flex gap-6 mt-8 text-sm text-muted-foreground">
              <a href="https://www.facebook.com/photonixphotobooth" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">facebook.com/photonixphotobooth</a>
              <a href="https://www.instagram.com/photonixbooth/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">@photonixbooth</a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Events */}
      <section className="section-padding bg-secondary">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-4xl font-bold text-center mb-4"
          >
            FEATURED <span className="text-primary">EVENTS</span>
          </motion.h2>
          <p className="text-center text-muted-foreground mb-12">Pop-ups and events we've been part of</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="group rounded-lg overflow-hidden bg-card border border-border hover:border-primary transition-colors"
              >
                <div className="overflow-hidden">
                  <img
                    src={event.img}
                    alt={event.title}
                    loading="lazy"
                    width={800}
                    height={600}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-lg font-semibold">{event.title}</h3>
                  <p className="text-muted-foreground text-sm mt-2">{event.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <a
              href="https://www.facebook.com/photonixphotobooth"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-heading tracking-widest text-sm"
            >
              CHECK MORE EVENTS ON OUR FACEBOOK PAGE →
            </a>
          </div>
        </div>
      </section>

      {/* Gallery Hero */}
          <section className="w-full overflow-hidden">
            <img
                src={heroGallery}
                alt="Photonix Photobooth Gallery"
                className="w-full h-auto"
            />
            </section>

      {/* Testimonials */}
      <section className="section-padding">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-heading text-4xl font-bold text-center mb-4">
            <span className="text-primary">TESTIMONIALS</span>
          </h2>
          <p className="text-center text-muted-foreground mb-12">Here's what our customers and clients have to say</p>

          <div className="relative bg-card border border-border rounded-lg p-8 md:p-12 min-h-[250px] flex flex-col items-center justify-center text-center">
            <Quote className="text-primary mb-4" size={36} />
            <motion.p
              key={currentTestimonial}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="text-foreground leading-relaxed text-lg italic"
            >
              "{testimonials[currentTestimonial].text}"
            </motion.p>
            <p className="mt-6 font-heading text-primary tracking-widest text-sm">
              — {testimonials[currentTestimonial].name}
            </p>

            <div className="flex gap-4 mt-8">
              <button onClick={prev} className="p-2 rounded-full border border-border hover:border-primary hover:text-primary transition-colors">
                <ChevronLeft size={20} />
              </button>
              <button onClick={next} className="p-2 rounded-full border border-border hover:border-primary hover:text-primary transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="flex gap-2 mt-4">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentTestimonial(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${i === currentTestimonial ? "bg-primary" : "bg-muted"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-foreground text-background text-center">
        <div className="container mx-auto">
          <h2 className="font-heading text-4xl font-bold mb-4">READY TO BOOK YOUR EVENT?</h2>
          <p className="mb-8 text-background/70">Let's make memories together!</p>
          <Button asChild size="lg" className="font-heading tracking-widest bg-background text-foreground hover:bg-background/90">
            <Link to="/book">BOOK NOW</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
