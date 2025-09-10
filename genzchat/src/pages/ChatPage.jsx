// src/pages/ChatPAge.jsx
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import MorePage from "./MorePage";
import Razorpay from "../trail/razorpay"; // <-- default export from src/trail/razorpay.jsx

import {
  FiLogOut,
  FiUser,
  FiSend,
  FiEdit2,
  FiZap,
  FiImage,
  FiX,
  FiHelpCircle,
  FiFileText,
  FiCheck,
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
    sending, // 🔒 lock (NEW)
    resetConnectionState, // NEW: Reset connection when server is back
  } = useContext(ChatContext) || {};

  const { closeForm, logout, username } = useContext(AuthContext);

  const [view, setView] = useState("chat"); // "chat" | "more" | razorpay

  // Auto-scroll refs (not needed in reverse layout but keeping for future use)
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // No auto-scroll needed in reverse layout - newest messages appear at bottom automatically

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

  // Define safeChats early so it can be used in useEffect hooks
  const safeChats = useMemo(() => (Array.isArray(chats) ? chats : []), [chats]);

  // No scroll functions needed in reverse layout - messages naturally appear at bottom

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleEditClick = () => {
    setShowEditBlocked(true);
    setTimeout(() => setShowEditBlocked(false), 2500);
  };

  const handleSendMessage = async () => {
    if (sending) return; // respect lock
    const hasText = Boolean(message.trim());
    const hasImage = Boolean(imageFile);
    if (!hasText && !hasImage) return;

    try {
      if (hasImage) {
        await sendMessage?.({ text: message.trim(), image: imageFile });
      } else {
        await sendMessage?.(message.trim());
      }
      setMessage("");
      clearImage();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

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
    return (
      <MorePage
        onBack={() => setView("chat")}
        onLogout={logout}
        username={username || user?.name || "Guest"}
        signupDate={user?.signupDate || "N/A"}
      />
    );
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
                  <p className="text-xs text-gray-400">
                    SignUp: {user?.signupDate || "N/A"}
                  </p>
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
                    <span className="font-semibold  tracking-wide text-blue-200">
                      Active Plan
                    </span>
                    <span className="mx-1 text-gray-500">:</span>
                    <span className="text-gray-400 font-medium bg-gray-600/30 px-2 py-[5px] rounded-2xl">
                      none
                    </span>
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
              <button
                className="w-full flex items-center justify-between px-4 py-2 hover:bg-white/5"
                type="button"
              >
                <span className="inline-flex items-center gap-2">
                  <FiHelpCircle className="w-4 h-4 text-white" />
                  <span>FAQ</span>
                </span>
              </button>

              <button
                className="w-full flex items-center justify-between px-4 py-2 hover:bg-white/5"
                type="button"
              >
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
          <div className="p-4 border-t border-white/10"></div>
        </div>
      </div>

      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Main */}
      <div className="flex flex-col flex-1 overflow-x-hidden">
        {/* Topbar (fixed) */}
        <div className="fixed top-0 inset-x-0 z-20 h-15  lg:h-20 flex items-center justify-between px-4 sm:px-8 md:px-12 lg:px-15  bg-zinc-950/95 shadow-[0_0_20px_rgba(139,92,246,0.5)] backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="text-lg sm:text-2xl md:text-4xl  font-bold tracking-tight bg-gradient-to-tr from-purple-400 to-blue-500 bg-clip-text text-transparent">
              GenZChat
            </span>
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

        {/* Error message with improved styling */}
        {!!error && (
          <div className="fixed top-20 inset-x-4 z-30 max-w-md mx-auto">
            <div className="bg-red-900/80 backdrop-blur-sm border border-red-700/50 text-red-200 text-sm px-4 py-3 rounded-xl shadow-lg">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0" />
                  <span>{error}</span>
                </div>
                {(error.includes("wait for") ||
                  error.includes("Server") ||
                  error.includes("connect")) && (
                  <button
                    onClick={resetConnectionState}
                    className="ml-3 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs font-medium transition-colors flex-shrink-0"
                    title="Reset connection and try again"
                  >
                    Retry
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Messages Area with improved styling - Reverse layout */}
        <div
          ref={messagesContainerRef}
          className="messages-container flex-1 overflow-y-auto overscroll-contain pt-18 px-6 sm:px-8 mt-6 md:mt-10 lg:mt-14 pb-[calc(env(safe-area-inset-bottom)+120px)] flex flex-col"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="max-w-4xl mx-auto space-y-4 px-2 flex flex-col">
            {/* Loading indicator - appears at top in normal view  */}
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
            {safeChats.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-4">
                  <span className="text-2xl">💭</span>
                </div>
                <p className="text-gray-400 text-lg font-medium mb-2">
                  Start a conversation
                </p>
                <p className="text-gray-600 text-sm">
                  Ask me anything - I'm here to help!
                </p>
              </div>
            )}

            {safeChats.map((chat, idx) => (
              <div
                key={idx}
                className={`flex message-bubble ${
                  chat.sender === "user" ? "justify-end" : "justify-start"
                } mb-4`}
              >
                <div
                  className={`flex items-start gap-3 max-w-[85%] ${
                    chat.sender === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      chat.sender === "user"
                        ? "bg-gradient-to-br from-purple-500 to-blue-500"
                        : "bg-gradient-to-br from-gray-600 to-gray-700"
                    }`}
                  >
                    {chat.sender === "user" ? (
                      <FiUser className="w-4 h-4 text-white" />
                    ) : (
                      <span className="text-xs font-bold text-white">AI</span>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`relative ${
                      chat.sender === "user"
                        ? "bg-gradient-to-br from-purple-500 to-blue-500 text-white"
                        : "bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 text-gray-100"
                    } rounded-2xl px-4 py-3 shadow-lg`}
                  >
                    {/* Message tail */}
                    <div
                      className={`absolute top-3 w-3 h-3 transform rotate-45 ${
                        chat.sender === "user"
                          ? "bg-gradient-to-br from-purple-500 to-blue-500 -right-1"
                          : "bg-gray-800/60 border-l border-t border-gray-700/50 -left-1"
                      }`}
                    />

                    {/* Message content */}
                    {chat.text && (
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {chat.text}
                      </p>
                    )}

                    {/* Image attachment */}
                    {(chat.imageUrl || chat.image) && (
                      <div className="mt-3">
                        <img
                          src={chat.imageUrl || chat.image}
                          alt="attachment"
                          className="rounded-xl max-w-full h-auto shadow-md"
                        />
                      </div>
                    )}

                    {/* Timestamp */}
                    <div
                      className={`flex items-center gap-1 mt-2 text-[10px] ${
                        chat.sender === "user"
                          ? "text-purple-100"
                          : "text-gray-400"
                      }`}
                    >
                      <span>{chat.time}</span>
                      {chat.sender === "user" && (
                        <FiCheck className="w-3 h-3" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Input Area */}
        <div className="fixed inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black via-black/95 to-transparent pb-safe pt-6">
          <div className="max-w-4xl mx-auto px-4">
            <div className="relative">
              {/* Image preview */}
              {imagePreview && (
                <div className="absolute bottom-full left-4 mb-4 z-10">
                  <div className="relative inline-block rounded-xl overflow-hidden shadow-xl">
                    <img
                      src={imagePreview}
                      alt="selected"
                      className="block w-16 h-16 sm:w-20 sm:h-20 object-cover"
                    />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full
                        bg-red-500 hover:bg-red-600 text-white
                        flex items-center justify-center transition-colors
                        shadow-md z-20"
                      aria-label="Remove image"
                    >
                      <FiX className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </button>
                  </div>
                </div>
              )}

              {/* Input container */}
              <div
                className="relative flex items-center gap-2 sm:gap-3
                rounded-2xl border border-gray-700/50
                bg-gray-900/80 backdrop-blur-xl
                px-3 sm:px-4 py-2.5 sm:py-3
                shadow-[0_8px_32px_rgba(0,0,0,0.4)]
                hover:border-gray-600/50 transition-colors"
              >
                {/* Text input */}
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && !e.shiftKey && handleSendMessage()
                  }
                  placeholder={
                    credits > 0 ? "Message GenZChat..." : "No credits left!"
                  }
                  disabled={credits <= 0 || sending}
                  className="flex-1 bg-transparent text-white text-sm sm:text-base
                    placeholder-gray-400 focus:outline-none
                    disabled:opacity-50 resize-none min-w-0"
                />

                {/* Hidden file input */}
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onImageSelected}
                  disabled={sending}
                />

                {/* Action buttons */}
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  {/* Attach image button */}
                  <button
                    type="button"
                    onClick={openImagePicker}
                    className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-700/50 
                      text-gray-400 hover:text-gray-300
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-colors flex-shrink-0"
                    title="Attach image"
                    disabled={sending}
                  >
                    <FiImage className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  {/* Send button */}
                  <button
                    onClick={handleSendMessage}
                    disabled={
                      credits <= 0 || sending || (!message.trim() && !imageFile)
                    }
                    className="inline-flex items-center justify-center
                      w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex-shrink-0
                      bg-gradient-to-r from-purple-500 to-blue-500
                      hover:from-purple-600 hover:to-blue-600
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-all duration-200
                      shadow-lg hover:shadow-xl
                      transform hover:scale-105 active:scale-95"
                    title="Send message"
                  >
                    {sending ? (
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <FiSend className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    )}
                  </button>
                </div>
              </div>

              {/* Credits indicator */}
              <div className="flex items-center justify-center mt-3">
                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full
                  bg-gray-800/60 backdrop-blur-sm border border-gray-700/50
                  text-xs text-gray-300"
                >
                  <FiZap className="w-3.5 h-3.5 text-blue-400" />
                  <span className="hidden sm:inline">
                    {credits} messages remaining
                  </span>
                  <span className="sm:hidden">{credits} left</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS to hide scrollbars completely */}
      <style>{`
        .messages-container {
          scrollbar-width: none !important; /* Firefox */
          -ms-overflow-style: none !important; /* Internet Explorer 10+ */
        }
        .messages-container::-webkit-scrollbar {
          display: none !important; /* WebKit */
          width: 0 !important;
          height: 0 !important;
        }
      `}</style>
    </div>
  );
}
