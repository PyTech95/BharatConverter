import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Languages } from "lucide-react";
import { useLang } from "../../contexts/LanguageContext";
import { PARTY_LOGO } from "../../lib/api";

export default function Header() {
  const { lang, toggle, t } = useLang();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: "/", label: t("nav_home") },
    { to: "/about", label: t("nav_about") },
    { to: "/leaders", label: t("nav_leaders") },
    { to: "/news", label: t("nav_news") },
    { to: "/contact", label: t("nav_contact") },
  ];

  return (
    <>
      {/* Tricolor top bar */}
      <div className="tricolor-strip-horizontal h-1 w-full" />

      {/* Top utility bar */}
      <div className="bg-bharat-ink text-white border-b border-bharat-ink hidden md:block">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="font-devanagari-body tracking-wide" data-testid="header-jaihind">
              {t("jai_hind")} • {t("vande_mataram")}
            </span>
          </div>
          <button
            onClick={toggle}
            className="flex items-center gap-2 hover:text-saffron transition-colors btn-sharp px-3 py-1"
            data-testid="lang-toggle-top"
            aria-label="Toggle Language"
          >
            <Languages size={14} />
            <span className="font-semibold">{lang === "hi" ? "English" : "हिन्दी"}</span>
          </button>
        </div>
      </div>

      {/* Main nav */}
      <header className="sticky top-0 z-50 bg-bharat-cream/90 backdrop-blur-xl border-b-2 border-bharat-ink" data-testid="main-header">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group" data-testid="header-logo-link">
              <img src={PARTY_LOGO} alt="Buland Bharat" className="h-14 w-14 object-contain bg-bharat-ink rounded-sm group-hover:scale-105 transition-transform" />
              <div className="hidden sm:block">
                <div className={`text-bharat-ink font-bold leading-none ${lang === "hi" ? "font-devanagari-heading text-xl" : "font-english-heading text-2xl"}`}>
                  {t("party_name")}
                </div>
                <div className="text-xs text-bharat-blue tracking-widest uppercase mt-1 font-semibold">
                  {lang === "hi" ? "B.B.P." : "बु.भा.पा."}
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === "/"}
                  className={({ isActive }) =>
                    `px-4 py-2 text-sm font-semibold tracking-wide transition-colors border-b-2 ${
                      isActive
                        ? "text-saffron border-saffron"
                        : "text-bharat-ink border-transparent hover:text-saffron hover:border-saffron/50"
                    } ${lang === "hi" ? "font-devanagari-body" : "font-english-body"}`
                  }
                  data-testid={`nav-link-${l.to.replace("/", "") || "home"}`}
                >
                  {l.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              {/* Mobile lang toggle */}
              <button
                onClick={toggle}
                className="md:hidden flex items-center gap-1 px-3 py-2 text-xs font-bold border border-bharat-ink text-bharat-ink btn-sharp"
                data-testid="lang-toggle-mobile"
              >
                <Languages size={14} />
                {lang === "hi" ? "EN" : "हि"}
              </button>

              <Link
                to="/join"
                className="hidden md:inline-flex items-center bg-saffron text-white px-5 py-2.5 font-bold tracking-wide hover:bg-saffron-dark transition-colors btn-sharp"
                data-testid="header-join-cta"
              >
                {t("cta_join_now")}
              </Link>

              <button
                onClick={() => setOpen(!open)}
                className="lg:hidden p-2 text-bharat-ink"
                data-testid="mobile-menu-toggle"
                aria-label="Menu"
              >
                {open ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <nav className="lg:hidden border-t border-bharat-ink/10 bg-bharat-cream px-4 py-4 space-y-1" data-testid="mobile-menu">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 text-base font-semibold border-l-4 ${
                    isActive ? "border-saffron text-saffron bg-white" : "border-transparent text-bharat-ink hover:bg-white"
                  } ${lang === "hi" ? "font-devanagari-body" : "font-english-body"}`
                }
                data-testid={`mobile-nav-${l.to.replace("/", "") || "home"}`}
              >
                {l.label}
              </NavLink>
            ))}
            <Link
              to="/join"
              onClick={() => setOpen(false)}
              className="block mt-2 bg-saffron text-white text-center px-5 py-3 font-bold btn-sharp"
              data-testid="mobile-join-cta"
            >
              {t("cta_join_now")}
            </Link>
          </nav>
        )}
      </header>
    </>
  );
}
