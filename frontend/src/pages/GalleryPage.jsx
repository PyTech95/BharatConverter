import React, { useState } from "react";
import { X } from "lucide-react";
import { useLang } from "../contexts/LanguageContext";
import { GALLERY_PHOTOS } from "../lib/api";

export default function GalleryPage() {
  const { lang, t } = useLang();
  const [open, setOpen] = useState(null);
  const hiClass = lang === "hi" ? "font-devanagari-body" : "font-english-body";
  const hiHeadingClass = lang === "hi" ? "font-devanagari-heading" : "font-english-heading";

  return (
    <div className="bg-bharat-cream min-h-screen" data-testid="gallery-page">
      <section className="bg-bharat-ink text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className={`text-saffron text-sm uppercase tracking-[0.3em] font-bold mb-4 editorial-line ${hiClass}`}>{t("nav_gallery")}</div>
          <h1 className={`text-5xl md:text-6xl font-bold ${hiHeadingClass}`} data-testid="gallery-title">
            {lang === "hi" ? "पार्टी की झलकियाँ" : "Party Moments"}
          </h1>
          <p className={`mt-4 text-lg text-white/75 max-w-2xl ${hiClass}`}>
            {lang === "hi" ? "रैलियाँ, बैठकें, नामांकन और जन-संपर्क के क्षण" : "Rallies, meetings, nominations and public outreach moments"}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GALLERY_PHOTOS.map((p, i) => (
              <button
                key={i}
                onClick={() => setOpen(i)}
                className="group block bg-white border border-bharat-ink/10 hover:border-saffron transition-all overflow-hidden text-left"
                data-testid={`gallery-photo-${i}`}
              >
                <div className="aspect-square overflow-hidden bg-bharat-ink/5">
                  <img src={p.src} alt={p.caption_en} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-4 border-t border-bharat-ink/10">
                  <p className={`text-sm font-semibold text-bharat-ink ${hiClass}`}>
                    {lang === "hi" ? p.caption_hi : p.caption_en}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {open !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setOpen(null)} data-testid="gallery-modal">
          <button onClick={() => setOpen(null)} className="absolute top-6 right-6 text-white hover:text-saffron" data-testid="gallery-modal-close"><X size={28} /></button>
          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={GALLERY_PHOTOS[open].src} alt="" className="w-full max-h-[80vh] object-contain mx-auto" />
            <p className={`text-center text-white text-lg mt-4 ${hiClass}`}>
              {lang === "hi" ? GALLERY_PHOTOS[open].caption_hi : GALLERY_PHOTOS[open].caption_en}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
