import Layout from "@/components/Layout";
import { useDocumentTitle } from "@/hooks/use-document-title";
import mothersDayBg from "@/assets/popup-mothers-day.jpg";
import indigayBg from "@/assets/popup-indigay.jpg";
import panaboBg from "@/assets/popup-panabo.jpg";
import valentinesBg from "@/assets/popup-valentines.jpg";

interface PopUpButton {
  label: string;
  href: string;
}

interface PopUpSection {
  title: string;
  bg: string;
  buttons: PopUpButton[];
  stackButtons?: boolean;
}

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
      { label: "Classic →", href: "https://fotoshare.co/e/DAeWyVHzPG9gbefwKU71t" },
      { label: "High-Angle →", href: "https://fotoshare.co/e/aXu3hRKm7ZtYIhakOUSbC" },
    ],
  },
  {
    title: "Valentines Day",
    bg: valentinesBg,
    buttons: [
      { label: "Classic →", href: "#" },
      { label: "High-Angle →", href: "#" },
    ],
  },
];

const PopUp = () => {
  useDocumentTitle("Pop-Up | Photonix Photobooth");

  return (
    <Layout>
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6 text-center mb-12">
          <h1 className="font-heading text-4xl md:text-5xl text-foreground tracking-wider">
            POP-UP EVENTS
          </h1>
          <p className="mt-4 text-muted-foreground font-body">
            Grab your photos from our recent pop-up events
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
                  <p className="font-body text-white font-bold text-base md:text-xl mb-5 drop-shadow-lg">
                    Grab your photos here:
                  </p>
                  <div className={`flex flex-wrap gap-4 ${section.stackButtons ? "flex-col items-start" : ""}`}>
                    {section.buttons.map((btn) => (
                      <a
                        key={btn.label}
                        href={btn.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-10 py-5 md:px-14 md:py-6 rounded-full bg-black text-white font-heading text-lg md:text-2xl tracking-wider hover:bg-neutral-800 transition-colors shadow-xl"
                      >
                        {btn.label}
                      </a>
                    ))}
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
