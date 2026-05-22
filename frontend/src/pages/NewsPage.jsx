import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";
import { useLang } from "../contexts/LanguageContext";
import { api } from "../lib/api";

export default function NewsPage() {
  const { lang, t } = useLang();
  const { id } = useParams();
  const [news, setNews] = useState([]);
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const hiClass = lang === "hi" ? "font-devanagari-body" : "font-english-body";
  const hiHeadingClass = lang === "hi" ? "font-devanagari-heading" : "font-english-heading";

  useEffect(() => {
    setLoading(true);
    if (id) {
      api.get(`/news/${id}`).then(({ data }) => setArticle(data)).catch(() => setArticle(null)).finally(() => setLoading(false));
    } else {
      api.get("/news").then(({ data }) => setNews(data)).catch(() => {}).finally(() => setLoading(false));
    }
  }, [id]);

  const fmtDate = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", { day: "numeric", month: "long", year: "numeric" });
    } catch { return ""; }
  };

  // Single article view
  if (id) {
    if (loading) return <div className="py-32 text-center text-bharat-ink/60">{t("loading")}</div>;
    if (!article) return (
      <div className="py-32 text-center">
        <p className={`text-bharat-ink/70 mb-6 ${hiClass}`}>{t("news_no_articles")}</p>
        <Link to="/news" className="text-saffron font-bold underline">{t("news_view_all")}</Link>
      </div>
    );
    return (
      <article className="bg-white py-16 md:py-24" data-testid="news-article-detail">
        <div className="max-w-3xl mx-auto px-6">
          <Link to="/news" className={`inline-flex items-center gap-2 text-bharat-blue hover:text-saffron font-semibold mb-8 ${hiClass}`} data-testid="news-back-link">
            <ArrowLeft size={16} /> {t("news_view_all")}
          </Link>
          <span className={`text-xs uppercase tracking-widest text-saffron font-bold ${hiClass}`}>{article.category}</span>
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6 text-bharat-ink leading-[1.1] tracking-tight ${hiHeadingClass}`}>
            {lang === "hi" ? article.title_hi : article.title_en}
          </h1>
          <div className={`flex items-center gap-2 text-bharat-ink/60 text-sm mb-10 ${hiClass}`}>
            <Calendar size={14} />
            {fmtDate(article.created_at)}
          </div>
          {article.image_url && (
            <div className="aspect-[16/9] bg-bharat-ink/5 mb-10 overflow-hidden">
              <img src={article.image_url} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className={`prose prose-lg max-w-none text-bharat-ink/85 leading-relaxed space-y-6 ${hiClass}`}>
            <p className="text-xl text-bharat-ink/80 italic">{lang === "hi" ? article.excerpt_hi : article.excerpt_en}</p>
            <div className="editorial-divider my-8" />
            <p className="whitespace-pre-line">{lang === "hi" ? article.content_hi : article.content_en}</p>
          </div>
        </div>
      </article>
    );
  }

  // List view
  return (
    <div className="bg-bharat-cream min-h-screen" data-testid="news-page">
      <section className="bg-bharat-ink text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className={`text-saffron text-sm uppercase tracking-[0.3em] font-bold mb-4 editorial-line ${hiClass}`}>{t("news_eyebrow")}</div>
          <h1 className={`text-5xl md:text-6xl font-bold ${hiHeadingClass}`} data-testid="news-page-title">{t("news_title")}</h1>
          <p className={`mt-4 text-lg text-white/75 max-w-2xl ${hiClass}`}>{t("news_desc")}</p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <p className={`text-bharat-ink/60 ${hiClass}`}>{t("loading")}</p>
          ) : news.length === 0 ? (
            <p className={`text-bharat-ink/60 text-lg ${hiClass}`}>{t("news_no_articles")}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Featured first */}
              {news[0] && (
                <Link to={`/news/${news[0].id}`} className="md:col-span-8 group block bg-white border border-bharat-ink/10 hover:border-bharat-ink transition-all" data-testid="news-featured">
                  <div className="aspect-[16/10] bg-bharat-ink/5 overflow-hidden">
                    {news[0].image_url && <img src={news[0].image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />}
                  </div>
                  <div className="p-8">
                    <span className={`text-xs uppercase tracking-widest font-bold text-saffron ${hiClass}`}>{news[0].category}</span>
                    <h2 className={`text-3xl md:text-4xl font-bold mt-3 mb-3 text-bharat-ink leading-tight group-hover:text-saffron transition-colors ${hiHeadingClass}`}>
                      {lang === "hi" ? news[0].title_hi : news[0].title_en}
                    </h2>
                    <p className={`text-bharat-ink/70 leading-relaxed ${hiClass}`}>{lang === "hi" ? news[0].excerpt_hi : news[0].excerpt_en}</p>
                    <span className={`text-xs text-bharat-ink/50 mt-4 inline-block ${hiClass}`}>{fmtDate(news[0].created_at)}</span>
                  </div>
                </Link>
              )}

              <div className="md:col-span-4 space-y-6">
                {news.slice(1, 4).map((n, i) => (
                  <Link key={n.id} to={`/news/${n.id}`} className="group block bg-white border border-bharat-ink/10 hover:border-bharat-ink transition-all p-5" data-testid={`news-card-side-${i}`}>
                    <span className={`text-[10px] uppercase tracking-widest font-bold text-saffron ${hiClass}`}>{n.category}</span>
                    <h3 className={`text-lg font-bold mt-2 mb-2 text-bharat-ink leading-snug group-hover:text-saffron transition-colors ${hiHeadingClass}`}>
                      {lang === "hi" ? n.title_hi : n.title_en}
                    </h3>
                    <span className={`text-xs text-bharat-ink/50 ${hiClass}`}>{fmtDate(n.created_at)}</span>
                  </Link>
                ))}
              </div>

              {/* Remaining */}
              {news.slice(4).map((n, i) => (
                <Link key={n.id} to={`/news/${n.id}`} className="md:col-span-4 group block bg-white border border-bharat-ink/10 hover:border-bharat-ink transition-all" data-testid={`news-card-bottom-${i}`}>
                  <div className="aspect-[4/3] bg-bharat-ink/5 overflow-hidden">
                    {n.image_url && <img src={n.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />}
                  </div>
                  <div className="p-6">
                    <span className={`text-xs uppercase tracking-widest font-bold text-saffron ${hiClass}`}>{n.category}</span>
                    <h3 className={`text-xl font-bold mt-2 mb-2 text-bharat-ink leading-snug group-hover:text-saffron transition-colors ${hiHeadingClass}`}>
                      {lang === "hi" ? n.title_hi : n.title_en}
                    </h3>
                    <p className={`text-bharat-ink/70 text-sm leading-relaxed line-clamp-3 ${hiClass}`}>{lang === "hi" ? n.excerpt_hi : n.excerpt_en}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
