import React, { useState, useRef, useEffect } from "react";
import { FiSend, FiImage } from "react-icons/fi";
import { BsEmojiSmile } from "react-icons/bs";
import { MdKeyboardVoice, MdAttachFile } from "react-icons/md";
import girlimg from "../assets/pfp3.jpg";

export default function HighlightCard2() {
  const [chatMessages] = useState([
    { id: 1, type: "received", text: "Hi Aarav, aaj ka plan? 😉", sender: "Sakshi" },
    { id: 2, type: "sent", text: "Plan? Tumhari smile dekhna. Coffee? ☕" },
    { id: 3, type: "received", text: "Smooth ho tum… kab? 😌", sender: "Sakshi" },
    { id: 4, type: "sent", text: "Saturday 6 PM, same cafe. Deal?" },
    { id: 5, type: "received", text: "Deal! Par late hue toh ice-cream treat tumhari 🍦", sender: "Sakshi" },
    { id: 6, type: "sent", text: "Challenge accepted 😎" },
    { id: 7, type: "received", text: "Waise black hoodie look accha tha kal 🔥", sender: "Sakshi" },
    { id: 8, type: "sent", text: "Tum bolo to daily pehen lu 😏" },
    { id: 9, type: "received", text: "Daily tum nahi, hoodie chalegi 😜", sender: "Sakshi" },
    { id: 10, type: "sent", text: "Noted. Waise tum aaj bhi pretty lag rahi ho ✨" },
    { id: 11, type: "received", text: "Flattery +10, proof Saturday ko 😏", sender: "Sakshi" },
    { id: 12, type: "sent", text: "Done. See you, future favorite human." },
  ]);

  const messagesContainerRef = useRef(null);
  const sectionRef = useRef(null);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const scrollToBottom = (behavior = "smooth") => {
    const c = messagesContainerRef.current;
    if (!c) return;
    c.scrollTo({ top: c.scrollHeight, behavior });
  };

  const scrollToMessage = (messageIndex, behavior = "smooth") => {
    const c = messagesContainerRef.current;
    if (!c) return;
    const el = c.children?.[messageIndex];
    if (!el) return;
    const top = el.offsetTop - 8;
    c.scrollTo({ top, behavior });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          setCurrentMessageIndex(0);
          requestAnimationFrame(() => scrollToBottom("auto"));
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => {
        const next = (prev + 1) % chatMessages.length;
        requestAnimationFrame(() => scrollToMessage(next));
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [isVisible, chatMessages.length]);

  useEffect(() => {
    requestAnimationFrame(() => scrollToBottom("auto"));
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12"
    >
      <style>{`.scrollbar-hide::-webkit-scrollbar{display:none}`}</style>

      {/* OUTER FEATURE CARD */}
      <div
        className="
          relative overflow-hidden rounded-[2rem]
          bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-transparent
          p-[2px]
          shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]
        "
      >
        {/* inner surface */}
        <div className="relative rounded-[2rem] bg-[#0b0f1a]/80 backdrop-blur-xl">
          {/* subtle ring */}
          <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-white/5" />
          {/* corner glows */}
          <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-pink-500/20 blur-3xl z-0" />
          <div className="pointer-events-none absolute -right-28 -bottom-28 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl z-0" />

          {/* CONTENT GRID */}
          <div className="relative grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 p-5 sm:p-8 md:p-10 isolate">
            {/* LEFT CONTENT */}
            <div className="order-1 text-white self-center relative z-10 lg:pl-4">
              <h2
                className="
                  font-extrabold leading-tight tracking-tight
                  text-2xl xs:text-3xl sm:text-4xl md:text-5xl
                "
              >
                FLIRT
                <br />
                <span className="bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
                  OPTIMIZATION
                </span>
                <br />
                PLAYBOOK
              </h2>

              <p className="mt-4 text-white/90 text-[13px] xs:text-sm sm:text-base md:text-lg max-w-xl">
                Spark better DMs with playful, confident replies. Practice timing, tone, and tease—without being cringe.
              </p>
            </div>

            {/* RIGHT CHAT */}
            <div className="order-2 bg-transparent backdrop-blur-md max-w-md rounded-2xl">
              <div className="bg-transparent backdrop-blur-[40px] rounded-2xl shadow-2xl mx-auto overflow-hidden">
                {/* Header */}
                <div className="bg-black/30 backdrop-blur-md px-4 py-3 flex items-center gap-3">
                  <button className="p-1">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div className="w-8 h-8 rounded-full bg-gray-600 overflow-hidden shrink-0">
                    <img src={girlimg} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium text-sm">Sakshi</h3>
                    <p className="text-gray-400 text-xs">online</p>
                  </div>
                </div>

                {/* Messages */}
                <div
                  ref={messagesContainerRef}
                  className="
                    bg-transparent backdrop-blur-[10px]
                    px-4 py-4 max-h-[230px] sm:h-[40vh] md:h-[44vh] lg:h-[46vh]
                     overflow-y-hidden md:overflow-y-auto overscroll-contain space-y-3
                    scrollbar-hide [scrollbar-width:none] [-ms-overflow-style:none]
                  "
                >
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === "sent" ? "justify-end" : "justify-start"}`}
                    >
                      <div className="flex flex-col gap-1 max-w-[75%]">
                        {message.type === "received" && message.sender && (
                          <span className="text-xs text-gray-400 ml-1">{message.sender}</span>
                        )}
                        <div
                          className={`rounded-2xl px-3 py-2 ${message.type === "sent"
                            ? "bg-white/20 backdrop-blur-md"
                            : "bg-gray-700/90 backdrop-blur-md"
                            }`}
                        >
                          <p className="text-white text-sm">{message.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div className="px-4 py-3">
                  <div className="flex items-center gap-2 bg-black/20 rounded-2xl px-3 py-2">
                    <button className="p-1 hover:bg-zinc-600 rounded-full transition-colors">
                      <MdAttachFile className="w-5 h-5 text-gray-400" />
                    </button>
                    <div className="flex-1 bg-transparent">
                      <input
                        type="text"
                        placeholder="Type a playful reply…"
                        readOnly
                        onFocus={(e) => e.target.blur()}   // 🚫 keyboard disable
                        className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm cursor-not-allowed"
                      />

                    </div>
                    <button className="relative p-[1px] rounded-full bg-gradient-to-r from-fuchsia-500 to-blue-500 hover:brightness-110">
                      <div className="flex items-center justify-center bg-black rounded-full w-8 h-8">
                        <FiSend className="w-4 h-4 text-white" />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* /Right Chat */}
          </div>
        </div>
      </div>
    </section>
  );
}
