import cartoon from '../assets/couple.png';
import React from "react";

const CTASection = () => {
  return (
    <div className="mt-22 md:mt-40 flex justify-center items-center px-6">
      <div
        className="relative bg-gradient-to-br from-[#1a1a1a] via-[#111111] to-[#1a1a1a]
                   rounded-3xl px-10 pb-10 pt-24 md:pt-28 max-w-2xl w-full text-center
                   border border-white/10 
                   transition-transform duration-500 hover:scale-105 shadow-[0_0_50px_rgba(139,92,246,0.5)]"
      >
        {/* Cartoon sitting on top */}
        <img
          src={cartoon}
          alt="Cartoon mascot"
          className="pointer-events-none select-none
                     absolute -top-36 right-1/2 
                     sm:-top-36 sm:right-32 md:-top-56 md:left-32
                     w-36 sm:w-36 md:w-56
                     drop-shadow-[0_14px_30px_rgba(0,0,0,0.45)]"
        />

        {/* subtle 'ledge' shadow to sell the sit effect */}
        <div
          className="absolute -top-2 left-1/2 -translate-x-1/2
                     w-24 h-3 bg-black/50 rounded-full blur-md"
          aria-hidden="true"
        />

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6 
                       bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500
                       bg-clip-text text-transparent">
          Start Getting Better <br /> Replies Today
        </h2>

        {/* Subtext */}
        <p className="text-gray-300/90 text-lg mb-8">
          Join <span className="font-bold text-purple-400">20,000+ Indians</span>who already unlocked better chats. 
        </p>

        {/* Button */}
        <button
          className="bg-gradient-to-r from-purple-500 to-blue-500
                     text-white font-semibold py-3 px-8 rounded-xl
                     transition-transform duration-300 hover:scale-110
                     hover:shadow-[0_0_25px_rgba(59,130,246,0.7)]"
        >
          🚀 Try Now — It's Free
        </button>

        {/* Disclaimer */}
        <p className="text-gray-400 text-sm mt-4">
          No credit card • 100% private
        </p>
      </div>
    </div>
  );
};

export default CTASection;
