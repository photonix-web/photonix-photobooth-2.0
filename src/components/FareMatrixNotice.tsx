import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const fareZones = [
  {
    zone: "Home Base — FREE",
    color: "text-green-400",
    borderColor: "border-green-600",
    title: "Tagum City",
    distance: "",
    description: "No transportation fee within Tagum City",
    municipalities: [],
    price: "₱0",
    priceNote: "",
  },
  {
    zone: "Zone 1 — Davao del Norte (near Tagum)",
    color: "text-blue-400",
    borderColor: "border-blue-600",
    title: "Nearby Municipalities · ~15–35 km",
    distance: "",
    description: "",
    municipalities: ["Asuncion", "Sto. Tomas", "Carmen", "Panabo City", "New Corella", "Kapalong", "San Isidro"],
    price: "₱1,000",
    priceNote: "round-trip, per booking",
  },
  {
    zone: "Zone 2 — Davao del Norte (far)",
    color: "text-blue-400",
    borderColor: "border-blue-600",
    title: "Farther Municipalities · ~36–70 km",
    distance: "",
    description: "",
    municipalities: ["Braulio E. Dujali", "Talaingod", "Island Garden City of Samal (IGACOS)"],
    price: "₱1,500",
    priceNote: "round-trip, per booking",
  },
  {
    zone: "Zone 3 — Compostela Valley (Davao de Oro)",
    color: "text-yellow-600",
    borderColor: "border-yellow-700",
    title: "Comval Province · ~30–80 km",
    distance: "",
    description: "",
    municipalities: ["Maco", "New Bataan", "Montevista", "Mawab", "Nabunturan", "Compostela", "Laak", "Maragusan", "Pantukan"],
    price: "₱1,750",
    priceNote: "round-trip, per booking",
  },
  {
    zone: "Zone 4 — Davao City",
    color: "text-yellow-600",
    borderColor: "border-yellow-700",
    title: "Davao City proper & districts · ~90–120 km",
    distance: "",
    description: "",
    municipalities: ["Poblacion", "Buhangin", "Talomo", "Toril", "Calinan", "Baguio District", "Tugbok", "Marilog"],
    price: "₱2,000",
    priceNote: "round-trip, per booking",
  },
  {
    zone: "Zone 5 — Davao Oriental",
    color: "text-orange-400",
    borderColor: "border-orange-600",
    title: "Davao Oriental municipalities · ~80–160 km",
    distance: "",
    description: "",
    municipalities: ["Mati City", "Cateel", "Baganga", "Caraga", "Boston", "Manay", "Tarragona", "San Isidro", "Governor Generoso"],
    price: "₱3,000",
    priceNote: "round-trip, per booking",
  },
  {
    zone: "Zone 6 — Neighboring Provinces",
    color: "text-red-400",
    borderColor: "border-red-600",
    title: "Outside Davao Region · 150 km+",
    distance: "",
    description: "",
    municipalities: ["Bukidnon", "Cotabato", "South Cotabato", "Agusan del Sur", "Sultan Kudarat", "Sarangani", "General Santos City"],
    price: "₱4,000+",
    priceNote: "to be quoted upon inquiry",
  },
];

const FareMatrixNotice = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 rounded-lg border-l-4 border-primary bg-primary/10 p-6"
      >
        <h3 className="font-heading text-lg font-bold text-primary mb-1">Notice</h3>
        <p className="text-muted-foreground">
          Due to the recent fuel price hikes, we have implemented a transportation fare matrix for bookings
          outside Tagum City. We want to be transparent with our clients to continue delivering the best
          photobooth experience to your events.
        </p>
        <button
          onClick={() => setOpen(true)}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-muted-foreground/30 px-5 py-2 text-sm text-foreground hover:bg-accent transition-colors"
        >
          See the full matrix here <ArrowRight className="h-4 w-4" />
        </button>
      </motion.div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">
              Transportation Fare Matrix
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {fareZones.map((zone, i) => (
              <div
                key={i}
                className={`rounded-lg border ${zone.borderColor} bg-card p-4`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded border ${zone.borderColor} ${zone.color} mb-2`}>
                      {zone.zone}
                    </span>
                    <h4 className="font-bold text-foreground">{zone.title}</h4>
                    {zone.description && (
                      <p className="text-sm text-muted-foreground">{zone.description}</p>
                    )}
                    {zone.municipalities.length > 0 && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {zone.municipalities.join(" · ")}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-heading text-2xl font-bold text-primary">{zone.price}</span>
                    {zone.priceNote && (
                      <p className="text-xs text-muted-foreground">{zone.priceNote}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FareMatrixNotice;
