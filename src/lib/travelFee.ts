// Travel Fee (Matrix Fare) mapping based on Event Location (City/Municipality)
// Scalable: add new locations to the appropriate zone array.

export type TravelZone = {
  label: string;
  fee: number;
  locations: string[];
};

export const travelZones: TravelZone[] = [
  {
    label: "Tagum City",
    fee: 0,
    locations: ["Tagum City"],
  },
  {
    label: "Nearby Municipalities (~15–35 km)",
    fee: 1000,
    locations: [
      "Asuncion",
      "Santo Tomas",
      "Sto. Tomas",
      "Carmen",
      "Panabo City",
      "New Corella",
      "Kapalong",
      "San Isidro",
    ],
  },
  {
    label: "Comval Province (~30–80 km)",
    fee: 1750,
    locations: [
      "Maco",
      "New Bataan",
      "Montevista",
      "Mawab",
      "Nabunturan",
      "Compostela",
      "Laak",
      "Maragusan",
      "Pantukan",
    ],
  },
  {
    label: "Davao City Proper & Districts (~90–120 km)",
    fee: 2000,
    locations: [
      "Davao City",
      "Poblacion",
      "Buhangin",
      "Talomo",
      "Toril",
      "Calinan",
      "Baguio District",
      "Tugbok",
      "Marilog",
    ],
  },
  {
    label: "Davao Oriental Municipalities (~80–160 km)",
    fee: 3000,
    locations: [
      "Mati City",
      "Cateel",
      "Baganga",
      "Caraga",
      "Boston",
      "Manay",
      "Tarragona",
      "Governor Generoso",
    ],
  },
  {
    label: "Outside Davao Region (150 km+)",
    fee: 4000,
    locations: [
      "Bukidnon",
      "Cotabato",
      "South Cotabato",
      "Agusan del Sur",
      "Sultan Kudarat",
      "Sarangani",
      "General Santos City",
    ],
  },
];

// Build a fast lookup map (exact string match)
const travelFeeMap: Record<string, { fee: number; zone: string }> = (() => {
  const map: Record<string, { fee: number; zone: string }> = {};
  for (const zone of travelZones) {
    for (const loc of zone.locations) {
      map[loc] = { fee: zone.fee, zone: zone.label };
    }
  }
  return map;
})();

export const getTravelFee = (city: string | undefined | null): { fee: number; zone: string } => {
  if (!city) return { fee: 0, zone: "—" };
  return travelFeeMap[city] || { fee: 4000, zone: "Outside Davao Region (150 km+)" };
};

export const formatPHP = (amount: number): string =>
  `₱${amount.toLocaleString("en-PH")}`;

// Parse a price string like "₱4,500" into a number
export const parsePriceString = (price: string): number => {
  const digits = price.replace(/[^0-9.]/g, "");
  const n = parseFloat(digits);
  return isNaN(n) ? 0 : n;
};
