// src/components/LanguageCard.jsx
import React from "react";

const LanguageCard = ({
  countryCode,
  language,
  active = false,
  isAction = false,
  onClick,
  className = "",     // ✅ NEW
  noBorder = false,   // ✅ NEW
}) => {
  return (
    <div className="relative w-full group">
      {/* Ambient aura */}
      <div className="pointer-events-none absolute -inset-5 rounded-[1.6rem] -z-10 opacity-10 sm:opacity-15 group-hover:opacity-25 transition-opacity duration-500">
        <div className="absolute inset-0 rounded-[inherit] blur-2xl bg-[radial-gradient(120%_80%_at_50%_-20%,rgba(168,85,247,0.22),transparent_60%),radial-gradient(140%_100%_at_100%_120%,rgba(59,130,246,0.18),transparent_60%)]" />
      </div>

      {/* Card */}
      <div
        className={`
          relative overflow-hidden
          flex flex-col items-center justify-center
          bg-[#141418] rounded-3xl h-34 w-full
          border transition-all duration-500
          ${noBorder
            ? "!border-transparent"                                   // ✅ force hide border
            : (active ? "border-violet-500/40" : "border-white/10 group-hover:border-violet-400/30")}
          ${isAction ? "cursor-pointer" : "cursor-default"}
          shadow-[0_0_0_0_rgba(0,0,0,0)] group-hover:shadow-[0_0_24px_rgba(139,92,246,0.20)]
          ${className}                                                // ✅ external overrides
        `}
        role={isAction ? "button" : undefined}
        tabIndex={isAction ? 0 : -1}
        onClick={isAction ? onClick : undefined}
        onKeyDown={isAction ? (e) => (e.key === "Enter" || e.key === " ") && onClick?.(e) : undefined}
      >
        {/* Inner glass */}
        <div className="pointer-events-none absolute inset-px rounded-[calc(theme(borderRadius.3xl)-1px)] bg-gradient-to-br from-white/5 via-transparent to-white/5" />

        {/* Title */}
        <span className={`relative z-10 text-white font-semibold text-lg sm:text-xl mb-1 ${isAction ? "flex items-center gap-2" : ""}`}>
          {countryCode}
          {isAction && (
            <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-80">
              <path d="M8 10l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </span>

        {/* Subtitle */}
        <span className="relative z-10 text-gray-300 text-sm sm:text-base">
          {language}
        </span>
      </div>
    </div>
  );
};

export default LanguageCard;
