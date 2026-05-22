import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sprout, Briefcase, GraduationCap, ShieldCheck, ChevronRight, Quote } from "lucide-react";
import { useLang } from "../contexts/LanguageContext";
import { api, HERO_CROWD_IMG, ASHOKA_TEXTURE, PARTY_LOGO, FLAG_IMG } from "../lib/api";

export default function HomePage() {
  const { lang, t } = useLang();
  const [news, setNews] = useState([]);
  const [memberCount, setMemberCount] = useState(0);

  useEffect(() => {
    api.get("/news").then(({ data }) => setNews(data.slice(0, 3))).catch(() => {});
    api.get("/membership/count").then(({ data }) => setMemberCount(data.count || 0)).catch(() => {});
  }, []);

  const hiClass = lang === "hi" ? "font-devanagari-body" : "font-english-body";
  const hiHeadingClass = lang === "hi" ? "font-devanagari-heading" : "font-english-heading";

  const pillars = [
    { icon: Sprout, t1: t("pillar_1_title"), t2: t("pillar_1_desc"), color: "text-bharat-green" },
    { icon: Briefcase, t1: t("pillar_2_title"), t2: t("pillar_2_desc"), color: "text-saffron" },
    { icon: ShieldCheck, t1: t("pillar_3_title"), t2: t("pillar_3_desc"), color: "text-bharat-blue" },
    { icon: GraduationCap, t1: t("pillar_4_title"), t2: t("pillar_4_desc"), color: "text-bharat-ink" },
  ];

  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section className="relative bg-bharat-ink text-white overflow-hidden" data-testid="hero-section">
        <div className="absolute inset-0">
          <img src={HERO_CROWD_IMG} alt="rally" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 hero-overlay" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32 lg:py-40 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 fade-up">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-12 h-0.5 bg-saffron" />
              <span className={`text-saffron text-xs md:text-sm uppercase tracking-[0.3em] font-bold ${hiClass}`}>
                {t("hero_eyebrow")}
              </span>
            </div>
            <h1 className={`text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6 ${hiHeadingClass}`} data-testid="hero-title">
              <span className="block text-white">{t("hero_title_1")}</span>
              <span className="block text-saffron">{t("hero_title_2")}</span>
            </h1>
            <p className={`text-lg md:text-xl text-white/85 leading-relaxed max-w-2xl mb-10 ${hiClass}`}>
              {t("hero_desc")}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/join"
                className="inline-flex items-center gap-2 bg-saffron text-white px-7 py-4 font-bold tracking-wide btn-sharp hover:bg-saffron-dark"
                data-testid="hero-cta-primary"
              >
                {t("hero_cta_primary")}
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 border-2 border-white text-white px-7 py-4 font-bold tracking-wide btn-sharp hover:bg-white hover:text-bharat-ink"
                data-testid="hero-cta-secondary"
              >
                {t("hero_cta_secondary")}
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 hidden lg:flex justify-center fade-up delay-200">
            <div className="relative">
              <div className="absolute -inset-8 chakra-bg opacity-30" />
              <img src={PARTY_LOGO} alt="Party Logo" className="relative w-80 h-80 object-contain drop-shadow-2xl" data-testid="hero-logo-image" />
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative border-t border-white/10 bg-bharat-ink/80 backdrop-blur">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-3 divide-x divide-white/15">
            {[
              { num: "12", label: t("hero_stat_1") },
              { num: "28", label: t("hero_stat_2") },
              { num: "15+", label: t("hero_stat_3") },
            ].map((s, i) => (
              <div key={i} className="py-8 px-4 text-center" data-testid={`hero-stat-${i}`}>
                <div className={`text-4xl md:text-5xl font-bold text-saffron ${hiHeadingClass}`}>{s.num}</div>
                <div className={`text-xs md:text-sm text-white/70 uppercase tracking-wider mt-2 ${hiClass}`}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION / PILLARS */}
      <section className="py-24 bg-bharat-cream relative">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: `url(${ASHOKA_TEXTURE})`, backgroundSize: "400px", backgroundPosition: "right center", backgroundRepeat: "no-repeat" }}
        />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-14 items-end">
            <div className="lg:col-span-7">
              <div className={`text-sm uppercase tracking-[0.3em] text-saffron font-bold mb-4 editorial-line ${hiClass}`}>
                {t("mission_eyebrow")}
              </div>
              <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-bharat-ink ${hiHeadingClass}`}>
                {t("mission_title")}
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className={`text-lg text-bharat-ink/75 leading-relaxed ${hiClass}`}>{t("mission_desc")}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {pillars.map((p, i) => (
              <div
                key={i}
                className="group bg-white border border-bharat-ink/10 p-8 hover:border-saffron hover:shadow-[6px_6px_0_0_rgba(255,153,51,0.4)] transition-all"
                data-testid={`pillar-${i}`}
              >
                <p.icon className={`${p.color} mb-5`} size={40} strokeWidth={1.5} />
                <h3 className={`text-2xl font-bold mb-3 text-bharat-ink ${hiHeadingClass}`}>{p.t1}</h3>
                <p className={`text-bharat-ink/70 leading-relaxed ${hiClass}`}>{p.t2}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE / PATRIOTIC STRIP */}
      <section className="relative bg-bharat-ink text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img src={FLAG_IMG} alt="flag" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-bharat-ink via-bharat-ink/80 to-transparent" />
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <Quote className="text-saffron mx-auto mb-6" size={48} />
          <blockquote className={`text-3xl md:text-4xl lg:text-5xl font-bold leading-tight ${hiHeadingClass}`}>
            {lang === "hi"
              ? "\"लोकतंत्र की असली शक्ति जनता है। और जब जनता जागती है, तब इतिहास बदलता है।\""
              : "\"The true power of democracy is the people. When the people awaken, history changes.\""}
          </blockquote>
          <div className="tricolor-strip-horizontal h-1 w-32 mx-auto mt-8" />
        </div>
      </section>

      {/* NEWS PREVIEW */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
            <div>
              <div className={`text-sm uppercase tracking-[0.3em] text-saffron font-bold mb-3 editorial-line ${hiClass}`}>
                {t("news_eyebrow")}
              </div>
              <h2 className={`text-4xl md:text-5xl font-bold tracking-tight text-bharat-ink ${hiHeadingClass}`}>{t("news_title")}</h2>
              <p className={`text-bharat-ink/70 mt-3 text-lg ${hiClass}`}>{t("news_desc")}</p>
            </div>
            <Link
              to="/news"
              className="inline-flex items-center gap-2 text-bharat-blue font-bold hover:text-saffron transition-colors"
              data-testid="home-news-view-all"
            >
              {t("news_view_all")} <ChevronRight size={16} />
            </Link>
          </div>

          {news.length === 0 ? (
            <p className={`text-bharat-ink/60 ${hiClass}`}>{t("news_no_articles")}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {news.map((n, i) => (
                <Link
                  key={n.id}
                  to={`/news/${n.id}`}
                  className="group block border border-bharat-ink/10 bg-white hover:border-bharat-ink transition-all"
                  data-testid={`home-news-card-${i}`}
                >
                  <div className="aspect-[4/3] overflow-hidden bg-bharat-ink/5">
                    {n.image_url && (
                      <img src={n.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    )}
                  </div>
                  <div className="p-6">
                    <span className={`text-xs uppercase tracking-widest font-bold text-saffron ${hiClass}`}>{n.category}</span>
                    <h3 className={`text-xl font-bold mt-3 mb-2 text-bharat-ink leading-snug group-hover:text-saffron transition-colors ${hiHeadingClass}`}>
                      {lang === "hi" ? n.title_hi : n.title_en}
                    </h3>
                    <p className={`text-bharat-ink/70 text-sm leading-relaxed line-clamp-3 ${hiClass}`}>
                      {lang === "hi" ? n.excerpt_hi : n.excerpt_en}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-saffron text-bharat-ink py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url(${ASHOKA_TEXTURE})`, backgroundSize: "300px" }} />
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <h2 className={`text-4xl md:text-5xl font-bold mb-5 ${hiHeadingClass}`} data-testid="cta-title">{t("join_cta_title")}</h2>
          <p className={`text-lg md:text-xl mb-10 max-w-2xl mx-auto ${hiClass}`}>{t("join_cta_desc")}</p>
          <Link
            to="/join"
            className="inline-flex items-center gap-2 bg-bharat-ink text-white px-8 py-4 font-bold tracking-wide btn-sharp hover:bg-black"
            data-testid="cta-join-btn"
          >
            {t("cta_join_now")} <ArrowRight size={18} />
          </Link>
          {memberCount > 0 && (
            <p className={`mt-6 text-bharat-ink/80 ${hiClass}`}>
              {lang === "hi" ? `${memberCount} सदस्य पहले ही जुड़ चुके हैं।` : `${memberCount} members have already joined.`}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
