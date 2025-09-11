import React, { useState, useRef, useEffect } from "react";
import { FiSend } from "react-icons/fi";
import { MdAttachFile } from "react-icons/md";
import girlimg from "../assets/pfp3.jpg";

export default function HighlightCard() {
  const [chatMessages] = useState([
    { id: 1, type: "received", text: "Hey everyone! 👋", sender: "AI" },
    { id: 2, type: "sent", text: "How's everyone doing?" },
    { id: 3, type: "received", text: "Great! Just working on some new features 🚀", sender: "AI" },
    { id: 4, type: "received", text: "Anyone up for a video call later?", sender: "AI" },
    { id: 5, type: "sent", text: "Sure! What time works for everyone?" },
    { id: 6, type: "received", text: "How about 3 PM?", sender: "AI" },
    { id: 7, type: "received", text: "Perfect! See you then 😊", sender: "AI" },
    { id: 8, type: "sent", text: "Sounds good! I'll send the meeting link" },
    { id: 9, type: "received", text: "Thanks! Looking forward to it", sender: "AI" },
    { id: 10, type: "received", text: "Should we prepare anything specific?", sender: "AI" },
    { id: 11, type: "sent", text: "Just bring your ideas for the new project!" },
    { id: 12, type: "received", text: "Got it! This is going to be exciting 🎉", sender: "AI" },
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
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!isVisible) return;
    const t = setInterval(() => {
      setCurrentMessageIndex((p) => {
        const n = (p + 1) % chatMessages.length;
        requestAnimationFrame(() => scrollToMessage(n));
        return n;
      });
    }, 3000);
    return () => clearInterval(t);
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
          bg-gradient-to-br from-[#6aa5ff1a] via-[#b574ff14] to-transparent
          p-[2px]
          shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]
        "
      >
        {/* inner surface */}
        <div className="relative rounded-[2rem] bg-[#0b0f1a]/80 backdrop-blur-xl">
          {/* subtle ring */}
          <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-white/5" />
          {/* corner glows */}
          <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl z-0" />
          <div className="pointer-events-none absolute -right-28 -bottom-28 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl z-0" />

          {/* CONTENT GRID */}
          <div className="relative grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 p-5 sm:p-8 md:p-10 isolate">
            {/* MEDIA / CHAT */}
            <div className="order-2 lg:order-1">
              <div
                className="
                  rounded-[2rem] overflow-hidden
                  bg-gradient-to-b from-[#1a1f2e] to-[#0f1220]
                  ring-1 ring-white/5
                  shadow-[inset_0_0_40px_rgba(0,0,0,0.35)]
                "
              >
                {/* Header */}
                <div className="bg-black/30 backdrop-blur-md px-4 py-3 flex items-center gap-3 z-10 relative">
                  <button className="p-1 hover:opacity-80">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <img src={girlimg} alt="pfp" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-sm">Sakshi</h3>
                    <p className="text-gray-400 text-xs">online</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex flex-col">
                  <div
                    ref={messagesContainerRef}
                    className="
                      px-4 pt-3 pb-2 space-y-3 
                      overflow-y-hidden md:overflow-y-auto overscroll-none scrollbar-hide
                      max-h-[200px] sm:h-[40vh] md:h-[44vh] lg:h-[46vh]
                    "
                  >
                    {chatMessages.map((m) => (
                      <div key={m.id} className={`flex ${m.type === "sent" ? "justify-end" : "justify-start"}`}>
                        <div className="flex flex-col gap-1 max-w-[80%]">
                          {m.type === "received" && m.sender && (
                            <span className="text-[10px] sm:text-xs text-gray-400 ml-1">{m.sender}</span>
                          )}
                          <div
                            className={`rounded-2xl px-3 py-2 text-white text-[12px] sm:text-sm leading-snug ${m.type === "sent" ? "bg-white/15" : "bg-black/40"
                              }`}
                          >
                            {m.text}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input bar */}
                  <div className="px-4 py-3 bg-transparent border-t border-white/5 z-10 relative">
                    <div className="flex items-center gap-2 bg-black/30 rounded-2xl px-3 py-2">
                      <button className="p-1 rounded-full hover:bg-white/10">
                        <MdAttachFile className="w-5 h-5 text-gray-300" />
                      </button>
                      <input
                        type="text"
                        placeholder="Type a playful reply…"
                        readOnly
                        onFocus={(e) => e.target.blur()}   // 🚫 keyboard disable
                        className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm cursor-not-allowed"
                      />
                      <button className="relative p-[1px] rounded-full bg-gradient-to-r from-fuchsia-500 to-blue-500 hover:brightness-110">
                        <div className="flex items-center justify-center bg-black rounded-full w-8 h-8">
                          <FiSend className="w-4 h-4 text-white" />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* TEXT / COPY */}
            <div className="order-1 lg:order-2 text-white self-center relative z-10 lg:pl-4">
              <h2
                className="
                  font-extrabold leading-tight tracking-tight
                  text-2xl xs:text-3xl sm:text-3xl md:text-5xl
                "
              >
                SMART RESPONSE
                <br className="" />
                <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  GENRATION
                </span>
              </h2>

              <p className="mt-4 text-white/90 text-[13px] xs:text-sm sm:text-base md:text-lg max-w-xl">
                Use custom emoji, stickers, soundboard effects and more to add your personality to your voice, video, or
                text chat.
                <br /> Set your avatar and a custom status, and write your own profile to show up in chat your way.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
