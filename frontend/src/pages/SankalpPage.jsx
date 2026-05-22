import React from "react";
import { Sprout, Heart, Briefcase, Shield, CheckCircle2 } from "lucide-react";
import { useLang } from "../contexts/LanguageContext";
import { ASHOKA_TEXTURE } from "../lib/api";

const SANKALPS_HI = [
  {
    icon: Sprout,
    color: "text-bharat-green",
    bgAccent: "border-bharat-green",
    title: "किसानों का विकास",
    subtitle: "किसान देश की रीढ़ हैं",
    points: [
      "किसानों को उनकी फसलों का उचित और समय पर मूल्य।",
      "सिंचाई सुविधाओं का विस्तार, मुफ्त/सस्ती बिजली और आधुनिक कृषि तकनीक।",
      "प्राकृतिक खेती और जैविक खेती को प्रोत्साहन।",
      "किसान क्रेडिट कार्ड, फसल बीमा और कृषि ऋण को सरल और पारदर्शी।",
      "कृषि आधारित उद्योगों से ग्रामीण रोजगार में वृद्धि।",
    ],
  },
  {
    icon: Heart,
    color: "text-saffron",
    bgAccent: "border-saffron",
    title: "महिलाओं का विकास",
    subtitle: "सशक्त महिला, सशक्त भारत",
    points: [
      "शिक्षा, स्वास्थ्य और रोजगार में समान अवसर।",
      "महिला सुरक्षा के लिए सख्त कानून और त्वरित न्याय व्यवस्था।",
      "स्वयं सहायता समूहों और महिला उद्यमियों को आर्थिक सहायता।",
      "कार्यस्थलों पर सुरक्षित और सम्मानजनक वातावरण।",
      "मातृत्व स्वास्थ्य और पोषण पर विशेष ध्यान।",
    ],
  },
  {
    icon: Briefcase,
    color: "text-bharat-blue",
    bgAccent: "border-bharat-blue",
    title: "युवाओं का विकास",
    subtitle: "युवा देश का भविष्य हैं",
    points: [
      "गुणवत्तापूर्ण शिक्षा और कौशल विकास।",
      "रोजगार के नए अवसर और स्टार्टअप को बढ़ावा।",
      "प्रतियोगी परीक्षाओं में पारदर्शिता और समयबद्ध भर्ती।",
      "खेल, विज्ञान, तकनीक और नवाचार में अग्रसर।",
      "नशामुक्त और सकारात्मक युवा समाज का निर्माण।",
    ],
  },
  {
    icon: Shield,
    color: "text-bharat-ink",
    bgAccent: "border-bharat-ink",
    title: "सैनिकों और उनके परिवारों का विकास",
    subtitle: "हमारी सीमाओं के रक्षक — हमारा गर्व",
    points: [
      "सैनिकों को बेहतर वेतन, आधुनिक संसाधन और सम्मानजनक जीवन।",
      "शहीदों के परिवारों को पूर्ण आर्थिक और सामाजिक सुरक्षा।",
      "पूर्व सैनिकों के लिए रोजगार और पुनर्वास योजनाएँ।",
      "सीमा क्षेत्रों में तैनात सैनिकों की सुविधाओं में सुधार।",
      "देशभक्ति और सैन्य सम्मान को समाज में मजबूत बनाना।",
    ],
  },
];

const SANKALPS_EN = [
  {
    icon: Sprout, color: "text-bharat-green", bgAccent: "border-bharat-green",
    title: "Farmers' Development",
    subtitle: "Farmers are the backbone of the nation",
    points: [
      "Fair and timely price for farmers' produce.",
      "Expansion of irrigation, free/cheap electricity and modern agri-tech.",
      "Promotion of natural and organic farming.",
      "Simpler and transparent Kisan Credit Card, crop insurance and agri-loans.",
      "Rural employment growth through agro-industries.",
    ],
  },
  {
    icon: Heart, color: "text-saffron", bgAccent: "border-saffron",
    title: "Women's Development",
    subtitle: "Empowered women, empowered India",
    points: [
      "Equal opportunities in education, health and employment.",
      "Strict laws and fast-track justice for women's safety.",
      "Financial support for self-help groups and women entrepreneurs.",
      "Safe and dignified workplaces.",
      "Special focus on maternal health and nutrition.",
    ],
  },
  {
    icon: Briefcase, color: "text-bharat-blue", bgAccent: "border-bharat-blue",
    title: "Youth Development",
    subtitle: "Youth — the future of the nation",
    points: [
      "Priority to quality education and skill development.",
      "New employment opportunities and startup promotion.",
      "Transparency and time-bound recruitment in competitive exams.",
      "Advancement in sports, science, technology and innovation.",
      "Building a drug-free, positive youth society.",
    ],
  },
  {
    icon: Shield, color: "text-bharat-ink", bgAccent: "border-bharat-ink",
    title: "Soldiers & Their Families",
    subtitle: "Defenders of our borders — our pride",
    points: [
      "Better pay, modern resources and dignified life for soldiers.",
      "Full financial and social security for martyrs' families.",
      "Employment and rehabilitation schemes for veterans.",
      "Improved facilities for soldiers in border areas.",
      "Strengthening patriotism and military honour in society.",
    ],
  },
];

export default function SankalpPage() {
  const { lang, t } = useLang();
  const hiClass = lang === "hi" ? "font-devanagari-body" : "font-english-body";
  const hiHeadingClass = lang === "hi" ? "font-devanagari-heading" : "font-english-heading";
  const sankalps = lang === "hi" ? SANKALPS_HI : SANKALPS_EN;

  return (
    <div className="bg-bharat-cream" data-testid="sankalp-page">
      {/* Hero */}
      <section className="bg-bharat-ink text-white py-20 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url(${ASHOKA_TEXTURE})`, backgroundSize: "400px" }} />
        <div className="absolute inset-0 chakra-bg opacity-20" />
        <div className="relative max-w-5xl mx-auto px-6">
          <div className={`text-saffron text-sm uppercase tracking-[0.3em] font-bold mb-4 editorial-line ${hiClass}`} data-testid="sankalp-eyebrow">
            {lang === "hi" ? "बुलंद भारत पार्टी" : "Buland Bharat Party"}
          </div>
          <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight ${hiHeadingClass}`} data-testid="sankalp-title">
            {lang === "hi" ? "विकास का संकल्प" : "Pledge of Development"}
          </h1>
          <p className={`mt-6 text-lg md:text-xl text-white/85 max-w-3xl leading-relaxed ${hiClass}`}>
            {lang === "hi"
              ? "किसान समृद्ध हों, महिलाएं सशक्त हों, युवा आत्मनिर्भर हों और सैनिक सम्मानित हों — हम एक ऐसा भारत बनाएंगे जो विकास, न्याय और आत्मसम्मान के साथ विश्व में बुलंद पहचान बनाए।"
              : "Prosperous farmers, empowered women, self-reliant youth and honoured soldiers — we will build an India that earns a proud, leading place in the world through development, justice and self-respect."}
          </p>
        </div>
      </section>

      {/* 4 Sankalps */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          {sankalps.map((s, i) => (
            <div key={i} className={`bg-white border-l-4 ${s.bgAccent} grid grid-cols-1 md:grid-cols-12 gap-6 p-6 md:p-10`} data-testid={`sankalp-item-${i}`}>
              <div className="md:col-span-4 flex md:flex-col items-start gap-4">
                <div className={`w-16 h-16 flex items-center justify-center bg-bharat-cream ${s.color}`}>
                  <s.icon size={36} strokeWidth={1.5} />
                </div>
                <div>
                  <div className={`text-xs uppercase tracking-widest text-bharat-ink/60 font-bold ${hiClass}`}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h2 className={`text-2xl md:text-3xl font-bold mt-1 text-bharat-ink leading-tight ${hiHeadingClass}`}>{s.title}</h2>
                  <p className={`text-sm md:text-base text-saffron mt-2 font-semibold italic ${hiClass}`}>{s.subtitle}</p>
                </div>
              </div>
              <ul className="md:col-span-8 space-y-3">
                {s.points.map((p, j) => (
                  <li key={j} className={`flex items-start gap-3 text-base text-bharat-ink/85 leading-relaxed ${hiClass}`}>
                    <CheckCircle2 className={`${s.color} mt-1 shrink-0`} size={18} />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Closing strip */}
      <section className="relative bg-saffron text-bharat-ink py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url(${ASHOKA_TEXTURE})`, backgroundSize: "300px" }} />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className={`text-3xl md:text-5xl font-bold mb-4 ${hiHeadingClass}`}>
            {lang === "hi" ? "एकता • सौहार्द • विकास" : "Unity • Harmony • Development"}
          </h2>
          <p className={`text-lg ${hiClass}`}>
            {lang === "hi" ? "बुलंद भारत — हम सबके सपनों का भारत।" : "Buland Bharat — the India of all our dreams."}
          </p>
        </div>
      </section>
    </div>
  );
}
