import React, { useEffect, useState } from "react";
import { FaCircle } from "react-icons/fa";

const StatsBlock = () => {
  const stats = [
    { count: "963K+", label: "messages sent", emoji: "💬" },
    { count: "63K+", label: "dead chats revived", emoji: "⚡" },
    { count: "893K+", label: "conversations started", emoji: "✨" },
    { count: "783K+", label: "replies improved", emoji: "💡" },
    { count: "117K+", label: "dates unlocked", emoji: "❤️" },
  ];

  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // pehle fade-out
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % stats.length); // text change
        setFade(true); // fir fade-in
      }, 500); // 0.5s fade-out ke baad change
    }, 2500);

    return () => clearInterval(interval);
  }, [stats.length]);

  const { count, label, emoji } = stats[index];

  return (
    <div className="flex justify-center items-center space-x-2 py-4 shadow-md">
      {/* Icon static rahega */}
      <FaCircle className="text-green-500 text-xs" />

      {/* Text fade hoga */}
      <div
        className={`flex items-center gap-2 font-semibold transition-opacity duration-500 ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      >
        {count && <span className="text-lg font-bold text-white">{count}</span>}
        <span className="text-xl">{emoji}</span>
        <span className="text-sm sm:text-base text-white">{label}</span>
      </div>
    </div>
  );
};

export default StatsBlock;
