import React, { useEffect, useMemo, useState } from "react";
import { MdNetworkCell, MdWifi, MdMoreVert, MdMic } from "react-icons/md";
import { BiChevronLeft, BiImage } from "react-icons/bi";
import { FiSend } from "react-icons/fi";
import pfp1 from '../assets/pfp1.jpg';
import pfp2 from '../assets/pfp2.avif';
import pfp3 from '../assets/pfp3.jpg';
import pfp4 from '../assets/pfp4.jpg';
import pfp5 from '../assets/pfp5.webp';

const profilePics = [pfp1, pfp2, pfp3, pfp4, pfp5];

// ✨ 2 flirty chat threads (light, playful)
const chatThreads = [
  {
    name: "Blake 💫",
    avatar: pfp3,
    messages: [
      { align: "left",  text: "hey you 👀 guess who just matched with a 10/10" },
      { align: "right", text: "hmm… lucky you 😌 got a name?" },
      { align: "left",  text: "maybe… but i answer only to coffee dates ☕️" },
      { align: "right", text: "deal. i’ll bring coffee if you bring that smile 😏" },
      { align: "left",  text: "bold. i like it. friday 7?" },
      { align: "right", text: "it’s a date ✨" },
    ],
  },
  {
    name: "Aarav ⚡️",
    avatar: pfp1,
    messages: [
      { align: "left",  text: "be honest—are you this cute offline too? 😇" },
      { align: "right", text: "only when i’m texting you 😉" },
      { align: "left",  text: "smooth. teach me your ways, sensei 😌" },
      { align: "right", text: "lesson 1: compliments → dessert 🍨" },
      { align: "left",  text: "uh-oh… now i want both 😅" },
      { align: "right", text: "perfect, i’m pretty good company & i share dessert ✨" },
    ],
  },
];

export default function MockUp() {
  const [idx, setIdx] = useState(0);

  // auto-switch chat every 5s
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % chatThreads.length), 5000);
    return () => clearInterval(id);
  }, []);

  const { name, avatar, messages } = chatThreads[idx];

  return (
    <>
      <section className="relative w-full text-white flex flex-col items-center justify-center px-3 mt-15 sm:mt-10 lg:mt-20 sm:px-4 sm:py-15 overflow-x-hidden">
        {/* KEYFRAMES */}
        <style>{`
          @keyframes slideUp { 0%{opacity:0; transform:translateY(12px)} 100%{opacity:1; transform:translateY(0)} }
          .scrollbar-hide::-webkit-scrollbar{display:none}
          .fade-swap-enter{opacity:0; transform:translateY(6px)}
          .fade-swap-enter-active{opacity:1; transform:translateY(0); transition:opacity .3s ease, transform .3s ease}
        `}</style>

        <div className="relative w-full z-0">
  <h1
    aria-hidden
    className="
      pointer-events-none select-none mx-auto text-center font-extrabold
      tracking-tight
      /* tighter line-height for compact look */
      leading-[1.02] sm:leading-[0.98] md:leading-[0.94]
      /* subtle gray tone like before */
      text-gray-600/80
      /* responsive size for the overall container (affects default children) */
      text-[10vw] sm:text-[8.6vw] md:text-[6.6vw] lg:text-[4.6vw]
      /* pull phone up on small screens (chipka) */
      -mb-10 sm:-mb-12 md:-mb-16 lg:-mb-18
      animate-[slideUp_.7s_ease-out_forwards]
      relative
    "
  >
    {/* line 1 */}
    <span className="block ">
      Make her fall in love with
    </span>

    {/* line 2 – “your AI Buddy” (slightly smaller on tiny screens, then scales up) */}
    <span className="block
      text-[8.6vw] sm:text-[7.8vw] md:text-[6.2vw] lg:text-[4.2vw]
      mt-1
    ">
      Your AI Buddy
    </span>

    {/* brand line – “Genzchat” (bigger & bold, same color vibe you had) */}
    <span className="
      block
      text-[14vw] sm:text-[12.5vw] md:text-[10vw] lg:text-[7.5vw]
      mt-2 lg:pb-12
    ">
      Genzchat
    </span>
  </h1>
</div>


        {/* CONTENT SCALE WRAPPER */}
        <div className="relative z-10 origin-center sm:scale-90 md:scale-100 transition-transform duration-500 ease-out max-[460px]:scale-[0.70]">
        {/* <div className="relative z-10 origin- sm:scale-90 md:scale-100 transition-transform duration-500 ease-out max-[460px]:scale-[0.70]"> */}
          {/* PHONE + DECOR */}
          <div className="relative">
            <DecorChats />

            {/* PHONE WRAPPER */}
            <div className="relative">
              <div className="relative w-[min(92vw,360px)] aspect-[9/19.5] sm:w-[min(92vw,390px)]">
                {/* Bezel */}
                <div className="absolute inset-0 my-10 mx-[2%] rounded-[48px] bg-black border border-gray-400">
                  <div className="h-full w-full rounded-[40px]" />
                </div>

                {/* Screen (Midnight Neon) */}
                <div className="absolute inset-[5.5%] rounded-[36px] mt-3 mb-3 overflow-hidden bg-[radial-gradient(110%_110%_at_20%_-10%,#1e3a8a_0%,#0f172a_45%,#0b1020_100%)]">
                  {/* overlays */}
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
                          <img src={avatar} alt={`${name} profile`} className="w-9 h-9 rounded-full ring-2 ring-white/20 object-cover" />
                          <div>
                            <p className="text-sm font-semibold text-white leading-tight">{name}</p>
                            <p className="text-xs text-emerald-400">is online now</p>
                          </div>
                        </div>
                      </div>
                      <MdMoreVert size={20} className="text-white cursor-pointer" />
                    </div>

                    {/* Messages (single thread visible; swaps every 5s) */}
                    <div key={idx} className="h-[70%] overflow-y-auto space-y-4 scrollbar-hide [scrollbar-width:none] [-ms-overflow-style:none] pr-1 fade-swap-enter fade-swap-enter-active">
                      {messages.map((m, i) => (
                        <Bubble key={i} align={m.align}>{m.text}</Bubble>
                      ))}
                    </div>

                    {/* Composer */}
                    <div className="absolute left-[6%] right-[6%] bottom-[7%]">
                      <div className="flex items-center gap-2 px-2">
                        <button className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition" aria-label="Add image">
                          <BiImage className="text-white" size={20} />
                        </button>

                        <button className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition" aria-label="Record voice">
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

                        <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition" aria-label="Send">
                          <FiSend className="text-white" size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Side buttons */}
                <div className="absolute right-1 top-[24%] w-[1%] h-[5%] border border-gray-400 rounded-r" />
                <div className="absolute left-1 top-[20%] w-[1%] h-[15%] border border-gray-400 rounded-l" />
                <div className="absolute left-1 top-[38%] w-[1%] h-[7%] border border-gray-400 rounded-l" />
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
        <MiniChat text="Check this out ! 👀" name="Emilie" />
      </div>
      <div className="absolute right-55 sm:right-80 lg:right-120 bottom-36 sm:bottom-40">
        <MiniChat text="New song drop 🌻" name="Miles" />
      </div>
      <div className="absolute left-70 sm:left-100 lg:left-125 bottom-6">
        <MiniChat text="Love the viiibe" name="Emma" />
      </div>
      <div className="absolute right-60 sm:right-80 lg:right-150 top-5 sm:top-16">
        <MiniChat text="I'm your man ✨" name="Luke" />
      </div>
      <div className="sm:hidden absolute left-50 sm:left-100 lg:left-90 -top-8">
        <MiniChat text="Love the viiibe" name="Emma" />
      </div>
      <div className="absolute right-55 sm:right-75 lg:right-80 top-1/2">
        <MiniChat text="It's lit ! 🔥" name="Alina" />
      </div>
    </>
  );
}

function MiniChat({ text, name, dot }) {
  const randomImg = profilePics[Math.floor(Math.random() * profilePics.length)];
  return (
    <div className="flex flex-col items-center justify-center gap-2 scale-90 sm:scale-100 transition-transform duration-500">
      <div className="rounded-2xl px-5 py-4 min-w-[220px] max-w-[280px] text-xs sm:text-sm bg-white/20  shadow animate-[slideUp_.6s_ease-out_forwards] break-words">
        {text}
      </div>
      <div className="flex items-center gap-1 text-white/80 text-xs sm:text-sm">
        <img src={randomImg} alt={name} className="inline-block w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover" />
        <span>{name}</span>
        {dot && (
          <span className="ml-1 inline-block w-4 h-4 rounded-full overflow-hidden">
            <img src={randomImg} alt="" className="w-full h-full object-cover" />
          </span>
        )}
      </div>
    </div>
  );
}
