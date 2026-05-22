import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Users, Newspaper, Plus, Trash2, Edit3, X, Languages, Mail, MessageSquare, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLang } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { api, formatApiError, PARTY_LOGO } from "../lib/api";

const empty = { title_hi: "", title_en: "", excerpt_hi: "", excerpt_en: "", content_hi: "", content_en: "", category: "समाचार", image_url: "", published: true };

export default function AdminDashboardPage() {
  const { lang, toggle, t } = useLang();
  const { user, token, logout, loading: authLoading } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState("memberships");
  const [memberships, setMemberships] = useState([]);
  const [news, setNews] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editForm, setEditForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);

  const hiClass = lang === "hi" ? "font-devanagari-body" : "font-english-body";
  const hiHeadingClass = lang === "hi" ? "font-devanagari-heading" : "font-english-heading";

  const authHeaders = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!authLoading && !user) nav("/admin/login");
  }, [user, authLoading, nav]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [m, n, c] = await Promise.all([
        api.get("/membership", { headers: authHeaders }),
        api.get("/news?published_only=false", { headers: authHeaders }),
        api.get("/contact", { headers: authHeaders }),
      ]);
      setMemberships(m.data);
      setNews(n.data);
      setContacts(c.data);
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchAll();
    // eslint-disable-next-line
  }, [user]);

  const handleLogout = () => {
    logout();
    nav("/admin/login");
  };

  const openCreate = () => { setEditForm(empty); setEditingId(null); setEditorOpen(true); };
  const openEdit = (n) => {
    setEditForm({
      title_hi: n.title_hi, title_en: n.title_en,
      excerpt_hi: n.excerpt_hi, excerpt_en: n.excerpt_en,
      content_hi: n.content_hi, content_en: n.content_en,
      category: n.category, image_url: n.image_url || "", published: n.published,
    });
    setEditingId(n.id);
    setEditorOpen(true);
  };

  const saveNews = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/news/${editingId}`, editForm, { headers: authHeaders });
        toast.success(lang === "hi" ? "समाचार अपडेट हो गया" : "News updated");
      } else {
        await api.post("/news", editForm, { headers: authHeaders });
        toast.success(lang === "hi" ? "समाचार जोड़ा गया" : "News created");
      }
      setEditorOpen(false);
      fetchAll();
    } catch (err) {
      toast.error(formatApiError(err));
    }
  };

  const deleteNews = async (id) => {
    if (!window.confirm(lang === "hi" ? "क्या आप वाकई हटाना चाहते हैं?" : "Are you sure to delete?")) return;
    try {
      await api.delete(`/news/${id}`, { headers: authHeaders });
      toast.success(lang === "hi" ? "हटा दिया गया" : "Deleted");
      fetchAll();
    } catch (err) {
      toast.error(formatApiError(err));
    }
  };

  if (authLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center bg-bharat-cream"><Loader2 className="animate-spin text-saffron" size={32} /></div>;
  }

  const inputCls = "w-full px-3 py-2 bg-white border border-bharat-ink/20 focus:border-saffron focus:outline-none rounded-none text-sm";

  return (
    <div className="min-h-screen bg-bharat-cream" data-testid="admin-dashboard">
      {/* Admin Top Bar */}
      <header className="bg-bharat-ink text-white border-b-2 border-saffron sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={PARTY_LOGO} alt="" className="h-10 w-10 bg-bharat-ink rounded-sm" />
            <div>
              <div className={`text-base font-bold ${hiHeadingClass}`}>{t("admin_dashboard")}</div>
              <div className="text-xs text-white/60">{user.email}</div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={toggle} className="flex items-center gap-2 px-3 py-2 text-xs border border-white/30 hover:border-saffron hover:text-saffron" data-testid="admin-lang-toggle">
              <Languages size={14} /> {lang === "hi" ? "EN" : "हि"}
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-xs bg-saffron text-white font-bold hover:bg-saffron-dark" data-testid="admin-logout-btn">
              <LogOut size={14} /> {t("admin_logout")}
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-bharat-ink/10">
        <div className="max-w-7xl mx-auto px-6 flex gap-1">
          {[
            { key: "memberships", label: t("admin_memberships"), icon: Users, count: memberships.length },
            { key: "news", label: t("admin_news_manage"), icon: Newspaper, count: news.length },
            { key: "contacts", label: lang === "hi" ? "संपर्क संदेश" : "Contact Messages", icon: MessageSquare, count: contacts.length },
          ].map((tb) => (
            <button
              key={tb.key}
              onClick={() => setTab(tb.key)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-bold border-b-2 transition-colors ${
                tab === tb.key ? "border-saffron text-saffron" : "border-transparent text-bharat-ink/60 hover:text-bharat-ink"
              } ${hiClass}`}
              data-testid={`admin-tab-${tb.key}`}
            >
              <tb.icon size={16} />
              {tb.label}
              <span className="bg-bharat-ink/10 px-2 py-0.5 text-xs font-bold">{tb.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {loading && <div className="text-bharat-ink/60 flex items-center gap-2"><Loader2 className="animate-spin" size={16} /> {t("loading")}</div>}

        {/* Memberships */}
        {tab === "memberships" && (
          <div data-testid="memberships-table-section">
            <h2 className={`text-2xl font-bold mb-6 text-bharat-ink ${hiHeadingClass}`}>{t("admin_memberships")} ({memberships.length})</h2>
            {memberships.length === 0 ? (
              <p className={`text-bharat-ink/60 ${hiClass}`}>{lang === "hi" ? "अभी कोई आवेदन नहीं" : "No applications yet"}</p>
            ) : (
              <div className="overflow-x-auto bg-white border border-bharat-ink/10">
                <table className="w-full text-sm">
                  <thead className="bg-bharat-ink text-white">
                    <tr>
                      {[t("form_name"), t("form_phone"), t("form_email"), t("form_state"), t("form_city"), t("form_occupation"), lang === "hi" ? "दिनांक" : "Date"].map((h) => (
                        <th key={h} className={`px-4 py-3 text-left font-bold uppercase text-xs tracking-wider ${hiClass}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {memberships.map((m, i) => (
                      <tr key={m.id} className="border-t border-bharat-ink/10 hover:bg-bharat-cream" data-testid={`membership-row-${i}`}>
                        <td className={`px-4 py-3 font-semibold ${hiClass}`}>{m.name}</td>
                        <td className="px-4 py-3">{m.phone}</td>
                        <td className="px-4 py-3 text-bharat-ink/70">{m.email || "—"}</td>
                        <td className={`px-4 py-3 ${hiClass}`}>{m.state}</td>
                        <td className={`px-4 py-3 ${hiClass}`}>{m.city}</td>
                        <td className={`px-4 py-3 ${hiClass}`}>{m.occupation || "—"}</td>
                        <td className="px-4 py-3 text-xs text-bharat-ink/60">{new Date(m.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* News CRUD */}
        {tab === "news" && (
          <div data-testid="news-management-section">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold text-bharat-ink ${hiHeadingClass}`}>{t("admin_news_manage")} ({news.length})</h2>
              <button onClick={openCreate} className="inline-flex items-center gap-2 bg-saffron text-white px-5 py-2.5 font-bold btn-sharp hover:bg-saffron-dark" data-testid="admin-add-news-btn">
                <Plus size={16} /> {t("admin_add_news")}
              </button>
            </div>
            {news.length === 0 ? (
              <p className={`text-bharat-ink/60 ${hiClass}`}>{lang === "hi" ? "अभी कोई समाचार नहीं" : "No news yet"}</p>
            ) : (
              <div className="space-y-3">
                {news.map((n, i) => (
                  <div key={n.id} className="bg-white border border-bharat-ink/10 p-5 flex items-start gap-4" data-testid={`news-row-${i}`}>
                    {n.image_url && <img src={n.image_url} alt="" className="w-24 h-24 object-cover shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs uppercase tracking-widest font-bold text-saffron ${hiClass}`}>{n.category}</span>
                        {!n.published && <span className="text-xs bg-bharat-ink/10 text-bharat-ink/60 px-2 py-0.5">{lang === "hi" ? "अप्रकाशित" : "Draft"}</span>}
                      </div>
                      <h3 className={`text-lg font-bold text-bharat-ink ${hiHeadingClass}`}>{lang === "hi" ? n.title_hi : n.title_en}</h3>
                      <p className={`text-sm text-bharat-ink/60 line-clamp-2 mt-1 ${hiClass}`}>{lang === "hi" ? n.excerpt_hi : n.excerpt_en}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => openEdit(n)} className="p-2 border border-bharat-ink/20 hover:border-bharat-blue hover:text-bharat-blue" data-testid={`news-edit-${i}`}>
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => deleteNews(n.id)} className="p-2 border border-bharat-ink/20 hover:border-red-600 hover:text-red-600" data-testid={`news-delete-${i}`}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Contacts */}
        {tab === "contacts" && (
          <div data-testid="contacts-section">
            <h2 className={`text-2xl font-bold mb-6 text-bharat-ink ${hiHeadingClass}`}>{lang === "hi" ? "संपर्क संदेश" : "Contact Messages"} ({contacts.length})</h2>
            {contacts.length === 0 ? (
              <p className={`text-bharat-ink/60 ${hiClass}`}>{lang === "hi" ? "अभी कोई संदेश नहीं" : "No messages yet"}</p>
            ) : (
              <div className="space-y-3">
                {contacts.map((c, i) => (
                  <div key={c.id || i} className="bg-white border border-bharat-ink/10 p-5" data-testid={`contact-row-${i}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold text-bharat-ink">{c.name} <span className="text-bharat-ink/50 text-sm">• {c.email}</span></div>
                      <span className="text-xs text-bharat-ink/60">{new Date(c.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="text-sm text-saffron font-semibold mb-2">{c.subject}</div>
                    <p className="text-bharat-ink/75 text-sm">{c.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* News Editor Modal */}
      {editorOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-start md:items-center justify-center p-4 overflow-auto" data-testid="news-editor-modal">
          <div className="bg-white w-full max-w-3xl border-t-4 border-saffron my-8">
            <div className="flex items-center justify-between p-5 border-b border-bharat-ink/10">
              <h3 className={`text-xl font-bold ${hiHeadingClass}`}>
                {editingId ? (lang === "hi" ? "समाचार संपादन" : "Edit News") : t("admin_add_news")}
              </h3>
              <button onClick={() => setEditorOpen(false)} className="p-1 hover:bg-bharat-ink/5" data-testid="news-editor-close"><X size={20} /></button>
            </div>
            <form onSubmit={saveNews} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-bharat-ink/70 mb-1">Title (Hindi)</label>
                  <input required value={editForm.title_hi} onChange={(e) => setEditForm({ ...editForm, title_hi: e.target.value })} className={inputCls} data-testid="news-form-title-hi" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-bharat-ink/70 mb-1">Title (English)</label>
                  <input required value={editForm.title_en} onChange={(e) => setEditForm({ ...editForm, title_en: e.target.value })} className={inputCls} data-testid="news-form-title-en" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-bharat-ink/70 mb-1">Excerpt (Hindi)</label>
                  <textarea required rows="2" value={editForm.excerpt_hi} onChange={(e) => setEditForm({ ...editForm, excerpt_hi: e.target.value })} className={inputCls} data-testid="news-form-excerpt-hi" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-bharat-ink/70 mb-1">Excerpt (English)</label>
                  <textarea required rows="2" value={editForm.excerpt_en} onChange={(e) => setEditForm({ ...editForm, excerpt_en: e.target.value })} className={inputCls} data-testid="news-form-excerpt-en" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-bharat-ink/70 mb-1">Content (Hindi)</label>
                  <textarea required rows="5" value={editForm.content_hi} onChange={(e) => setEditForm({ ...editForm, content_hi: e.target.value })} className={inputCls} data-testid="news-form-content-hi" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-bharat-ink/70 mb-1">Content (English)</label>
                  <textarea required rows="5" value={editForm.content_en} onChange={(e) => setEditForm({ ...editForm, content_en: e.target.value })} className={inputCls} data-testid="news-form-content-en" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-bharat-ink/70 mb-1">Category</label>
                  <input value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} className={inputCls} data-testid="news-form-category" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-bharat-ink/70 mb-1">Image URL</label>
                  <input value={editForm.image_url} onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })} className={inputCls} data-testid="news-form-image" />
                </div>
                <label className="flex items-center gap-2 mt-2 col-span-2">
                  <input type="checkbox" checked={editForm.published} onChange={(e) => setEditForm({ ...editForm, published: e.target.checked })} className="w-4 h-4 accent-saffron" data-testid="news-form-published" />
                  <span className="text-sm">{lang === "hi" ? "प्रकाशित करें" : "Published"}</span>
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-bharat-ink/10">
                <button type="button" onClick={() => setEditorOpen(false)} className="px-5 py-2.5 border border-bharat-ink/20 font-bold text-sm hover:border-bharat-ink">
                  {t("cancel")}
                </button>
                <button type="submit" className="px-6 py-2.5 bg-saffron text-white font-bold text-sm btn-sharp hover:bg-saffron-dark" data-testid="news-form-save">
                  {t("save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
