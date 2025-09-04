// src/pages/Language.jsx
import React, { useEffect, useState } from "react";
import LanguageCard from "../components/LanguageCard";

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
            Speak Your Language, We Get Your Vibe
          </h2>
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
              {/* Actual card */}
              <LanguageCard
                isAction
                countryCode={showAll ? "Less" : "More"}
                language={showAll ? "Show fewer languages" : "Show all languages"}
                onClick={() => setShowAll((s) => !s)}
              />

              {/* Single small runner segment around edges */}
              <svg
                className="pointer-events-none absolute inset-0 w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <defs>
                  {/* SAME VIBE as underline: transparent -> white shine -> blue-400 */}
                  <linearGradient id="runnerGradient" x1="0%" y1="0%" x2="100%" y2="20%">
                    <stop offset="90%" stopColor="rgba(255,255,255,0.9)" />
                  </linearGradient>
                </defs>

                <rect
                  /* stroke clip na ho, isliye 1 unit andar */
                  x="1" y="0" width="98" height="98"
                  rx="12" ry="12"
                  fill="none"
                  stroke="url(#runnerGradient)"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                  shapeRendering="geometricPrecision"

                  /* === ek hi chhota runner segment + bada gap === */
                  pathLength="200"
                  strokeDasharray="48 952"   /* 36 = visible segment length; 964 = gap */
                  strokeDashoffset="2"
                  className="runner-rect"
                  style={{ animation: "border-runner 4s linear infinite" }}
                />
              </svg>
            </div>
          )}


        </div>
      </div>
    </section>
  );
};

export default LanguageSection;
