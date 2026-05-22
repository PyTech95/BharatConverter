import React from "react";
import { Link } from "react-router-dom";
import { useLang } from "../contexts/LanguageContext";
import { ASHOKA_TEXTURE, FLAG_IMG, PARLIAMENT_IMG, PHOTO_NOMINATION } from "../lib/api";
import { Flag, BookOpen, Target, ShieldX, Briefcase, ArrowRight } from "lucide-react";

export default function AboutPage() {
  const { lang, t } = useLang();
  const hiClass = lang === "hi" ? "font-devanagari-body" : "font-english-body";
  const hiHeadingClass = lang === "hi" ? "font-devanagari-heading" : "font-english-heading";

  return (
    <div className="bg-bharat-cream" data-testid="about-page">
      {/* Page Hero */}
      <section className="bg-bharat-ink text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <img src={PARLIAMENT_IMG} alt="parliament" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-bharat-ink/70 to-bharat-ink" />
        <div className="relative max-w-5xl mx-auto px-6">
          <div className={`text-saffron text-sm uppercase tracking-[0.3em] font-bold mb-4 editorial-line ${hiClass}`}>{t("about_eyebrow")}</div>
          <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] ${hiHeadingClass}`} data-testid="about-title">{t("about_title")}</h1>
          <p className={`mt-6 text-lg md:text-xl text-white/85 max-w-3xl leading-relaxed ${hiClass}`}>
            {lang === "hi"
              ? "एकता में शक्ति, सौहार्द में प्रगति — भारत जैसे विशाल और विविधताओं से भरे देश को एक सूत्र में पिरोने के लिए बुलंद भारत पार्टी का गठन किया गया है।"
              : "Strength in unity, progress in harmony — Buland Bharat Party was founded to weave a vast and diverse India into a single thread."}
          </p>
        </div>
      </section>

      {/* Three pillars: ideology, vision, mission */}
      <section className="py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-1 border border-bharat-ink">
          {[
            { icon: BookOpen, title: t("about_ideology_title"), desc: lang === "hi" ? "हम मानते हैं कि भारत की असली ताकत इसकी अनेकता में एकता है। 'पहले भारतीय' की भावना — संविधान की प्रस्तावना से प्रेरित — न्याय, स्वतंत्रता, समानता और बंधुत्व।" : "India's true strength lies in unity in diversity. The spirit of 'Indian First' — inspired by the Preamble — justice, liberty, equality and fraternity.", color: "text-saffron" },
            { icon: Target, title: t("about_vision_title"), desc: lang === "hi" ? "2047 तक भारत को विश्व की अग्रणी आर्थिक शक्ति बनाना, जहाँ हर नागरिक को गरिमामय जीवन, स्वास्थ्य, शिक्षा और रोज़गार के समान अवसर मिलें।" : "By 2047, make India the world's leading economic power with dignified life, health, education and employment for every citizen.", color: "text-bharat-blue" },
            { icon: Flag, title: t("about_mission_title"), desc: lang === "hi" ? "ज़मीनी स्तर पर लोकतंत्र को मज़बूत करना, भ्रष्टाचार-मुक्त शासन, और हर हाशिये पर खड़े व्यक्ति की आवाज़ को सत्ता तक पहुँचाना।" : "Strengthen democracy at the grassroots, deliver corruption-free governance, and amplify every marginalised voice to the corridors of power.", color: "text-bharat-green" },
          ].map((p, i) => (
            <div key={i} className="bg-white p-10 hover:bg-bharat-cream transition-colors" data-testid={`about-pillar-${i}`}>
              <p.icon className={`${p.color} mb-5`} size={36} strokeWidth={1.5} />
              <h3 className={`text-2xl md:text-3xl font-bold mb-4 text-bharat-ink ${hiHeadingClass}`}>{p.title}</h3>
              <p className={`text-bharat-ink/75 leading-relaxed text-base ${hiClass}`}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Editorial story — एकता, सौहार्द and 3 challenges */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="editorial-divider mb-10" />
          <h2 className={`text-3xl md:text-5xl font-bold mb-8 text-bharat-ink leading-tight ${hiHeadingClass}`}>
            {lang === "hi" ? "एकता, सौहार्द और विकास का संकल्प" : "Pledge of Unity, Harmony and Development"}
          </h2>
          <div className={`prose prose-lg max-w-none text-bharat-ink/80 leading-relaxed space-y-6 ${hiClass}`}>
            <p className="text-xl first-letter:text-7xl first-letter:font-bold first-letter:text-saffron first-letter:mr-3 first-letter:float-left first-letter:leading-none">
              {lang === "hi"
                ? "भारत जैसे विशाल और विविधताओं से भरे देश को एक सूत्र में पिरोने के लिए बुलंद भारत पार्टी का गठन किया गया है। इस पार्टी का मूल मंत्र है — एकता में शक्ति, सौहार्द में प्रगति। देश आज जिन गंभीर चुनौतियों से जूझ रहा है उनमें भ्रष्टाचार और बेरोजगारी सबसे बड़ी बाधाएं हैं।"
                : "Buland Bharat Party was founded to bind together a country as vast and diverse as India. Our core mantra — strength in unity, progress in harmony. Among the gravest challenges the country faces today, corruption and unemployment are the biggest obstacles."}
            </p>
          </div>

          {/* Three feature blocks */}
          <div className="mt-12 space-y-8">
            <div className="border-l-4 border-saffron pl-6">
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-xs uppercase tracking-widest text-saffron font-bold ${hiClass}`}>01</span>
                <h3 className={`text-2xl md:text-3xl font-bold text-bharat-ink ${hiHeadingClass}`}>
                  {lang === "hi" ? "एकता और सौहार्द — पार्टी की नींव" : "Unity & Harmony — The Foundation"}
                </h3>
              </div>
              <p className={`text-bharat-ink/80 leading-relaxed ${hiClass}`}>
                {lang === "hi"
                  ? "भारत की असली ताकत इसकी अनेकता में एकता है। पार्टी का हर कार्यकर्ता 'पहले भारतीय' की भावना को आगे बढ़ाएगा। मोहल्ला स्तर पर सामुदायिक संवाद, अंतर-धार्मिक सम्मेलन और युवाओं के लिए राष्ट्रीय एकता शिविरों के माध्यम से भाईचारे का माहौल बनाया जाएगा।"
                  : "India's true strength is unity in diversity. Every party worker carries forward the spirit of 'Indian First'. Through neighbourhood-level community dialogue, inter-faith conferences and national unity camps for youth, we will foster brotherhood."}
              </p>
            </div>

            <div className="border-l-4 border-bharat-blue pl-6">
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-xs uppercase tracking-widest text-bharat-blue font-bold ${hiClass}`}>02</span>
                <ShieldX className="text-bharat-blue" size={22} />
                <h3 className={`text-2xl md:text-3xl font-bold text-bharat-ink ${hiHeadingClass}`}>
                  {lang === "hi" ? "भ्रष्टाचार पर ज़ीरो टॉलरेंस" : "Zero Tolerance on Corruption"}
                </h3>
              </div>
              <p className={`text-bharat-ink/80 leading-relaxed ${hiClass}`}>
                {lang === "hi"
                  ? "भ्रष्टाचार देश के विकास का दीमक है। बुलंद भारत पार्टी प्रशासन में पारदर्शिता के लिए डिजिटल गवर्नेंस को बढ़ावा देगी। हर सरकारी योजना का पैसा सीधे लाभार्थी के खाते में। लोकपाल को मज़बूत बनाना, शिकायत निवारण को 30 दिन में हल करना और दोषियों पर फास्ट-ट्रैक कोर्ट में कार्रवाई पार्टी की प्राथमिकता है।"
                  : "Corruption is the termite of development. The party will champion digital governance for transparency. Direct benefit transfer for every scheme. Strengthening the Lokpal, 30-day grievance redressal and fast-track courts for the guilty are top priorities."}
              </p>
              <p className={`italic text-saffron mt-3 font-semibold ${hiClass}`}>
                {lang === "hi" ? "\"न खाऊँगा, न खाने दूँगा\" — को ज़मीनी हकीकत बनाया जाएगा।" : "\"Neither will I take, nor let others take\" — will be made ground reality."}
              </p>
            </div>

            <div className="border-l-4 border-bharat-green pl-6">
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-xs uppercase tracking-widest text-bharat-green font-bold ${hiClass}`}>03</span>
                <Briefcase className="text-bharat-green" size={22} />
                <h3 className={`text-2xl md:text-3xl font-bold text-bharat-ink ${hiHeadingClass}`}>
                  {lang === "hi" ? "बेरोजगारी से रोजगार की ओर" : "From Unemployment to Employment"}
                </h3>
              </div>
              <p className={`text-bharat-ink/80 leading-relaxed mb-4 ${hiClass}`}>
                {lang === "hi"
                  ? "पार्टी का 'कौशल भारत, रोजगार भारत' मिशन तीन स्तंभों पर खड़ा है:"
                  : "Our 'Skill India, Employment India' mission stands on three pillars:"}
              </p>
              <ul className={`space-y-3 text-bharat-ink/80 ${hiClass}`}>
                <li className="flex gap-3"><span className="text-saffron font-bold">•</span><span><strong>{lang === "hi" ? "स्किल हब" : "Skill Hub"}:</strong> {lang === "hi" ? "हर ज़िले में आधुनिक कौशल केंद्र — AI, सोलर, EV, ड्रोन और डिजिटल मार्केटिंग की मुफ़्त ट्रेनिंग।" : "Modern skill centres in every district — free training in AI, solar, EV, drones and digital marketing."}</span></li>
                <li className="flex gap-3"><span className="text-saffron font-bold">•</span><span><strong>MSME:</strong> {lang === "hi" ? "छोटे उद्योगों के लिए सिंगल-विंडो क्लीयरेंस, बिना गारंटी लोन और 5 साल टैक्स छूट।" : "Single-window clearance for small industries, collateral-free loans and 5-year tax holiday."}</span></li>
                <li className="flex gap-3"><span className="text-saffron font-bold">•</span><span><strong>{lang === "hi" ? "स्थानीय रोज़गार नीति" : "Local Employment Policy"}:</strong> {lang === "hi" ? "सरकारी व निजी नौकरियों में स्थानीय युवाओं को 75% प्राथमिकता।" : "75% priority to local youth in government and private jobs."}</span></li>
              </ul>
            </div>
          </div>

          {/* Closing */}
          <div className={`mt-14 p-8 md:p-10 bg-bharat-cream border-l-4 border-saffron ${hiClass}`}>
            <p className="text-lg italic text-bharat-ink/90 leading-relaxed">
              {lang === "hi"
                ? "बुलंद भारत पार्टी कोई साधारण राजनीतिक दल नहीं, बल्कि एक जन-आंदोलन है। इसका लक्ष्य सिर्फ सत्ता प्राप्त करना नहीं, बल्कि व्यवस्था परिवर्तन है। जब हर नागरिक को बिना भेदभाव के अवसर मिलेगा, जब रिश्वत की जगह मेहनत बोलेगी और जब हर हाथ को काम मिलेगा — तभी भारत वाकई बुलंद बनेगा।"
                : "Buland Bharat Party is not an ordinary political party but a people's movement. Its goal is not merely to attain power, but to transform the system. When every citizen gets opportunity without discrimination, when hard work replaces bribery, and when every hand finds work — only then will India truly be Buland."}
            </p>
            <Link to="/sankalp" className="inline-flex items-center gap-2 text-saffron font-bold mt-6 hover:text-saffron-dark" data-testid="about-sankalp-link">
              {lang === "hi" ? "विकास संकल्प पढ़ें" : "Read the Development Pledge"} <ArrowRight size={16} />
            </Link>
          </div>

          <div className="editorial-divider mt-14" />
        </div>
      </section>

      {/* Patriotic close */}
      <section className="relative bg-bharat-ink text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src={FLAG_IMG} alt="flag" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="tricolor-strip-horizontal h-1 w-24 mx-auto mb-8" />
          <h2 className={`text-4xl md:text-6xl font-bold ${hiHeadingClass}`}>{t("jai_hind")}.</h2>
          <p className={`mt-4 text-saffron text-xl tracking-widest uppercase font-bold ${hiClass}`}>{t("vande_mataram")}</p>
        </div>
      </section>
    </div>
  );
}
