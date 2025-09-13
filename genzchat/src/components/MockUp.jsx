// src/components/MockUp.jsx
import React, { useEffect, useState, useRef } from "react";
import { MdNetworkCell, MdWifi, MdMoreVert, MdMic } from "react-icons/md";
import { BiChevronLeft, BiImage } from "react-icons/bi";
import { FiSend } from "react-icons/fi";
import pfp1 from "../assets/pfp1.webp";
import pfp2 from "../assets/pfp2.webp";
import pfp3 from "../assets/pfp3.jpg";
import pfp4 from "../assets/pfp4.jpg";
import pfp5 from "../assets/pfp5.webp";

const profilePics = [pfp1, pfp2, pfp3, pfp4, pfp5];

// ✨ 2 flirty chat threads (light, playful)
const chatThreads = [
  {
    name: "Ananya 💫",
    avatar: pfp3,
    messages: [
      { align: "right", text: "Good morning 🌞" },
      { align: "left", text: "(3 ghante baad)" },
      { align: "left", text: "Morning 🙂" },
      {
        align: "right",
        text: "Wah, tumhare “morning” ke liye toh suraj overtime kar raha hoga 😂",
      },
      { align: "left", text: "😅 Sorry thoda busy thi" },
      {
        align: "right",
        text: "Busy toh main bhi hoon… par tumhara reply ka wait karna full-time job ban gaya hai 😏",
      },
      { align: "left", text: "Hahaha pagal ho tum" },
      {
        align: "right",
        text: "Pagal toh hoon… warna 3 ghante baad bhi tumse baat karne ki excitement nahi hoti.",
      },
      { align: "left", text: "🤭 Acha acha, ab main fast reply dungi!" },
      {
        align: "right",
        text: "Good, warna mujhe “slowest texter award” ka nomination dena padta tumhe 🏆😂",
      },
      { align: "left", text: "Hahaha shut up!" },
    ],
  },
  {
    name: "AArav⚡️",
    avatar: pfp1,
    messages: [
      { align: "right", text: "Heyyy 👋" },
      { align: "left", text: "Hii 🙂" },
      { align: "right", text: "Kya kar rahi ho?" },
      { align: "left", text: "Kuch nahi, bas chill" },
      {
        align: "right",
        text: "Tumhare replies dekh ke lag raha hai ki chill ka matlab “boring mode on” hai 😂",
      },
      { align: "left", text: "😅 haha" },
      { align: "right", text: "Waise seriously, tumhara weekend kaise jaata hai usually?" },
      { align: "left", text: "Bas ghar pe, movies dekhna ya so jana" },
      { align: "right", text: "Matlab tum “Netflix + blanket” wali ho 😏" },
      { align: "left", text: "Hahaha maybe" },
      {
        align: "right",
        text: "Accha ek honest sawaal… agar tumhe choose karna ho: Netflix marathon ya ek unexpected long drive?",
      },
      { align: "left", text: "Umm… long drive sounds fun 😅" },
      {
        align: "right",
        text: "Perfect, fir tum ready ho ek proper boring-chat-rescue mission ke liye 😉",
      },
    ],
  },
];

export default function MockUp() {
  const STORAGE_KEY = "mockup:lastThreadIndex";
  const [idx, setIdx] = useState(0);
  const ran = useRef(false); // guard for React 18 StrictMode
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const windowHeight = window.innerHeight;

      // Adjust the start trigger offset for different screen sizes
      let startTriggerOffset = windowHeight * 0.7; // Default for small screens

      if (windowHeight > 800) {
        startTriggerOffset = windowHeight * 0.5; // Starts earlier on larger screens
      }
      if (windowHeight > 1000) {
        startTriggerOffset = windowHeight * 0.1; // Starts even earlier for very large screens
      }

      const scrollStart = windowHeight - startTriggerOffset;

      // Animation starts only after this threshold is passed
      const rawProgress = Math.min(1, Math.max(0, (scrollStart - sectionTop) / (sectionHeight * 0.2)));
      setScrollY(rawProgress);

      // Set visibility (optional)
      setIsVisible(sectionTop <= windowHeight && sectionTop + sectionHeight >= 1);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      const parsed = raw !== null ? parseInt(raw, 10) : NaN;
      const lastShown = Number.isInteger(parsed) ? parsed : -1;

      const toShow = (lastShown + 1) % chatThreads.length;
      setIdx(toShow);
      localStorage.setItem(STORAGE_KEY, String(toShow));
    } catch {
      setIdx(0);
    }
  }, []);

  const { name, avatar, messages } = chatThreads[idx];

  const maxTranslate = 25; // vh me jitna upar le jaana hai
  const mockupTransform = `translateY(${-scrollY * maxTranslate}vh)`;

  return (
    <>
      <section
        ref={sectionRef}
        className="relative overflow-hidden w-full text-white flex flex-col items-center justify-center mt-10 sm:mt-0 px-3 py-6 sm:px-4 sm:pt-10 overflow-x-hidden min-h-screen max-sm:max-h-[800px] max-md:max-h-[1450px]"
      >
        <style>{`.scrollbar-hide::-webkit-scrollbar{display:none}`}</style>

        {/* HERO HEADING — stacked + masked like the ref */}
        <div className="relative w-full z-0 mb-8 sm:mb-22 mt-60 sm:mt-20">
          <div className="flex flex-col items-center justify-center">
            <h1
              aria-hidden
              className="pointer-events-none select-none text-[#464646] uppercase font-extrabold text-center tracking-[-0.04em] leading-[0.86]"
            >
              <span className="block text-[11vw] sm:text-[12vw] md:text-[8vw] lg:text-[6vw]">{"                         "}</span>
              <span className="block text-[11vw] sm:text-[12vw] md:text-[8vw] lg:text-[6vw]">{"                         "}</span>
              <span className="block text-[11vw] sm:text-[12vw] md:text-[8vw] lg:text-[6vw]">TURN DRY</span>
              <span className="block text-[11vw] sm:text-[12vw] md:text-[8vw] lg:text-[6vw]">CHATS</span>
              <span className="block text-[11vw] sm:text-[12vw] md:text-[8vw] lg:text-[6vw]">INTO VIBE</span>
              <span className="block text-[11vw] sm:text-[12vw] md:text-[8vw] lg:text-[6vw]">CONVERSATIONS</span>
              <span className="block text-[11vw] sm:text-[12vw] md:text-[8vw] lg:text-[6vw]">WITH </span>
              <span className="block text-[11vw] sm:text-[12vw] md:text-[8vw] lg:text-[6vw] bg-gradient-to-tr from-purple-400 to-blue-500 bg-clip-text text-transparent">
                GENZCHAT
              </span>
            </h1>
          </div>
        </div>

        <div
          className="relative z-20 origin-center sm:scale-90 md:scale-100 max-[460px]:scale-[0.80]"
          style={{
            transform: mockupTransform,
            transition: 'transform 0.55s ease-out'
          }}
        >
          <div className="relative">
            <DecorChats />
            <div className="relative">
              <div className="relative w-[min(92vw,360px)] aspect-[9/19.5] sm:w-[min(92vw,390px)]">
                {/* Bezel */}
                <div className="absolute inset-0 my-10 mx-[2%] rounded-[48px] bg-black border border-gray-400">
                  <div className="h-full w-full rounded-[40px]" />
                </div>

                {/* Screen */}
                <div className="absolute inset-[5.5%] rounded-[36px] mt-3 mb-3 overflow-hidden bg-[radial-gradient(110%_110%_at_20%_-10%,#1e3a8a_0%,#0f172a_45%,#0b1020_100%)]">
                  <div className="pointer-events-none absolute inset-0 bg-[conic-gradient(from_220deg_at_80%_20%,rgba(59,130,246,0.12),transparent_25%,rgba(168,85,247,0.10),transparent_55%,rgba(34,197,94,0.08),transparent_85%)]" />
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_110%_at_50%_0%,rgba(255,255,255,0.08),transparent_60%)]" />

                  {/* Status bar */}
                  <div className="flex items-center justify-between px-5 pt-3 text-xs text-white/90">
                    <span className="font-semibold">9:41</span>
                    <div className="flex items-center gap-1">
                      <MdWifi size={16} className="text-white" />
                      <MdNetworkCell size={16} className="text-white" />
                    </div>
                  </div>

                  {/* Notch */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 h-7 w-20 bg-black rounded-full">
                    <div className="absolute top-1/2 left-16 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gray-800 rounded-full" />
                  </div>

                  {/* Chat Area */}
                  <div className="pt-5 pb-4 px-3 h-full overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-1">
                        <BiChevronLeft size={35} className="text-white cursor-pointer" />
                        <div className="flex items-center gap-2">
                          <img
                            src={avatar}
                            alt={`${name} profile`}
                            className="w-9 h-9 rounded-full ring-2 ring-white/20 object-cover"
                          />
                          <div>
                            <p className="text-sm font-semibold text-white leading-tight">{name}</p>
                            <p className="text-xs text-emerald-400">is online now</p>
                          </div>
                        </div>
                      </div>
                      <MdMoreVert size={20} className="text-white cursor-pointer" />
                    </div>

                    {/* Messages */}
                    <div className="h-[70%] overflow-y-hidden space-y-4 scrollbar-hide [scrollbar-width:none] [-ms-overflow-style:none] pr-1">
                      {messages.map((m, i) => (
                        <Bubble key={i} align={m.align}>
                          {m.text}
                        </Bubble>
                      ))}
                    </div>

                    {/* Composer */}
                    <div className="absolute left-[6%] right-[6%] bottom-[7%]">
                      <div className="flex items-center gap-2 px-2">
                        <button
                          className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition"
                          aria-label="Add image"
                        >
                          <BiImage className="text-white" size={20} />
                        </button>

                        <button
                          className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition"
                          aria-label="Record voice"
                        >
                          <MdMic className="text-white" size={20} />
                        </button>

                        <div className="flex-1 rounded-full bg-white/10 px-4 py-2 text-sm text-white placeholder-white/50">
                          <input
                            type="text"
                            placeholder="Message..."
                            className="w-full bg-transparent outline-none text-white placeholder-white/40"
                            aria-label="Type a message"
                          />
                        </div>

                        <button
                          className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition"
                          aria-label="Send"
                        >
                          <FiSend className="text-white" size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ---------- helpers / unchanged parts ---------- */

function Bubble({ children, align = "left", tone = "base" }) {
  const base = "max-w-[75%] w-fit px-3 py-2 rounded-2xl text-[13px] leading-snug";
  const left = tone === "alt" ? "bg-white/15 text-white ml-1" : "bg-white/10 text-white ml-1";
  const right = tone === "alt" ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white mr-1" : "bg-white text-black mr-1";
  const cls = `${base} ${align === "right" ? right : left}`;
  return (
    <div className={`flex ${align === "right" ? "justify-end" : "justify-start"}`}>
      <div className={cls}>{children}</div>
    </div>
  );
}

function DecorChats() {
  return (
    <>
      <div className="absolute left-75 top-20 sm:top-28 sm:left-90 lg:left-100">
        <MiniChat text="Check this out ! 👀" name="Riya" avatar={pfp4} />
      </div>
      <div className="absolute right-55 sm:right-80 lg:right-120 bottom-36 sm:bottom-40">
        <MiniChat text="New song drop 🌻" name="Madhav" avatar={pfp2} />
      </div>
      <div className="absolute left-70 sm:left-100 lg:left-125 bottom-6">
        <MiniChat text="Love the viiibe" name="Shweta" avatar={pfp5} />
      </div>
      <div className="absolute right-60 sm:right-80 lg:right-150 top-5 sm:top-16">
        <MiniChat text="I'm your man ✨" name="Chetan" avatar={pfp1} />
      </div>
      <div className="sm:hidden absolute left-50 sm:left-100 lg:left-90 -top-8">
        <MiniChat text="Love the viiibe" name="Himani" avatar={pfp5} />
      </div>
      <div className="absolute right-55 sm:right-75 lg:right-80 top-1/2">
        <MiniChat text="It's lit ! 🔥" name="Shalini" avatar={pfp3} />
      </div>
    </>
  );
}

function MiniChat({ text = "", name = "", dot = false, avatar }) {
  // deterministic fallback (stable across renders)
  const hash = (s) =>
    Array.from(s).reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0);

  const pool = [pfp1, pfp2, pfp3, pfp4, pfp5];

  const finalAvatar = React.useMemo(() => {
    if (avatar) return avatar;
    const i = Math.abs(hash(`${name}|${text}`)) % pool.length;
    return pool[i];
  }, [avatar, name, text]);

  return (
    <div className="flex flex-col items-center justify-center gap-2 scale-90 sm:scale-100 transition-transform duration-500">
      <div className="rounded-2xl px-5 py-4 min-w-[220px] max-w-[280px] text-xs sm:text-sm bg-white/20 shadow break-words">
        {text}
      </div>
      <div className="flex items-center gap-1 text-white/80 text-xs sm:text-sm">
        <img
          src={finalAvatar}
          alt={name}
          className="inline-block w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover"
          loading="lazy"
        />
        <span>{name}</span>
        {dot && (
          <span className="ml-1 inline-block w-4 h-4 rounded-full overflow-hidden">
            <img src={finalAvatar} alt="" className="w-full h-full object-cover" loading="lazy" />
          </span>
        )}
      </div>
    </div>
  );
}