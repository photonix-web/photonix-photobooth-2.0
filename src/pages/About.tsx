import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import teamEm from "@/assets/team-em.png";
import teamKin from "@/assets/team-kin.png";

const About = () => (
  <Layout>
    <section className="section-padding">
      <div className="container mx-auto max-w-5xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-5xl font-bold text-center mb-4"
        >
          ABOUT <span className="text-primary">US</span>
        </motion.h1>
        <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
          Get to know the story behind Photonix
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-heading text-3xl font-bold mb-6">OUR <span className="text-primary">STORY</span></h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                What started as a passion project has blossomed into a memorable experience for countless events! Em, with a heartfelt enthusiasm for photography and collecting cherished memories, joined forces with her brother to create a photobooth service that combines affordability with premium features.
              </p>
              <p>
                Our mission is simple: to make your events unforgettable while providing high-quality service at rates that won't break the bank.
              </p>
              <p>
                Based in Tagum City, we're proud to bring joy and creativity to events in our local area and beyond. We're DTI & BIR registered and operate with a business permit from the city, maintaining a standard of quality you can trust.
              </p>
              <p>
                Whether it's a university event, a wedding, or a simple gathering, we're here to help you capture every special moment in style. Let's make memories together!
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center"
          >
            <img src={teamEm} alt="Photonix Founders" loading="lazy" width={800} height={600} className="rounded-lg border border-border shadow-xl w-full max-w-md object-cover" />
          </motion.div>
        </div>
      </div>
    </section>

    {/* Team */}
    <section className="section-padding bg-secondary">
      <div className="container mx-auto max-w-4xl">
        <h2 className="font-heading text-4xl font-bold text-center mb-12">
          MEET THE <span className="text-primary">TEAM</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { name: "Em", role: "Co-Founder & Creative Director", desc: "Passionate about photography and creating cherished memories through every booth experience.", img: teamEm },
            { name: "Kin", role: "Co-Founder & Operations Lead", desc: "Ensuring every event runs smoothly, from logistics to setup and teardown.", img: teamKin },
          ].map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-card border border-border rounded-lg p-8 text-center"
            >
              <img src={member.img} alt={member.name} loading="lazy" width={512} height={512} className="w-28 h-28 mx-auto rounded-full object-cover border-2 border-primary mb-4" />
              <h3 className="font-heading text-xl font-semibold">{member.name}</h3>
              <p className="text-primary text-sm font-heading tracking-widest mt-1">{member.role}</p>
              <p className="text-muted-foreground text-sm mt-4">{member.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default About;
