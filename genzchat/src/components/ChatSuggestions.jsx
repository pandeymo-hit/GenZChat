// src/components/ChatSuggestions.jsx
import React from "react";
import FadeUpSection from "../hooks/FadeUpSection";
import EvolvingText from "../components/EvolvingText";

function ChatBubble({ side, children, ai = false }) {
  const isRight = side === "right";
  return (
    <div className={`flex ${isRight ? "justify-end" : "justify-start"}`}>
      <div
        className={[
          "relative rounded-2xl px-5 py-3 text-[13.5px] sm:text-sm leading-relaxed ring-1",
          "max-w-[86%] sm:max-w-[80%] md:max-w-[540px]",
          isRight
            ? "bg-gradient-to-tr from-indigo-600/85 to-sky-500/85 text-white ring-white/10 shadow-[0_8px_28px_rgba(59,130,246,0.22)]"
            : "bg-white/5 text-gray-100 ring-white/10 shadow-[0_8px_22px_rgba(0,0,0,0.28)]",
          isRight ? "animate-[slideInRight_.36s_ease-out_forwards]" : "animate-[slideInLeft_.36s_ease-out_forwards]",
          "opacity-0",
        ].join(" ")}
      >
        {ai && (
          <span className="absolute -top-2 right-3 text-[10px] px-2 py-[2px] rounded-full bg-white/10 text-white/85 ring-1 ring-white/15">
            AI
          </span>
        )}
        {children}
      </div>
    </div>
  );
}

export default function ChatSuggestions() {
  // 👇 texts for the top pill (rotates + fades)
  const topTexts = [
    "AI adapts to your language automatically ✨",
    "Hinglish, Tamil, Bengali — auto-switch 💬",
    "Talk in your vibe. We’ll match. ⚡",
  ];

  return (
    <FadeUpSection>
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-12 mb-6">
        <div className="rounded-3xl border border-white/10 bg-transparent backdrop-blur-6xl p-6 sm:p-8 md:p-10 shadow-[0_0_10px_rgba(139,92,246,0.5)]">
          {/* Top center pill — stays in same place, now rotating/fading */}
          <div className="mb-8 flex justify-center">
            <div className="px-5 py-2 bg-[#1a1a1a] rounded-full text-gray-300 text-xs sm:text-sm border border-white/10">
              <EvolvingText
                texts={topTexts}
                interval={2500}
                fadeDuration={500}
                as="span"
                className="inline-block"
              />
            </div>
          </div>

          {/* Mobile feed */}
          <div className="space-y-5 md:hidden">
            <ChatBubble side="right">“Bahar chalogi date pe? 😊”</ChatBubble>
            <ChatBubble side="left">“Abhi thoda busy hoon… maybe next time 🙈”</ChatBubble>
            <div className="space-y-1">
              <div className="text-[11px] text-white/70 pl-1">AI suggestion</div>
              <ChatBubble side="right">
                “Bilkul pressure nahi — is week tumhare office ke paas 15-min coffee break?
                Time tum decide, vibe tumhari. ✨”
              </ChatBubble>
            </div>
            <ChatBubble side="left">“That’s cute 😄 Friday 7pm chalega?”</ChatBubble>
          </div>

          {/* Desktop layout */}
          <div className="hidden md:grid grid-cols-2 gap-x-10 gap-y-12">
            <div className="col-start-2">
              <ChatBubble side="right">“Bahar chalogi date pe? 😊”</ChatBubble>
            </div>
            <div className="col-start-1">
              <ChatBubble side="left">“Abhi thoda busy hoon… maybe next time 🙈”</ChatBubble>
            </div>
            <div className="col-start-2">
              <div className="mb-1 text-[12px] text-white/70 text-center md:text-left">AI suggestion</div>
              <ChatBubble side="right">
                “Bilkul pressure nahi — is week tumhare office ke paas 15-min coffee break?
                Time tum decide, vibe tumhari. ✨”
              </ChatBubble>
            </div>
            <div className="col-start-1">
              <ChatBubble side="left">“That’s cute 😄 Friday 7pm chalega?”</ChatBubble>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes slideInRight {
            0% { opacity: 0; transform: translateX(14px) translateY(6px) scale(.98); }
            100% { opacity: 1; transform: translateX(0) translateY(0) scale(1); }
          }
          @keyframes slideInLeft {
            0% { opacity: 0; transform: translateX(-14px) translateY(6px) scale(.98); }
            100% { opacity: 1; transform: translateX(0) translateY(0) scale(1); }
          }
        `}</style>
      </section>
    </FadeUpSection>
  );
}
