import Layout from "@/components/Layout";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import mothersDayBg from "@/assets/popup-mothers-day.jpg";
import indigayBg from "@/assets/popup-indigay.jpg";
import panaboBg from "@/assets/popup-panabo.jpg";
import valentinesBg from "@/assets/popup-valentines.jpg";

interface PopUpButton {
  label: string;
  href?: string;
  dateLinks?: Record<string, string>;
}

interface PopUpSection {
  title: string;
  bg: string;
  buttons: PopUpButton[];
  stackButtons?: boolean;
}

const panaboClassicLinks: Record<string, string> = {
  "2026-03-16": "https://fotoshare.co/e/0usGq5c5ynE_HaY64_EkT",
  "2026-03-17": "https://fotoshare.co/e/0usGq5c5ynE_HaY64_EkT",
  "2026-03-18": "https://fotoshare.co/e/cSU-3n3khqZkBNZ4Fn6O-",
  "2026-03-19": "https://fotoshare.co/e/G9EdfSIKc0wioGQazno00",
  "2026-03-20": "https://fotoshare.co/e/NVw_Lj6_pA_3sFtIyWJ5V",
  "2026-03-21": "https://fotoshare.co/e/n5USQLUWpBW2b-5tiGlcn",
  "2026-03-22": "https://fotoshare.co/admin/album/9179428",
  "2026-03-23": "https://fotoshare.co/e/mCCt5fQHGnJLEurxyTcPh",
};

const panaboHighAngleLinks: Record<string, string> = {
  "2026-03-16": "https://fotoshare.co/e/i6gxgQ8KqANnz9SAeB8iz",
  "2026-03-17": "https://fotoshare.co/e/i6gxgQ8KqANnz9SAeB8iz",
  "2026-03-18": "https://fotoshare.co/e/-kpREK6EwyfIOH_gQvdHG",
  "2026-03-19": "https://fotoshare.co/e/Dk8R-NXNc1NU0qwDCpEgm",
  "2026-03-20": "https://fotoshare.co/e/XNLOwUmxveC80kkd4MW9y",
  "2026-03-21": "https://fotoshare.co/e/4bhvnWX3pY1E61SCzLU4_",
  "2026-03-22": "https://fotoshare.co/e/W6gfhEEVTWopflwMum2oD",
  "2026-03-23": "https://fotoshare.co/e/2kfFATGSZ6mRoz-n7u0Hm",
};

const sections: PopUpSection[] = [
  {
    title: "Mother's Day",
    bg: mothersDayBg,
    buttons: [
      { label: "Classic →", href: "#" },
      { label: "High-Angle →", href: "#" },
    ],
  },
  {
    title: "Indigay 2026",
    bg: indigayBg,
    stackButtons: true,
    buttons: [
      { label: "PART 1 →", href: "https://fotoshare.co/e/c-5pG2CBy1MAzm62qVyoM" },
      { label: "PART 2 →", href: "https://fotoshare.co/e/dcj26FxToC6OUAqaLuyUI" },
    ],
  },
  {
    title: "Panabo Pop-up",
    bg: panaboBg,
    buttons: [
      { label: "Classic →", dateLinks: panaboClassicLinks },
      { label: "High-Angle →", dateLinks: panaboHighAngleLinks },
    ],
  },
  {
    title: "Valentines Day",
    bg: valentinesBg,
    buttons: [
      { label: "Classic →", href: "https://fotoshare.co/e/DAeWyVHzPG9gbefwKU71t" },
      { label: "High-Angle →", href: "https://fotoshare.co/e/aXu3hRKm7ZtYIhakOUSbC" },
    ],
  },
];

const formatDateKey = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const DateLinkButton = ({ btn }: { btn: PopUpButton }) => {
  const dateLinks = btn.dateLinks!;
  const enabledDates = new Set(Object.keys(dateLinks));
  const defaultMonth = new Date(2026, 2, 1); // March 2026

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    const key = formatDateKey(date);
    const url = dateLinks[key];
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const buttonClasses =
    "inline-flex items-center px-10 py-5 md:px-14 md:py-6 rounded-full bg-black text-white font-heading text-lg md:text-2xl tracking-wider hover:bg-neutral-800 transition-colors shadow-xl";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className={buttonClasses}>
          {btn.label}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          defaultMonth={defaultMonth}
          onSelect={handleSelect}
          disabled={(date) => !enabledDates.has(formatDateKey(date))}
          initialFocus
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>
  );
};

const PopUp = () => {
  useDocumentTitle("Pop-Up | Photonix Photobooth");

  return (
    <Layout>
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6 text-center mb-12">
          <h1 className="font-heading text-4xl md:text-5xl text-foreground tracking-wider">
            POP-UP EVENTS
          </h1>
          <p className="mt-4 text-muted-foreground font-body max-w-2xl mx-auto">
            Grab your photos from our recent pop-up events. Hurry! Limited time only. If you wish to delete your photo immediately, please message us on{" "}
            <a
              href="http://m.me/299017183285410"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline hover:text-primary transition-colors"
            >
              messenger
            </a>
            .
          </p>
        </div>

        <div className="container mx-auto px-6 space-y-10 pb-16">
          {sections.map((section) => (
            <article
              key={section.title}
              className="relative rounded-2xl overflow-hidden shadow-lg"
            >
              <div
                className="w-full bg-cover bg-center aspect-[1366/650] flex items-center"
                style={{ backgroundImage: `url(${section.bg})` }}
              >
                <div className="w-full p-6 md:p-16 max-w-2xl">
                  <p className="font-body text-white font-semibold text-base md:text-xl mb-5 drop-shadow-lg">
                    Grab your photos here:
                  </p>
                  <div className={`flex flex-wrap gap-4 ${section.stackButtons ? "flex-col items-start" : ""}`}>
                    {section.buttons.map((btn) =>
                      btn.dateLinks ? (
                        <DateLinkButton key={btn.label} btn={btn} />
                      ) : (
                        <a
                          key={btn.label}
                          href={btn.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-10 py-5 md:px-14 md:py-6 rounded-full bg-black text-white font-heading text-lg md:text-2xl tracking-wider hover:bg-neutral-800 transition-colors shadow-xl"
                        >
                          {btn.label}
                        </a>
                      )
                    )}
                  </div>
                  <p className="mt-5 font-body text-white text-sm md:text-base italic drop-shadow-lg">
                    Hurry! limited time only
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default PopUp;
