import React from "react";
import { useLang } from "../contexts/LanguageContext";
import { ASHOKA_TEXTURE, FLAG_IMG, PARLIAMENT_IMG } from "../lib/api";
import { Flag, BookOpen, Target } from "lucide-react";

export default function AboutPage() {
  const { lang, t } = useLang();
  const hiClass = lang === "hi" ? "font-devanagari-body" : "font-english-body";
  const hiHeadingClass = lang === "hi" ? "font-devanagari-heading" : "font-english-heading";

  return (
    <div className="bg-bharat-cream" data-testid="about-page">
      {/* Page Hero */}
      <section className="bg-bharat-ink text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <img src={PARLIAMENT_IMG} alt="parliament" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-bharat-ink/70 to-bharat-ink" />
        <div className="relative max-w-5xl mx-auto px-6">
          <div className={`text-saffron text-sm uppercase tracking-[0.3em] font-bold mb-4 editorial-line ${hiClass}`}>{t("about_eyebrow")}</div>
          <h1 className={`text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] ${hiHeadingClass}`} data-testid="about-title">{t("about_title")}</h1>
          <p className={`mt-6 text-lg md:text-xl text-white/80 max-w-3xl leading-relaxed ${hiClass}`}>{t("about_intro")}</p>
        </div>
      </section>

      {/* Three pillars: ideology, vision, mission */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-1 border border-bharat-ink">
          {[
            { icon: BookOpen, title: t("about_ideology_title"), desc: t("about_ideology_desc"), color: "text-saffron" },
            { icon: Target, title: t("about_vision_title"), desc: t("about_vision_desc"), color: "text-bharat-blue" },
            { icon: Flag, title: t("about_mission_title"), desc: t("about_mission_desc"), color: "text-bharat-green" },
          ].map((p, i) => (
            <div key={i} className="bg-white p-10 hover:bg-bharat-cream transition-colors" data-testid={`about-pillar-${i}`}>
              <p.icon className={`${p.color} mb-5`} size={36} strokeWidth={1.5} />
              <h3 className={`text-2xl md:text-3xl font-bold mb-4 text-bharat-ink ${hiHeadingClass}`}>{p.title}</h3>
              <p className={`text-bharat-ink/75 leading-relaxed text-base ${hiClass}`}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Editorial story */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="editorial-divider mb-10" />
          <h2 className={`text-3xl md:text-4xl font-bold mb-8 text-bharat-ink ${hiHeadingClass}`}>
            {lang === "hi" ? "बुलंद भारत का स्वप्न" : "The Dream of a Stronger India"}
          </h2>
          <div className={`prose prose-lg max-w-none text-bharat-ink/80 leading-relaxed space-y-6 ${hiClass}`}>
            <p className="text-xl first-letter:text-6xl first-letter:font-bold first-letter:text-saffron first-letter:mr-3 first-letter:float-left first-letter:leading-none">
              {lang === "hi"
                ? "भारत का सपना सिर्फ एक राष्ट्र का सपना नहीं — यह 140 करोड़ भारतीयों की सामूहिक आकांक्षा है। बुलंद भारत पार्टी इस आकांक्षा को राजनीतिक रूप देती है। हमारी जड़ें गाँव में हैं, हमारी आँखें भविष्य में।"
                : "The dream of India is not the dream of a nation alone — it is the collective aspiration of 1.4 billion Indians. Buland Bharat Party gives political form to this aspiration. Our roots are in the village, our eyes on the future."}
            </p>
            <p>
              {lang === "hi"
                ? "हम मानते हैं कि शासन कोई एहसान नहीं — यह जनता का अधिकार है। हर किसान को न्याय, हर युवा को अवसर, हर महिला को सम्मान, हर बच्चे को शिक्षा।"
                : "We believe governance is not a favour — it is the right of the people. Justice for every farmer, opportunity for every youth, dignity for every woman, education for every child."}
            </p>
            <p>
              {lang === "hi"
                ? "हमारी पार्टी का गठन उन कार्यकर्ताओं ने किया जो जमीन से जुड़े हैं, जो लोगों की समस्याएँ जानते हैं, और जो बदलाव में विश्वास रखते हैं — न कि कुर्सी में।"
                : "Our party was founded by workers who are connected to the ground, who know the people's problems, and who believe in change — not in the chair."}
            </p>
          </div>
          <div className="editorial-divider mt-12" />
        </div>
      </section>

      {/* Patriotic close */}
      <section className="relative bg-bharat-ink text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src={FLAG_IMG} alt="flag" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="tricolor-strip-horizontal h-1 w-24 mx-auto mb-8" />
          <h2 className={`text-4xl md:text-6xl font-bold ${hiHeadingClass}`}>
            {t("jai_hind")}.
          </h2>
          <p className={`mt-4 text-saffron text-xl tracking-widest uppercase font-bold ${hiClass}`}>{t("vande_mataram")}</p>
        </div>
      </section>
    </div>
  );
}
