import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { MdAttachFile } from "react-icons/md";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import MorePage from "./MorePage";
import Razorpay from "../trail/razorpay";

import {
  FiSend,
  FiZap,
  FiX,
  FiUser,
  FiPlusCircle,
  FiGlobe,
  FiChevronRight,
  FiMessageSquare,
  FiHelpCircle,
  FiCopy,
  FiTrash2,
} from "react-icons/fi";

export default function ChatPAge() {
  const {
    user,
    credits,
    chats,
    sidebarOpen,
    toggleSidebar,
    closeSidebar,
    sendMessage,
    loading, // <--- यह स्टेट "AI is typing..." इंडिकेटर को कंट्रोल करता है
    error,
    sending,
    resetConnectionState,
    clearError,
    clearChats,
  } = useContext(ChatContext) || {};

  const { logout, username } = useContext(AuthContext);

  const [view, setView] = useState("chat");
  const messagesEndRef = useRef(null);
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const imageInputRef = useRef(null);
  const [copiedIndex, setCopiedIndex] = useState(-1);
  const textareaRef = useRef(null);

  const openRazorpay = () => setView("razorpay");

  useEffect(() => {
    if (credits !== null && credits <= 0) {
      const timer = setTimeout(() => { setView("razorpay"); }, 1500);
      return () => clearTimeout(timer);
    }
  }, [credits]);

  const openImagePicker = () => imageInputRef.current?.click();
  const clearImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview("");
    setImageFile(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };
  const onImageSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    clearImage();
    const url = URL.createObjectURL(file);
    setImageFile(file);
    setImagePreview(url);
  };

  const safeChats = useMemo(() => (Array.isArray(chats) ? chats : []), [chats]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [safeChats, loading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  useEffect(() => {
    const handlePaste = (event) => {
      const items = event.clipboardData?.files;
      if (items && items.length > 0) {
        const imageFile = Array.from(items).find(file => file.type.startsWith("image/"));
        if (imageFile) {
          onImageSelected({ target: { files: [imageFile] } });
        }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  const handleSendMessage = async () => {
    if (sending || (!message.trim() && !imageFile)) return;
    if (credits <= 0) { setView("razorpay"); return; }
    try {
      await sendMessage?.({ text: message.trim(), image: imageFile });
      setMessage("");
      clearImage();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(-1), 2000);
  };

  const handleClearChats = () => {
    if (window.confirm("Are you sure you want to clear the entire conversation? This cannot be undone.")) {
      clearChats();
    }
  };

  if (view === "razorpay") { return <Razorpay onBack={() => setView("chat")} />; }
  if (view === "more") { return <MorePage onBack={() => setView("chat")} onLogout={logout} username={username || user?.name || "Guest"} signupDate={user?.signupDate || "N/A"} />; }

  return (
    <div className="flex h-[100dvh] bg-black text-white relative overflow-hidden">
      {/* Sidebar (No changes here) */}
      <div
        className={`fixed inset-y-0 right-0 w-80 transform transition-transform duration-300 z-40 bg-black border-l border-zinc-700/80 text-zinc-300 ${sidebarOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="h-full flex flex-col p-4 space-y-6">
          <div className="flex items-center gap-4 px-2">
            <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center ring-1 ring-zinc-600">
              <FiUser className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-white text-lg">{user?.name || "Guest"}</p>
              <p className="text-xs text-zinc-400">UID: {user?.id || "3172701"}</p>
            </div>
          </div>
          <div className="relative p-[1px] rounded-2xl bg-gradient-to-br from-teal-400/50 via-transparent to-transparent">
             <div className="rounded-2xl bg-zinc-800/60 backdrop-blur-sm p-4">
              <div className="flex justify-between items-center text-xs font-medium">
                <span className="tracking-widest text-teal-300">STANDARD PLAN</span>
                <span className="text-zinc-400">28 DAYS LEFT</span>
              </div>
              <div className="mt-4 flex justify-around items-center text-center">
                <div>
                  <p className="text-3xl font-bold text-white">{credits}</p>
                  <p className="text-xs text-zinc-400 mt-1">Subscription credits</p>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-3xl font-bold text-white">0</p>
                    <FiPlusCircle className="w-5 h-5 text-zinc-500 hover:text-white transition-colors cursor-pointer" />
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">Paid credits</p>
                </div>
              </div>
              <button onClick={openRazorpay} type="button" className="relative mt-5 w-full overflow-hidden rounded-full p-[2px] btn-aurora transition-transform duration-300 hover:scale-105">
                <span className="relative z-[1] flex w-full items-center justify-center rounded-full bg-black/80 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-black/60">
                  Upgrade Plan
                </span>
              </button>
            </div>
          </div>
          <div className="flex flex-col space-y-2 px-2 text-sm font-medium">
            <button onClick={() => setView("more")} className="w-full flex items-center gap-4 px-3 py-2.5 rounded-lg hover:bg-zinc-700/50 transition-colors">
              <FiUser className="w-5 h-5 text-zinc-400" /> <span>My Profile</span>
            </button>
            <button onClick={handleClearChats} className="w-full flex items-center gap-4 px-3 py-2.5 rounded-lg hover:bg-zinc-700/50 transition-colors text-red-400">
              <FiTrash2 className="w-5 h-5" /> <span>Clear Conversation</span>
            </button>
            <button className="w-full flex items-center gap-4 px-3 py-2.5 rounded-lg hover:bg-zinc-700/50 transition-colors">
              <FiMessageSquare className="w-5 h-5 text-zinc-400" /> <span>Contact support</span>
            </button>
            <button className="w-full flex items-center gap-4 px-3 py-2.5 rounded-lg hover:bg-zinc-700/50 transition-colors">
              <FiHelpCircle className="w-5 h-5 text-zinc-400" /> <span>FAQ</span>
            </button>
          </div>
          <div className="mt-auto text-center px-4 pb-2">
            <p className="text-xs text-zinc-500">
              By using GenZChat, you agree to the <a href="#" className="underline hover:text-zinc-400">Terms of Service</a> and <a href="#" className="underline hover:text-zinc-400">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>

      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-30" onClick={closeSidebar} />}

      <div className="flex flex-col flex-1 overflow-x-hidden">
        {/* Topbar (No changes here) */}
        <div className="fixed top-0 inset-x-0 z-20 h-15 lg:h-20 flex items-center justify-between px-4 sm:px-8 bg-zinc-950/95 shadow-[0_0_20px_rgba(139,92,246,0.5)] backdrop-blur">
          <span className="text-lg sm:text-2xl md:text-4xl font-bold tracking-tight bg-gradient-to-tr from-purple-400 to-blue-500 bg-clip-text text-transparent">GenZChat</span>
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={openRazorpay} type="button" className="btn-aurora relative w-full overflow-hidden rounded-2xl p-[2px]">
              <span className="relative z-[1] block w-full rounded-2xl px-4 py-2 text-sm font-medium text-white bg-black/80 hover:brightness-110">Upgrade</span>
            </button>
            <span className="inline-flex relative items-center justify-center w-8 h-8 transition-transform duration-300 hover:scale-110" title={`Credits: ${credits}`}>
              <FiZap className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 text-[10px] px-1 rounded-full bg-blue-600">{credits}</span>
            </span>
            <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-zinc-800 ring-1 ring-zinc-700/60 transition-transform duration-300 hover:scale-115" title="Profile">
              <FiUser className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="messages-container flex-1 overflow-y-auto pt-24 pb-[150px] px-6 sm:px-8">
          <div className="max-w-5xl mx-auto space-y-4 px-2 flex flex-col w-full">
            {/* Existing chats mapping */}
            {safeChats.map((chat, idx) => (
              <div key={idx} className={`flex message-bubble group ${chat.sender === "user" ? "justify-end" : "justify-start"} mb-4`}>
                <div className={`flex items-end gap-3 max-w-[85%] ${chat.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${chat.sender === 'user' ? "bg-gradient-to-br from-purple-500 to-blue-500" : "bg-gradient-to-br from-gray-600 to-gray-700"}`}>
                    {chat.sender === "user" ? <FiUser className="w-4 h-4 text-white" /> : <span className="text-xs font-bold text-white">AI</span>}
                  </div>
                  <div className={`relative ${chat.sender === 'user' ? "bg-gray-800/60" : "bg-zinc-900"} rounded-2xl px-4 py-3 shadow-lg`}>
                    {chat.text && <p className="whitespace-pre-wrap text-sm leading-relaxed">{chat.text}</p>}
                    {chat.imageUrl && <div className="mt-3"><img src={chat.imageUrl} alt="attachment" className="rounded-xl max-w-full h-auto shadow-md"/></div>}
                  </div>
                  <div className="self-center flex-shrink-0">
                      <button onClick={() => handleCopy(chat.text, idx)} className="p-1 rounded-full text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-zinc-700 hover:text-zinc-300" title="Copy text">
                         {copiedIndex === idx ? <FiCheck className="w-4 h-4 text-green-400"/> : <FiCopy className="w-4 h-4"/>}
                      </button>
                  </div>
                </div>
              </div>
            ))}

            {/* ---▼▼▼ AI TYPING INDICATOR ▼▼▼--- */}
            {/* यह ब्लॉक तब दिखाई देगा जब `loading` स्टेट true होगा */}
            {loading && (
              <div className="flex justify-start mb-4 message-bubble">
                <div className="flex items-start gap-3 max-w-[85%]">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">AI</span>
                  </div>
                  <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl px-4 py-3 shadow-lg">
                    <div className="flex items-center gap-2 text-gray-400">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full typing-dot" />
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full typing-dot" />
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full typing-dot" />
                      </div>
                      <span className="text-xs">AI is typing...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* ---▲▲▲ END OF AI TYPING INDICATOR ▲▲▲--- */}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area (No changes here) */}
        <div className="fixed inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black via-black/95 to-transparent pb-safe pt-6">
          <div className="max-w-4xl mx-auto px-4">
             {error && <p className="text-center text-red-400 text-xs mb-2">{error}</p>}
            <div className="relative">
              {imagePreview && <div className="absolute bottom-[calc(100%+10px)] left-4 bg-gray-800 p-1 rounded-lg">
                  <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded"/>
                  <button onClick={clearImage} disabled={sending} className="absolute -top-2 -right-2 bg-gray-700 text-white rounded-full p-1"><FiX/></button>
              </div>}
              <div className="relative flex items-end gap-3 rounded-2xl border border-gray-700/50 bg-gray-900/90 backdrop-blur-xl px-4 py-3 shadow-lg mb-8">
                <button type="button" onClick={openImagePicker} disabled={sending} className="self-center p-2 rounded-lg hover:bg-gray-700/50 text-gray-400 " title="Attach image">
                  <MdAttachFile className="w-5 h-5 rotate-25" />
                </button>
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if(error) clearError();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={credits > 0 ? "Message GenZChat..." : "No credits left!"}
                  disabled={credits <= 0 || sending}
                  className="flex-1 bg-transparent text-white placeholder-gray-400 self-center focus:outline-none resize-none max-h-40 overflow-y-auto"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                />
                <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={onImageSelected} disabled={sending}/>
                <button onClick={handleSendMessage} disabled={credits <= 0 || sending || (!message.trim() && !imageFile)} title="Send message" className="relative p-[1.5px] rounded-full bg-gradient-to-r from-fuchsia-500 to-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-600">
                  <div className="flex items-center justify-center bg-black rounded-full w-10 h-10">
                    {sending ? <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" /> : <FiSend className="w-4 h-4 text-white" />}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`.typing-dot{animation:typing 1.4s infinite}.typing-dot:nth-child(2){animation-delay:.2s}.typing-dot:nth-child(3){animation-delay:.4s}@keyframes typing{0%,80%,100%{transform:scale(0)}40%{transform:scale(1)}}`}</style>
    </div>
  );
}