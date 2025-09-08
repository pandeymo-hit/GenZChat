// src/pages/ChatPAge.jsx
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import MorePage from "./MorePage";
import Razorpay from "../trail/Razorpay"; // <-- default export from src/trail/razorpay.jsx


import {
  FiLogOut,
  FiUser,
  FiSend,
  FiEdit2,
  FiZap,
  FiImage,
  FiX,
  FiHelpCircle, FiFileText,
} from "react-icons/fi";

export default function ChatPAge() {
  const {
    user,
    isChated,
    credits,
    chats,
    sidebarOpen,
    toggleSidebar,
    closeSidebar,
    sendMessage, // accepts string or { text, image }
    loading,
    error,
    sending,     // 🔒 lock (NEW)
  } = useContext(ChatContext) || {};

  const { closeForm } = useContext(AuthContext);

  const [view, setView] = useState("chat"); // "chat" | "more" | razorpay
  
  // razorpay offer open k liye

  const openRazorpay = () => setView("razorpay");


  const [message, setMessage] = useState("");
  const [showEditBlocked, setShowEditBlocked] = useState(false);

  // image attach
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(""); // object URL for chip
  const imageInputRef = useRef(null);

  const openImagePicker = () => imageInputRef.current?.click();
  const clearImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview("");
    setImageFile(null);
  };
  const onImageSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    clearImage();
    const url = URL.createObjectURL(file);
    setImageFile(file);
    setImagePreview(url);
  };

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleEditClick = () => {
    setShowEditBlocked(true);
    setTimeout(() => setShowEditBlocked(false), 2500);
  };

  const safeChats = useMemo(() => (Array.isArray(chats) ? chats : []), [chats]);

  // const handleSend = async () => {
  //   if (sending) return; // respect lock
  //   const hasText = Boolean(message.trim());
  //   const hasImage = Boolean(imageFile);
  //   // if (!hasText && !hasImage) return;
  //   // try {
  //   //   await sendMessage?.({ text: message.trim() });
  //   // } catch {
  //   //   await sendMessage?.(message.trim());
  //   // }
  //   setMessage("");
  //   clearImage();
  // };

if (view === "razorpay") {
  return <Razorpay onBack={() => setView("chat")} />; // show full-screen Razorpay page
}
if (view === "more") {
  return <MorePage onBack={() => setView("chat")} />;
}


  return (
    <div className="flex h-[100dvh] bg-black text-white relative overflow-hidden">
      {/* Right Sidebar - Glassmorphism */}
      <div
        className={`fixed inset-y-0 right-0 w-64
          transform transition-transform duration-300 z-40
          rounded-l-2xl border-l border-white/10
          bg-zinc-900/40 backdrop-blur-xl supports-[backdrop-filter]:bg-zinc-900/30
          shadow-[0_10px_50px_rgba(0,0,0,0.6)]
          ${sidebarOpen ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-modal="true"
      >
        {/* Sidebar content */}
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* 1) Profile card (glass) */}
          <div className="relative z-20 rounded-2xl border border-purple-900 bg-transparent backdrop-blur-3xl p-4 sm:shadow-none hover:shadow-[0_0_20px_rgba(139,92,246,0.5)]">
            {/* Edit (top-right) */}
            <button
              onClick={handleEditClick}
              className="absolute top-3 right-3 p-1 rounded-lg hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-600"
              aria-label="Edit profile"
              title="Edit profile"
            >
              <FiEdit2 className="w-4 h-4 text-gray-300" />
            </button>

            {/* Avatar + Name + Date */}
            <div className="flex  items-center text-center gap-3">
              <div className="w-14 h-14 rounded-full bg-zinc-800 flex items-center justify-center ring-1 ring-white/10">
                <FiUser className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="font-semibold">{user?.name || "Guest"}</p>
                <p className="text-xs text-gray-400">SignUp: {user?.signupDate || "N/A"}</p>
              </div>
            </div>

            {/* Bubble: can't change before 15 days */}
            {showEditBlocked && (
              <div className="absolute -bottom-3 right-3 translate-y-full text-xs bg-black text-gray-200 border border-zinc-700 rounded-md px-3 py-2 shadow-xl">
                <span className="mr-1">🔒</span>
                Can’t change username before 15 days.
              </div>
            )}
          </div>

          {/* 2) Active Plan card (glass) */}
          {/* 2) Active Plan — colorful like the screenshot */}
          <div className="relative">
            {/* gradient border + outer glow */}
            <div className="rounded-2xl p-[1.5px] bg-gradient-to-r from-cyan-400/20 via-violet-500/10 to-cyan-400/20 shadow-[0_8px_40px_rgba(37,99,235,0.35)]">
              {/* inner glass panel */}
              <div className="rounded-2xl bg-black/50 backdrop-blur-xl px-4 py-3">
                {/* top row: label */}
                <p className="text-[11px]">
                  <span className="font-semibold  tracking-wide text-blue-200">Active Plan</span>
                  <span className="mx-1 text-gray-500">:</span>
                  <span className="text-gray-400 font-medium bg-gray-600/30 px-2 py-[5px] rounded-2xl">none</span>
                </p>


                {/* credits line (FiZap + number from backend) + “None” */}
                <div className="mt-3 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 ring-1 ring-blue-400/40">
                    <FiZap className="w-3.5 h-3.5 text-blue-300" />
                  </span>
                  <span className="text-gray-200 font-medium">{credits}</span>
                  <span className="text-gray-400 text-xs">free Chats</span>
                </div>

                {/* tiny progress pill (purely visual) */}
                <div className="mt-3 h-3 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-1/4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500" />
                </div>

                {/* Upgrade button */}
                <button
                 onClick={openRazorpay}
                  type="button"
                  className="mt-4 w-full rounded-2xl py-2 text-sm font-medium 
                   bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110"
                >
                  Upgrade
                </button>
              </div>
            </div>
          </div>


          {/* 3) Links card (glass) */}
          <div className="rounded-2xl text-gray-400 border border-white/10 bg-white/5 backdrop-blur-xl sm:shadow-none hover:shadow-[0_0_20px_rgba(139,92,246,0.5)]">
            <button className="w-full flex items-center justify-between px-4 py-2 hover:bg-white/5" type="button">
              <span className="inline-flex items-center gap-2">
                <FiHelpCircle className="w-4 h-4 text-white" />
                <span>FAQ</span>
              </span>
            </button>

            <button className="w-full flex items-center justify-between px-4 py-2 hover:bg-white/5" type="button">
              <span className="inline-flex items-center gap-2">
                <FiFileText className="w-4 h-4 text-white" />
                <span>Terms &amp; Conditions</span>
              </span>
            </button>

            <button
              className="w-full flex items-center justify-between px-4 py-2 hover:bg-white/5"
              type="button"
              onClick={() => setView("more")}
              title="Open profile"
              aria-label="Open profile"
            >
              <span className="inline-flex items-center gap-2">
                <FiUser className="w-4 h-4 text-white" />
                <span>My Profile</span>
              </span>
            </button>
          </div>

          </div>
          
          {/* Back button at bottom */}
          <div className="p-4 border-t border-white/10">
            <button
              type="button"
              onClick={closeForm}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 
                         rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl 
                         hover:bg-white/10 transition-colors text-white/80 hover:text-white"
              aria-label="Back to landing page"
              title="Back to landing page"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">Back to Landing</span>
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30" onClick={closeSidebar} aria-hidden="true" />
      )}

      {/* Main */}
      <div className="flex flex-col flex-1 overflow-x-hidden">
        {/* Topbar (fixed) */}
        <div className="fixed top-0 inset-x-0 z-20 h-15  lg:h-20 flex items-center justify-between px-4 sm:px-8 md:px-12 lg:px-15  bg-zinc-950/95 shadow-[0_0_20px_rgba(139,92,246,0.5)] backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="text-lg sm:text-2xl md:text-4xl  font-bold tracking-tight bg-gradient-to-tr from-purple-400 to-blue-500 bg-clip-text text-transparent">GenZChat</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <button
                  onClick={openRazorpay}
                  type="button"
                  className="btn-aurora relative w-full overflow-hidden rounded-2xl p-[2px]"
                >
                  <span className="relative z-[1] block w-full rounded-2xl px-4 py-2 text-sm font-medium text-white bg-black/80 hover:brightness-110">
                    Upgrade
                  </span>
                </button>
            <span
              className="inline-flex relative items-center justify-center w-8 h-8   transition-transform duration-300 hover:scale-110"
              title={`Credits: ${credits}`}
              aria-label={`Credits: ${credits}`}
            >
              <FiZap className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 text-[10px] px-1 rounded-full bg-blue-600">
                {credits}
              </span>
            </span>

            <button
              onClick={toggleSidebar}
              aria-label="Profile"
              className="p-2 rounded-full hover:bg-zinc-800 ring-1 ring-zinc-700/60 transition-transform duration-300 hover:scale-115"
              title="Profile"
            >
              <FiUser className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!!error && (
          <div className="px-4 py-2 bg-red-900/40 text-red-200 text-sm mt-14">{error}</div>
        )}

        {/* Messages (only this scrolls) */}
        <div className="flex-1 overflow-y-auto overscroll-contain pt-18 p-4 space-y-6 mt-6 md:mt-10  lg:mt-14 pb-[calc(env(safe-area-inset-bottom)+100px)]">
          {safeChats.length === 0 && (
            <p className="text-center text-gray-500">👋 How can I help you today?</p>
          )}

          {safeChats.map((chat, idx) => (
            <div key={idx} className={`flex ${chat.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`px-4 py-2 rounded-2xl max-w-[80%] ${chat.sender === "user" ? "bg-blue-600 text-white" : "bg-transparent text-gray-200"
                  }`}
              >
                {chat.text && <p className="whitespace-pre-wrap">{chat.text}</p>}

                {(chat.imageUrl || chat.image) && (
                  <div className="mt-2">
                    <img
                      src={chat.imageUrl || chat.image}
                      alt="attachment"
                      className="rounded-lg max-w-full h-auto"
                    />
                  </div>
                )}

                <span className="block text-[10px] text-gray-400 mt-1">{chat.time}</span>
              </div>
            </div>
          ))}

          {loading && <div className="text-center text-gray-400 text-sm">loading.....</div>}
        </div>

        {/* Floating composer */}
        <div className="fixed inset-x-4 bottom-[calc(env(safe-area-inset-bottom)+16px)] z-20 sm:mx-8 md:mx-10 lg:mx-55">
          <div
            className="relative flex items-center gap-2 sm:gap-3
              rounded-2xl border border-zinc-800
              bg-zinc-950/90 backdrop-blur
              px-3 sm:px-4 py-4 sm:py-6 md:py-8 lg:py-10
              shadow-[0_0_30px_rgba(87,64,255,1)] "
          >
            {/* image preview (above input, left) */}
            {imagePreview && (
              <div className="pointer-events-none absolute bottom-full left-2 mb-2 z-30">
                <div className="pointer-events-auto relative inline-block rounded-xl shadow-lg">
                  <img
                    src={imagePreview}
                    alt="selected"
                    className="block rounded-xl object-cover
                      w-10 h-10 sm:w-12 sm:h-12 md:w-20 md:h-20 lg:w-[110px] lg:h-[110px]"
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute -top-2 -right-1 p-1 rounded-full
                      bg-black/70 hover:bg-black text-white
                      ring-1 ring-white/20"
                    aria-label="Remove image"
                    title="Remove"
                  >
                    <FiX className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* text input */}
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter"  && sendMessage()}
              placeholder={credits > 0 ? "Type your message..." : "No credits left!"}
              disabled={credits <= 0 || sending}
              className="flex-1 bg-transparent text-white
                placeholder-gray-500 focus:outline-none
                disabled:opacity-50 text-[15px] sm:text-base"
            />

            {/* hidden file input */}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onImageSelected}
              disabled={sending}
            />

            {/* attach image */}
            <button
              type="button"
              onClick={openImagePicker}
              className="p-2 rounded-full hover:bg-zinc-800 disabled:opacity-50"
              title="Attach image"
              aria-label="Attach image"
              disabled={sending}
            >
              <FiImage className="w-5 h-5" />
            </button>

            {/* send */}
            <button
              onClick={sendMessage}
              disabled={credits <= 0 || sending || (!message.trim() && !imageFile)}
              className="inline-flex items-center justify-center
                bg-gradient-to-r from-purple-500 to-blue-500
                h-9 w-9 sm:h-10 sm:w-10 rounded-full disabled:opacity-50"
              title="Send"
              aria-label="Send"
            >
              <FiSend className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
