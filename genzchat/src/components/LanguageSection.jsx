// src/pages/Language.jsx
import React, { useEffect, useState } from "react";
import LanguageCard from "../components/LanguageCard";
import ChatSuggestions from "./ChatSuggestions";

const LanguageSection = () => {
  const [showAll, setShowAll] = useState(false);
  const [limit, setLimit] = useState(3); // default mobile

  const languages = [
    { countryCode: "Hindi", language: "हिंदी" },
    { countryCode: "Hinglish", language: "हिं + Eng" },
    { countryCode: "English", language: "English" },
    { countryCode: "Bengali", language: "বাংলা" },
    { countryCode: "Tamil", language: "தமிழ்" },
    { countryCode: "Telugu", language: "తెలుగు" },
    { countryCode: "Marathi", language: "मराठी" },
    { countryCode: "Punjabi", language: "ਪੰਜਾਬੀ" },
    { countryCode: "Urdu", language: "اردو" },
  ];

  // useEffect(() => {
  //   const updateLimit = () => setLimit(window.innerWidth >= 768 ? 7 : 3);
  //   updateLimit();
  //   window.addEventListener("resize", updateLimit);
  //   return () => window.removeEventListener("resize", updateLimit);
  // }, []);

  const visible = showAll ? languages : languages.slice(0, limit);
  const canToggle = languages.length > limit;

  return (
    <section className="max-w-7xl mx-auto text-white py-15">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-14 text-center">
          <h2 className="text-3xl md:text-5xl pb-2 font-extrabold mb-10 bg-gradient-to-r from-purple-500 via-pink-400 to-blue-400 text-transparent bg-clip-text animate-[gradientShift_4s_linear_infinite]">
            We Don't Just Translate.We Talk Like Your Vibe.
          </h2>
          <ChatSuggestions/>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            From pure Hindi to Hinglish, Tamil to Tanglish, Bengali to Gen-Z slang —
            GenZChat adapts to YOUR style. No more struggling with English-only dating apps.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {visible.map((lang, i) => (
            <LanguageCard
              key={`${lang.countryCode}-${i}`}
              countryCode={lang.countryCode}
              language={lang.language}
            />
          ))}

          {/* More/Less as a LanguageCard so layout stays perfect */}
          {canToggle && (
           <div className="relative rounded-xl overflow-hidden">
  <LanguageCard
    isAction
    noBorder                   // ✅ only runner dikhega
    countryCode={showAll ? "Less" : "More"}
    language={showAll ? "Show fewer languages" : "Show all languages"}
    onClick={() => setShowAll((s) => !s)}
  />

  {/* Single running border (sirf ek line) */}
  <svg className="pointer-events-none absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
    <rect
      x="1" y="1" width="98" height="98" rx="12" ry="12"
      fill="none"
      stroke="rgba(139,92,246,0.20)"     /* 💜 your color */
      strokeWidth="2"
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
      pathLength="200"
      strokeDasharray="28 172"           /* 28 visible, 172 gap = 200 */
      strokeDashoffset="0"
      style={{ animation: "border-runner 4s linear infinite" }}
    />
  </svg>
</div>
          )}


        </div>
      </div>
<style>{`
  @keyframes border-runner {
    0%   { stroke-dashoffset: 0; }
    100% { stroke-dashoffset: -200; }
  }
`}</style>


    </section>
  );
};

export default LanguageSection;
