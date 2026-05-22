import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Youtube, Instagram } from "lucide-react";
import { useLang } from "../../contexts/LanguageContext";
import { PARTY_LOGO } from "../../lib/api";

export default function Footer() {
  const { lang, t } = useLang();

  const links = [
    { to: "/about", label: t("nav_about") },
    { to: "/leaders", label: t("nav_leaders") },
    { to: "/news", label: t("nav_news") },
    { to: "/join", label: t("nav_join") },
    { to: "/contact", label: t("nav_contact") },
    { to: "/admin/login", label: t("nav_admin") },
  ];

  return (
    <footer className="bg-bharat-ink text-white relative overflow-hidden" data-testid="main-footer">
      <div className="tricolor-strip-horizontal h-1 w-full" />

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Brand */}
        <div className="md:col-span-5">
          <div className="flex items-center gap-3 mb-5">
            <img src={PARTY_LOGO} alt="logo" className="h-16 w-16 object-contain bg-bharat-ink rounded-sm border border-white/20" />
            <div>
              <div className={`text-2xl font-bold leading-tight ${lang === "hi" ? "font-devanagari-heading" : "font-english-heading"}`}>
                {t("party_name")}
              </div>
              <div className="text-saffron text-sm tracking-widest uppercase font-bold mt-1">
                {t("party_tagline")}
              </div>
            </div>
          </div>
          <p className={`text-white/70 leading-relaxed max-w-md ${lang === "hi" ? "font-devanagari-body" : "font-english-body"}`}>
            {t("footer_about")}
          </p>
          <div className="flex gap-3 mt-6">
            {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-10 h-10 border border-white/30 flex items-center justify-center hover:bg-saffron hover:border-saffron transition-colors btn-sharp"
                data-testid={`footer-social-${i}`}
                aria-label="social"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-3">
          <h4 className="text-saffron text-sm font-bold uppercase tracking-widest mb-5 editorial-line">
            {t("footer_quick_links")}
          </h4>
          <ul className="space-y-3">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className={`text-white/80 hover:text-saffron transition-colors ${lang === "hi" ? "font-devanagari-body" : "font-english-body"}`}
                  data-testid={`footer-link-${l.to.replace(/\//g, "-")}`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect */}
        <div className="md:col-span-4">
          <h4 className="text-saffron text-sm font-bold uppercase tracking-widest mb-5 editorial-line">
            {t("footer_connect")}
          </h4>
          <ul className="space-y-4 text-white/80">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-saffron mt-1 shrink-0" />
              <span className={lang === "hi" ? "font-devanagari-body" : "font-english-body"}>
                {t("footer_address")}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-saffron shrink-0" />
              <a href="tel:+911143210000" className="hover:text-saffron transition-colors">+91 11 4321 0000</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-saffron shrink-0" />
              <a href="mailto:info@bulandbharat.in" className="hover:text-saffron transition-colors">info@bulandbharat.in</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Massive footer slogan */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className={`text-4xl md:text-6xl lg:text-7xl font-bold text-white/10 tracking-tight ${lang === "hi" ? "font-devanagari-heading" : "font-english-heading"}`}>
            {t("jai_hind")} • {t("vande_mataram")}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-white/50">
          <span className={lang === "hi" ? "font-devanagari-body" : "font-english-body"}>
            {t("footer_copyright")}
          </span>
          <span className="italic text-saffron/80">{t("footer_constitution")}</span>
        </div>
      </div>
    </footer>
  );
}
