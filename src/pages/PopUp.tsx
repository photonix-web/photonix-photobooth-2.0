import Layout from "@/components/Layout";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import mothersDayBg from "@/assets/popup-mothers-day.jpg";
import indigayBg from "@/assets/popup-indigay.jpg";
import panaboBg from "@/assets/popup-panabo.jpg";
import valentinesBg from "@/assets/popup-valentines.jpg";
import msmeBg from "@/assets/png-msme-26.png";
import santoTomasBg from "@/assets/png-67stt-26.png";

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

const mothersDayClassicLinks: Record<string, string> = {
  "2026-05-06": "https://fotoshare.co/e/CDqvXgKr-i4OTGEocXp4A",
  "2026-05-07": "https://fotoshare.co/e/3FdWwc9SJMby_dbU-q0hK",
  "2026-05-08": "https://fotoshare.co/e/Iy6V2QEzTgrXsikVIVboJ",
  "2026-05-09": "https://fotoshare.co/e/bbUGzTzUQoSc2UAyCm7fn",
  "2026-05-10": "https://fotoshare.co/e/VTRSe3pKF4TGJe4XshPBt",
};

const mothersDayHighAngleLinks: Record<string, string> = {
  "2026-05-06": "https://fotoshare.co/e/P4RCXfdfyLUsiVgsrGmHN",
  "2026-05-07": "https://fotoshare.co/e/n5ciSznFs-ESbwPODPTT6",
  "2026-05-08": "https://fotoshare.co/e/aBtUeiizRIaa1kvV3yWGh",
  "2026-05-09": "https://fotoshare.co/e/NXNE4afxS9n71D7u4ELKV",
  "2026-05-10": "https://fotoshare.co/e/VTRSe3pKF4TGJe4XshPBt",
};

const santoTomasClassicLinks: Record<string, string> = {
  "2026-07-17": "https://fotoshare.co/e/hTzY7MPqXyboOKmOnfyk7",
  "2026-07-18": "https://fotoshare.co/e/PRpgqSiwcIXEA1YkjJG7N",
  "2026-07-19": "https://fotoshare.co/e/DkfFkSvUv_5J76VrtllLQ",
  "2026-07-20": "https://fotoshare.co/e/pud_Q9mYNiE6FA-g264_x",
  "2026-07-21": "https://fotoshare.co/e/mH3FHiJ5jV_DDgU7eHkvc",
  "2026-07-22": "https://fotoshare.co/e/mMXBuxpgKd45u76YTcgUy",
  "2026-07-23": "https://fotoshare.co/e/0ZZ9j_Ao8M0gWrpRHd2ac",
  "2026-07-24": "https://fotoshare.co/e/HUsJ5XfFjuQsdWUlKmhgB",
  "2026-07-25": "https://fotoshare.co/e/fz8KOThr2dlB4FQvJSAGk",
  "2026-07-26": "https://fotoshare.co/e/CSEpm3XlhJ-yHnE2FRIsK",
  "2026-07-27": "https://fotoshare.co/e/fQ_0FhL-R5uhKt_aKGxHT",
  "2026-07-28": "https://fotoshare.co/e/HYeAzpuiljD6pBpWHacHb",
  "2026-07-29": "https://fotoshare.co/e/OuRX4zQy4sGkII5KR7zVH",
  "2026-07-30": "https://fotoshare.co/e/CJa7gLsdcIXCpqbtPEq0E",
  "2026-07-31": "https://fotoshare.co/e/nmfTPaWzUOYTllq2XYBJF",
  "2026-08-01": "https://fotoshare.co/e/U_pgdrkoqYF4jwNB61Hd1",
  "2026-08-02": "https://fotoshare.co/e/IHnfUFe4h8hDwqBwEFPf8",
  "2026-08-03": "https://fotoshare.co/e/jPk812Qhjlbj9kowu-4h2",
  "2026-08-04": "https://fotoshare.co/e/es1i_U5fbnHuf8TD_NFug",
  "2026-08-05": "https://fotoshare.co/e/DJE-BE9FqCQ4W-lMiBU8U",
  "2026-08-06": "https://fotoshare.co/e/EQ-9PnuebZKZrxpksFRUP",
  "2026-08-07": "https://fotoshare.co/e/WflYmOl5iXaJ6lmz0_fFH",
  "2026-08-08": "https://fotoshare.co/e/jb-COSQesnEg0PAKVGvop",
  "2026-08-09": "https://fotoshare.co/e/qZXxLVwCRP34W-Zst9_9J",
  "2026-08-10": "https://fotoshare.co/e/bmZ7MLE5g0VGe8d0vkHxO",
  "2026-08-11": "https://fotoshare.co/e/szvRg0fMXQdy0EOUXm833",
  "2026-08-12": "https://fotoshare.co/e/WFQI29zp68-EzsnRFSWmF",
  "2026-08-13": "https://fotoshare.co/e/kJDbj88cyGjdK2mHhP20z",
  "2026-08-14": "https://fotoshare.co/e/_VLEpQ0X-bz76oTCpYgrY",
};

const santoTomasHighAngleLinks: Record<string, string> = {
  "2026-07-20": "https://fotoshare.co/e/oHR6aGzaDbaJKZE18Ms30",
  "2026-07-21": "https://fotoshare.co/e/lTNMhX04-KDp-y2RUwacQ",
  "2026-07-22": "https://fotoshare.co/e/KwcdfhqIMhSGoOQgiIBzm",
  "2026-07-23": "https://fotoshare.co/e/Uq6pURZC5usB5izs4-uon",
  "2026-07-24": "https://fotoshare.co/e/SVwcN4bVTGqt45ak0V5wU",
  "2026-07-25": "https://fotoshare.co/e/gZ99zVnv9U3GbAoJrQxuT",
  "2026-07-26": "https://fotoshare.co/e/xDWowegmu_b3xnckwFwoF",
  "2026-07-27": "https://fotoshare.co/e/_Bazc7zRqpECo1FSibzc7",
  "2026-07-28": "https://fotoshare.co/e/6lQ43q3EiK1hDDj73d5I-",
  "2026-07-29": "https://fotoshare.co/e/2MRiUsYtbkTBAX1Iw991K",
  "2026-07-31": "https://fotoshare.co/e/YnkJaO4k4JXpKSFPOsthx",
  "2026-08-01": "https://fotoshare.co/e/Z1V6bgmRgLsRb0Y8y69nA",
  "2026-08-02": "https://fotoshare.co/e/c03brdM9JWsfkVJSvN5N5",
  "2026-08-03": "https://fotoshare.co/e/rdwFs3DqH_4e0baXdl3jE",
  "2026-08-04": "https://fotoshare.co/e/mNyKL14ztdrTI4bIQvGJg",
  "2026-08-05": "https://fotoshare.co/e/pdKba_aoVpT99szvFO_Ip",
  "2026-08-06": "https://fotoshare.co/e/ncKUvNRt3cbQ6JpudtZwn",
  "2026-08-07": "https://fotoshare.co/e/psMg3_AxHvuSg6-y0Havs",
  "2026-08-08": "https://fotoshare.co/e/Pw4RcubYHh1LegE6_9R8M",
  "2026-08-09": "https://fotoshare.co/e/ZoDhzKbDDrn9hKqz9KZ_e",
  "2026-08-10": "https://fotoshare.co/e/9xxC_HYycSHRpMjzQ8-AB",
  "2026-08-11": "https://fotoshare.co/e/9xxC_HYycSHRpMjzQ8-AB",
  "2026-08-12": "https://fotoshare.co/e/SaqmPuaSH5BKO5ClJKPux",
  "2026-08-13": "https://fotoshare.co/e/UJEUIVzui8WNH4SjcLOhc",
  "2026-08-14": "https://fotoshare.co/e/8BZfHKjTMKqCxwYaoyDUQ",
};

const sections: PopUpSection[] = [
  {
    title: "67th Santo Tomas Pop-up",
    bg: santoTomasBg,
    buttons: [
      { label: "Classic →", dateLinks: santoTomasClassicLinks },
      { label: "High-Angle →", dateLinks: santoTomasHighAngleLinks },
    ],
  },
  {
    title: "MSME 2026",
    bg: msmeBg,
    buttons: [
      { label: "High-Angle →", href: "https://fotoshare.co/e/Sd5qjh9y4mdtxZiW3zR4I" },
    ],
  },
  {
    title: "Mother's Day",
    bg: mothersDayBg,
    buttons: [
      { label: "Classic →", dateLinks: mothersDayClassicLinks },
      { label: "High-Angle →", dateLinks: mothersDayHighAngleLinks },
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
  const firstKey = Object.keys(dateLinks).sort()[0];
  const [fy, fm] = firstKey ? firstKey.split("-").map(Number) : [2026, 3];
  const defaultMonth = new Date(fy, (fm ?? 1) - 1, 1);

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
          <p className="mt-3 text-muted-foreground font-body max-w-2xl mx-auto">
            invite us to your pop-up events! 👉🏼👈🏼
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
