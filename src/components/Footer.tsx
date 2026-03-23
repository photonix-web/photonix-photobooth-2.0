import { Facebook, Instagram, Phone, Mail, MapPin } from "lucide-react";
import logo from "@/assets/photonix-logo.png";

const Footer = () => (
  <footer className="bg-secondary border-t border-border section-padding">
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
      <div>
        <img src={logo} alt="Photonix Photobooth" className="h-8 mb-4" />
        <p className="text-muted-foreground text-sm leading-relaxed">
          Your mobile pop-up photobooth — making your events memorable.
        </p>
      </div>
      <div>
        <h4 className="font-heading text-sm tracking-widest mb-4">CONTACT</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2"><Phone size={14} /> +63 970 155 2933</li>
          <li className="flex items-center gap-2"><Mail size={14} /> photonix.biz@gmail.com</li>
          <li className="flex items-center gap-2"><MapPin size={14} /> Tagum City, Davao del Norte</li>
        </ul>
      </div>
      <div>
        <h4 className="font-heading text-sm tracking-widest mb-4">FOLLOW US</h4>
        <div className="flex gap-4">
          <a href="https://www.facebook.com/photonixphotobooth" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <Facebook size={24} />
          </a>
          <a href="https://www.instagram.com/photonixbooth/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <Instagram size={24} />
          </a>
        </div>
      </div>
    </div>
    <div className="container mx-auto mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground">
      © {new Date().getFullYear()} Photonix Photobooth. All rights reserved.
    </div>
  </footer>
);

export default Footer;
