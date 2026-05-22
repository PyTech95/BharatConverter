import React, { useState } from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useLang } from "../contexts/LanguageContext";
import { api, formatApiError, ASHOKA_TEXTURE } from "../lib/api";

const STATES_HI = [
  "आंध्र प्रदेश","अरुणाचल प्रदेश","असम","बिहार","छत्तीसगढ़","गोवा","गुजरात","हरियाणा","हिमाचल प्रदेश","झारखंड",
  "कर्नाटक","केरल","मध्य प्रदेश","महाराष्ट्र","मणिपुर","मेघालय","मिज़ोरम","नागालैंड","ओडिशा","पंजाब",
  "राजस्थान","सिक्किम","तमिलनाडु","तेलंगाना","त्रिपुरा","उत्तर प्रदेश","उत्तराखंड","पश्चिम बंगाल","दिल्ली",
];

export default function JoinPage() {
  const { lang, t } = useLang();
  const [form, setForm] = useState({ name: "", phone: "", email: "", state: "", city: "", address: "", age: "", occupation: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const hiClass = lang === "hi" ? "font-devanagari-body" : "font-english-body";
  const hiHeadingClass = lang === "hi" ? "font-devanagari-heading" : "font-english-heading";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...form };
      if (!payload.email) delete payload.email;
      if (!payload.age) delete payload.age;
      else payload.age = parseInt(payload.age, 10);
      Object.keys(payload).forEach((k) => { if (payload[k] === "") delete payload[k]; });
      await api.post("/membership", payload);
      setDone(true);
      toast.success(t("form_success"));
    } catch (err) {
      toast.error(formatApiError(err) || t("form_error"));
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="bg-bharat-cream min-h-[80vh] flex items-center justify-center py-20 px-6" data-testid="join-success">
        <div className="max-w-xl text-center bg-white border-2 border-bharat-green p-10 md:p-14">
          <CheckCircle2 className="text-bharat-green mx-auto mb-6" size={64} strokeWidth={1.5} />
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 text-bharat-ink ${hiHeadingClass}`}>{t("form_success")}</h2>
          <p className={`text-bharat-ink/70 mb-8 ${hiClass}`}>
            {lang === "hi" ? "हमारी टीम जल्दी ही आपसे संपर्क करेगी।" : "Our team will contact you soon."}
          </p>
          <button onClick={() => { setDone(false); setForm({ name: "", phone: "", email: "", state: "", city: "", address: "", age: "", occupation: "", message: "" }); }} className="bg-saffron text-white px-7 py-3 font-bold btn-sharp hover:bg-saffron-dark" data-testid="join-success-reset">
            {lang === "hi" ? "एक और सदस्यता" : "Add Another"}
          </button>
        </div>
      </div>
    );
  }

  const inputCls = "w-full px-4 py-3 bg-white border border-bharat-ink/20 focus:border-saffron focus:outline-none text-bharat-ink rounded-none transition-colors";
  const labelCls = `block text-sm font-bold text-bharat-ink mb-2 ${hiClass}`;

  return (
    <div className="bg-bharat-cream relative" data-testid="join-page">
      <section className="bg-bharat-ink text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url(${ASHOKA_TEXTURE})`, backgroundSize: "300px" }} />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className={`text-saffron text-sm uppercase tracking-[0.3em] font-bold mb-4 editorial-line ${hiClass}`}>{t("nav_join")}</div>
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold ${hiHeadingClass}`} data-testid="join-page-title">{t("join_title")}</h1>
          <p className={`mt-4 text-lg text-white/80 max-w-2xl ${hiClass}`}>{t("join_subtitle")}</p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6">
          <form onSubmit={handleSubmit} className="bg-white border border-bharat-ink/10 p-6 md:p-10 space-y-6" data-testid="join-form">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>{t("form_name")} <span className="text-saffron">*</span></label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} data-testid="join-input-name" />
              </div>
              <div>
                <label className={labelCls}>{t("form_phone")} <span className="text-saffron">*</span></label>
                <input type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} data-testid="join-input-phone" />
              </div>
              <div>
                <label className={labelCls}>{t("form_email")}</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} data-testid="join-input-email" />
              </div>
              <div>
                <label className={labelCls}>{t("form_age")}</label>
                <input type="number" min="18" max="120" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className={inputCls} data-testid="join-input-age" />
              </div>
              <div>
                <label className={labelCls}>{t("form_state")} <span className="text-saffron">*</span></label>
                <select required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className={inputCls} data-testid="join-input-state">
                  <option value="">—</option>
                  {STATES_HI.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>{t("form_city")} <span className="text-saffron">*</span></label>
                <input type="text" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputCls} data-testid="join-input-city" />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>{t("form_address")}</label>
                <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputCls} data-testid="join-input-address" />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>{t("form_occupation")}</label>
                <input type="text" value={form.occupation} onChange={(e) => setForm({ ...form, occupation: e.target.value })} className={inputCls} data-testid="join-input-occupation" />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>{t("form_message")}</label>
                <textarea rows="4" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={inputCls} data-testid="join-input-message" />
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-bharat-ink/10">
              <p className={`text-xs text-bharat-ink/60 ${hiClass}`}>
                {lang === "hi"
                  ? "आपकी जानकारी सुरक्षित है और केवल पार्टी संपर्क हेतु प्रयुक्त होगी।"
                  : "Your information is secure and will only be used for party communications."}
              </p>
              <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 bg-saffron text-white px-7 py-3.5 font-bold btn-sharp hover:bg-saffron-dark disabled:opacity-60" data-testid="join-submit-btn">
                {submitting ? t("form_submitting") : t("form_submit")} <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
