import React, { useEffect, useState } from "react";
import { useLang } from "../contexts/LanguageContext";
import { api, LEADER_PLACEHOLDER } from "../lib/api";

export default function LeadersPage() {
  const { lang, t } = useLang();
  const [leaders, setLeaders] = useState([]);
  const hiClass = lang === "hi" ? "font-devanagari-body" : "font-english-body";
  const hiHeadingClass = lang === "hi" ? "font-devanagari-heading" : "font-english-heading";

  useEffect(() => {
    api.get("/leaders").then(({ data }) => setLeaders(data)).catch(() => {});
  }, []);

  const president = leaders.find((l) => l.order === 1);
  const others = leaders.filter((l) => l.order !== 1);

  return (
    <div className="bg-bharat-cream" data-testid="leaders-page">
      <section className="bg-bharat-ink text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className={`text-saffron text-sm uppercase tracking-[0.3em] font-bold mb-4 editorial-line ${hiClass}`}>{t("leaders_eyebrow")}</div>
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold ${hiHeadingClass}`} data-testid="leaders-title">{t("leaders_title")}</h1>
          <p className={`mt-4 text-lg text-white/75 max-w-2xl ${hiClass}`}>{t("leaders_desc")}</p>
        </div>
      </section>

      {/* President — featured */}
      {president && (
        <section className="py-20 border-b border-bharat-ink/10">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/5] bg-bharat-ink/5 overflow-hidden">
                <img src={president.image || LEADER_PLACEHOLDER} alt={president.name_en} className="w-full h-full object-contain bg-bharat-ink" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-saffron text-white px-5 py-3">
                <span className={`text-xs uppercase tracking-widest font-bold ${hiClass}`}>{lang === "hi" ? president.role_hi : president.role_en}</span>
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className={`text-sm uppercase tracking-widest text-saffron font-bold mb-3 ${hiClass}`}>
                {lang === "hi" ? "राष्ट्रीय अध्यक्ष" : "National President"}
              </div>
              <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-bharat-ink ${hiHeadingClass}`} data-testid="leader-president-name">
                {lang === "hi" ? president.name_hi : president.name_en}
              </h2>
              <div className="tricolor-strip-horizontal h-1 w-32 my-6" />
              <p className={`text-lg text-bharat-ink/75 leading-relaxed ${hiClass}`}>
                {lang === "hi" ? president.bio_hi : president.bio_en}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Core Committee */}
      {others.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className={`text-3xl md:text-4xl font-bold mb-12 text-bharat-ink ${hiHeadingClass}`}>
              {lang === "hi" ? "मुख्य समिति" : "Core Committee"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {others.map((l, i) => (
                <div key={l.id} className="bg-white border border-bharat-ink/10 hover:border-bharat-ink transition-colors" data-testid={`leader-card-${i}`}>
                  <div className="aspect-square bg-bharat-ink/5">
                    <img src={l.image || LEADER_PLACEHOLDER} alt="" className="w-full h-full object-contain bg-bharat-ink" />
                  </div>
                  <div className="p-6">
                    <span className={`text-xs uppercase tracking-widest text-saffron font-bold ${hiClass}`}>{lang === "hi" ? l.role_hi : l.role_en}</span>
                    <h3 className={`text-2xl font-bold mt-2 mb-3 text-bharat-ink ${hiHeadingClass}`}>{lang === "hi" ? l.name_hi : l.name_en}</h3>
                    <p className={`text-bharat-ink/70 leading-relaxed text-sm ${hiClass}`}>{lang === "hi" ? l.bio_hi : l.bio_en}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
