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

  // only chat container scrolls
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
    <section ref={sectionRef} className="relative w-full max-w-6xl mx-auto px-6 py-16 ">
      <style>{`.scrollbar-hide::-webkit-scrollbar{display:none}`}</style>

      {/* Card */}
      <div className="relative rounded-3xl bg-gradient-to-br from-pink-500/10 to-purple-500/10 backdrop-blur-[20px] p-8 lg:p-12 ">
        <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left - Content (stays left on lg) */}
          <div className="order-1">
            <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight mb-6">
              FLIRT<br />
              <span className="bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
                OPTIMIZATION
              </span>
              <br />
              PLAYBOOK
            </h2>
            <p className="text-lg lg:text-xl text-white/90 leading-relaxed max-w-lg">
              Spark better DMs with playful, confident replies. Practice timing, tone, and tease—without being cringe.
            </p>
          </div>

          {/* Right - Chat (on lg, chat goes right) */}
          <div className="order-2 lg:order-2 bg-transparent backdrop-blur-md max-w-md rounded-2xl">
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

              {/* Messages (only this scrolls) */}
              <div
                ref={messagesContainerRef}
                className="bg-transparent backdrop-blur-[10px] px-4 py-4 h-64 overflow-y-auto overscroll-contain space-y-3 scrollbar-hide [scrollbar-width:none] [-ms-overflow-style:none]"
              >
                {chatMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === "sent" ? "justify-end" : "justify-start"}`}>
                    <div className="flex flex-col gap-1 max-w-[75%]">
                      {message.type === "received" && message.sender && (
                        <span className="text-xs text-gray-400 ml-1">{message.sender}</span>
                      )}
                      <div
                        className={`rounded-2xl px-3 py-2 ${
                          message.type === "sent" ? "bg-white/20 backdrop-blur-md" : "bg-gray-700/90 backdrop-blur-md"
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
                    <BsEmojiSmile className="w-5 h-5 text-gray-400" />
                  </button>
                  <div className="flex-1 bg-transparent">
                    <input
                      type="text"
                      placeholder="Type a playful reply…"
                      className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm"
                    />
                  </div>
                  <button className="p-1 hover:bg-zinc-600 rounded-full transition-colors">
                    <MdAttachFile className="w-5 h-5 text-gray-400" />
                  </button>
                  <button className="p-1 hover:bg-zinc-600 rounded-full transition-colors">
                    <FiImage className="w-5 h-5 text-gray-400" />
                  </button>
                  <button className="p-1 hover:bg-zinc-600 rounded-full transition-colors">
                    <MdKeyboardVoice className="w-5 h-5 text-gray-400" />
                  </button>
                  <button className="bg-gradient-to-r from-pink-500 to-purple-500 p-2 rounded-full hover:brightness-110 transition-all">
                    <FiSend className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* /Right Chat */}
        </div>
      </div>
    </section>
  );
}