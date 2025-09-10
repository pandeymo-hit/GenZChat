import React from "react";
import HighlightCard from "../components/HighlightCard";
import {
  FaShieldAlt,
} from "react-icons/fa";
import toonimg from "../assets/toon.png";
import HighlightCard2 from "./HighlightCard2";

const features = [
  
  {
    id: 1,
    title: "Multi-Platform Support",
    description: `“One buddy, all apps.”
    Whether it’s WhatsApp, Instagram DMs, Tinder, or Bumble — GenZChat works seamlessly everywhere.`,
    icon: <span role="img" aria-label="phone" className="text-3xl">📱</span>,
  },
  {
    id: 2,
    title: "Real-Time Suggestions",
    description: `“Instant replies, zero overthinking.”
    Get real-time suggestions the moment a message drops, keeping the convo flowing and fun.`,
    icon: <span role="img" aria-label="zap" className="text-3xl">⚡</span>,
  },
  {
    id: 3,
    title: "Privacy First",
    description: `“Your secrets stay with you.”
    We don’t store your data. Everything stays private, safe, and only between you and your chats.`,
    icon: <span role="img" aria-label="shield" className="text-3xl"><FaShieldAlt className="text-pink-500 text-3xl" /></span>,
  },
];


const WhyUs = () => {
  // ✅ Fixed sticky behavior
  const FIXED_TOP = 210;   // 👈 cards will stick 190px below viewport top
  const GAP_PER_CARD = 22; // vertical stacking gap

  return (
    <>
    <HighlightCard />
    <HighlightCard2/>
    <section id="about" className="min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl pb-2 font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
            Why GenZChat Works
          </h2>
          <p className="text-gray-400 mt-3">
            AI-powered features designed to make your dating conversations irresistible
          </p>
        </div>

        {/* === MOBILE: sticky mascot + stacked sticky cards === */}
        <div className="block sm:hidden px-5 relative">
          {/* Mascot sticks at top; stays BEHIND cards */}
          <div className="sticky top-0 z-10 px-6">
            <img
              src={toonimg}
              alt="GenZChat Mascot"
              className="min-w-76 h-auto -ml-8 -mb-68 pointer-events-none select-none"
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* Spacer: start cards at FIXED_TOP (190px) */}
          <div style={{ height: FIXED_TOP }} />


          {features.map((feature, i) => (
            <div
              key={feature.id}
              className="
                sticky overflow-hidden isolate rounded-2xl mb-6
                will-change-transform transition-transform duration-300 ease-in-out
                hover:scale-[1.01] border border-white/10
                before:content-[''] before:absolute before:inset-0
                before:bg-[#0b1020]/75 before:backdrop-blur-xl before:backdrop-saturate-150
                before:rounded-2xl before:border before:border-white/10 mx-2
              "
              style={{
                top: `${FIXED_TOP + i * GAP_PER_CARD}px`, // 👈 190px + stacking gap
                zIndex: 30 + i,                            // 👈 newer card above previous
              }}
            >
              <div className="relative z-10 flex flex-col gap-4 p-6">
                {feature.icon}
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* === GRID: sm and up (untouched) === */}
       <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 relative mt-45 items-stretch auto-rows-fr">
  {features.map((feature, i) => (
    <div key={feature.id} className="relative z-0 mt-6 h-full">
      {i === 0 && (
        <img
          src={toonimg}
          alt="GenZChat Mascot"
          className="
            hidden sm:block 
            absolute -top-58 left-1/2 -translate-x-1/2
            h-auto min-w-96 pointer-events-none select-none z-[-1]
          "
          loading="lazy"
          decoding="async"
        />
      )}

      <div
        className="
          h-full bg-[#0b0b12]
          hover:shadow-[0_0_50px_rgba(139,92,246,0.5)]
          transform-gpu origin-center will-change-transform
          rounded-xl p-6 flex flex-col
          hover:border-gray-400 border border-transparent
          hover:scale-[1.02] transition-transform duration-300 ease-in-out
        "
      >
        <div className="text-3xl">{feature.icon}</div>
        <h3 className="text-lg font-semibold text-white mt-1">{feature.title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed mt-2 flex-1 whitespace-pre-line">
          {feature.description}
        </p>
      </div>
    </div>
  ))}
</div>

      </div>
    </section>
    </>
  );
};

export default WhyUs; 