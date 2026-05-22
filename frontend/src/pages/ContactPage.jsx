import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { toast } from "sonner";
import { useLang } from "../contexts/LanguageContext";
import { api, formatApiError, PARLIAMENT_IMG } from "../lib/api";

export default function ContactPage() {
  const { lang, t } = useLang();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const hiClass = lang === "hi" ? "font-devanagari-body" : "font-english-body";
  const hiHeadingClass = lang === "hi" ? "font-devanagari-heading" : "font-english-heading";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/contact", form);
      toast.success(t("contact_success"));
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full px-4 py-3 bg-white border border-bharat-ink/20 focus:border-saffron focus:outline-none text-bharat-ink rounded-none transition-colors";

  return (
    <div className="bg-bharat-cream" data-testid="contact-page">
      <section className="bg-bharat-ink text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <img src={PARLIAMENT_IMG} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-bharat-ink/80 to-bharat-ink/40" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className={`text-saffron text-sm uppercase tracking-[0.3em] font-bold mb-4 editorial-line ${hiClass}`}>{t("nav_contact")}</div>
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold ${hiHeadingClass}`} data-testid="contact-title">{t("contact_title")}</h1>
          <p className={`mt-4 text-lg text-white/85 max-w-2xl ${hiClass}`}>{t("contact_subtitle")}</p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Info */}
          <div className="lg:col-span-5 space-y-6">
            {[
              { icon: MapPin, title: t("contact_address_label"), value: t("contact_address") },
              { icon: Phone, title: t("contact_phone_label"), value: "+91 11 4321 0000" },
              { icon: Mail, title: t("contact_email_label"), value: "info@bulandbharat.in" },
              { icon: Clock, title: t("contact_hours_label"), value: t("contact_hours") },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-bharat-ink/10 p-6 flex items-start gap-4 hover:border-saffron transition-colors" data-testid={`contact-info-${i}`}>
                <div className="w-12 h-12 bg-saffron flex items-center justify-center text-white shrink-0">
                  <item.icon size={20} />
                </div>
                <div>
                  <div className={`text-xs uppercase tracking-widest text-bharat-ink/60 font-bold mb-1 ${hiClass}`}>{item.title}</div>
                  <div className={`text-bharat-ink font-semibold ${hiClass}`}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="bg-white border border-bharat-ink/10 p-6 md:p-10 space-y-5" data-testid="contact-form">
              <h3 className={`text-2xl font-bold text-bharat-ink ${hiHeadingClass}`}>
                {lang === "hi" ? "हमें संदेश भेजें" : "Send us a Message"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input type="text" required placeholder={t("form_name")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} data-testid="contact-input-name" />
                <input type="email" required placeholder={t("form_email").replace(" (वैकल्पिक)", "").replace(" (optional)", "")} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} data-testid="contact-input-email" />
                <input type="tel" placeholder={t("form_phone")} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} data-testid="contact-input-phone" />
                <input type="text" required placeholder={t("contact_form_subject")} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className={inputCls} data-testid="contact-input-subject" />
              </div>
              <textarea required rows="6" placeholder={t("contact_form_message")} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={inputCls} data-testid="contact-input-message" />
              <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 bg-saffron text-white px-7 py-3.5 font-bold btn-sharp hover:bg-saffron-dark disabled:opacity-60" data-testid="contact-submit-btn">
                {submitting ? t("form_submitting") : t("contact_form_submit")} <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
