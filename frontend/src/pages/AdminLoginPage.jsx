import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Shield, ArrowLeft } from "lucide-react";
import { useLang } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { formatApiError, PARTY_LOGO } from "../lib/api";

export default function AdminLoginPage() {
  const { lang, t } = useLang();
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@bulandbharat.in");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const hiClass = lang === "hi" ? "font-devanagari-body" : "font-english-body";
  const hiHeadingClass = lang === "hi" ? "font-devanagari-heading" : "font-english-heading";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success(lang === "hi" ? "स्वागत है, व्यवस्थापक!" : "Welcome, admin!");
      nav("/admin");
    } catch (err) {
      toast.error(formatApiError(err) || t("admin_invalid"));
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full px-4 py-3 bg-white border border-bharat-ink/20 focus:border-saffron focus:outline-none text-bharat-ink rounded-none";

  return (
    <div className="min-h-screen bg-bharat-ink flex items-center justify-center px-6 py-12 relative overflow-hidden" data-testid="admin-login-page">
      <div className="tricolor-strip-horizontal absolute top-0 left-0 right-0 h-1" />
      <div className="absolute inset-0 chakra-bg opacity-20" />

      <div className="relative w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-saffron mb-8 text-sm">
          <ArrowLeft size={14} /> {lang === "hi" ? "मुख्य पृष्ठ" : "Home"}
        </Link>

        <div className="bg-bharat-cream border-t-4 border-saffron p-8 md:p-10">
          <div className="text-center mb-8">
            <img src={PARTY_LOGO} alt="" className="h-16 w-16 mx-auto bg-bharat-ink rounded-sm mb-4" />
            <h1 className={`text-3xl font-bold text-bharat-ink ${hiHeadingClass}`}>{t("admin_login_title")}</h1>
            <p className={`text-bharat-ink/60 mt-2 text-sm ${hiClass}`}>{t("admin_login_desc")}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={`block text-sm font-bold text-bharat-ink mb-2 ${hiClass}`}>{t("admin_email")}</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} data-testid="admin-login-email" />
            </div>
            <div>
              <label className={`block text-sm font-bold text-bharat-ink mb-2 ${hiClass}`}>{t("admin_password")}</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} data-testid="admin-login-password" />
            </div>
            <button type="submit" disabled={submitting} className="w-full inline-flex items-center justify-center gap-2 bg-bharat-ink text-white px-7 py-3.5 font-bold btn-sharp hover:bg-saffron disabled:opacity-60" data-testid="admin-login-submit">
              <Shield size={16} />
              {submitting ? t("admin_logging_in") : t("admin_login_btn")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
