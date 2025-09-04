import React from "react";
import FadeUpSection from "../hooks/FadeUpSection";

const ChatSuggestions = () => {
  return (
    <FadeUpSection>
    <div className="= max-w-5xl mx-auto py-16 pb-18 md:mt-5  flex flex-col items-center justify-center p-10 bg-black/20 backdrop-blur-xl  rounded-3xl shadow-lg">
      {/* Top label */}
      <div className="mb-8 px-6 py-2 bg-[#1a1a1a] rounded-full text-gray-300 text-sm max-w-md text-center">
        AI adapts to your language automatically <span className="inline-block">✨</span>
      </div>

      {/* Container for two messages */}
      <div className="flex flex-col sm:flex-row gap-10 max-w-4xl w-full justify-center">
        {/* Left block */}
        <div className="flex flex-col gap-6 items-center">
          <div className="bg-[#181818] rounded-2xl px-6 py-3 max-w-sm text-center text-gray-300 text-sm font-medium">
            Their message
            <div className="mt-1 font-semibold text-white text-lg">
              "Kya plan hai weekend ka?"
            </div>
          </div>

          <div className="rounded-3xl px-8 py-6 max-w-sm bg-gradient-to-r from-[#8b5cf6] to-[#60a5fa] text-white text-center text-base leading-relaxed font-semibold">
            AI suggestion in Hinglish
            <div className="mt-2 font-normal text-sm leading-snug">
              "Abhi tak kuch fix nahi hai, but coffee ka plan bana sakte hain if you're free 😊"
            </div>
          </div>
        </div>

        {/* Right block */}
        <div className="flex flex-col gap-6 items-center">
          <div className="bg-[#181818] rounded-2xl px-6 py-3 max-w-sm text-center text-gray-300 text-sm font-medium">
            Their message
            <div className="mt-1 font-semibold text-white text-lg">
              "வார இறுதியில் என்ன திட்டம்?"
            </div>
          </div>

          <div className="rounded-3xl px-8 py-6 max-w-sm bg-gradient-to-r from-[#8b5cf6] to-[#60a5fa] text-white text-center text-base leading-relaxed font-semibold">
            AI suggestion in Tamil
            <div className="mt-2 font-normal text-sm leading-snug">
              "இன்னும் எதுவும் முடிவு செய்யவில்லை, நீங்கள் free-யா இருந்தா coffee போகலாம் 😊"
            </div>
          </div>
        </div>
      </div>
    </div>
  </FadeUpSection>
  );
};

export default ChatSuggestions;
