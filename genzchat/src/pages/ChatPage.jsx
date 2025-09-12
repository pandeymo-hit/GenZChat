import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { MdAttachFile } from "react-icons/md";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import MorePage from "./MorePage";
import Razorpay from "../trail/razorpay";

import {
  // Chat Area & General UI Icons
  FiSend,
  FiZap,
  FiImage,
  FiX,
  FiEdit2,
  FiCheck,

  // New Sidebar Icons
  FiUser,
  FiPlusCircle,
  FiGlobe,
  FiChevronRight,
  FiMessageSquare,
  FiHelpCircle,
  FiFileText,
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
    loading,
    error,
    sending,
    resetConnectionState,
  } = useContext(ChatContext) || {};

  const { logout, username } = useContext(AuthContext);

  const [view, setView] = useState("chat");
  const messagesEndRef = useRef(null);

  const [message, setMessage] = useState("");
  const [showEditBlocked, setShowEditBlocked] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const imageInputRef = useRef(null);

  const openRazorpay = () => setView("razorpay");

  // <-- CHANGE: Credit 0 hone par Razorpay kholne ka logic
  useEffect(() => {
    if (credits !== null && credits <= 0) {
      // Thoda delay taki user ko pata chale credits khatam ho gaye hain
      const timer = setTimeout(() => {
        setView("razorpay");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [credits]);

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

  const safeChats = useMemo(() => (Array.isArray(chats) ? chats : []), [chats]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [safeChats, loading]);

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
    if (sending) return;

    if (credits <= 0) {
      setView("razorpay");
      return;
    }

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

  if (view === "razorpay") {
    return <Razorpay onBack={() => setView("chat")} />;
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
      {/* <-- BUG FIX: Nested sidebar ko hatakar structure aab sahi kar diya gaya hai --> */}

      {/* Right Sidebar - New Design */}
      <div
        className={`fixed inset-y-0 right-0 w-80 
        transform transition-transform duration-300 z-40
        bg-black border-l border-zinc-700/80
        text-zinc-300
        ${sidebarOpen ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-modal="true"
      >
        {/* Sidebar content */}
        <div className="h-full flex flex-col p-4 space-y-6">
          {/* 1) Profile Section */}
          <div className="flex items-center gap-4 px-2">
            <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center ring-1 ring-zinc-600">
              <FiUser className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-white text-lg">{user?.name || "Guest"}</p>
              <p className="text-xs text-zinc-400">UID: {user?.id || "3172701"}</p>
            </div>
          </div>

          {/* 2) Active Plan Card */}
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
              <button
                onClick={openRazorpay}
                type="button"
                className="relative mt-5 w-full overflow-hidden rounded-full p-[2px] btn-aurora transition-transform duration-300 hover:scale-105"
              >
                <span
                  className="relative z-[1] flex w-full items-center justify-center rounded-full bg-black/80 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-black/60"
                >
                  Upgrade Plan
                </span>
              </button>
            </div>
          </div>

          {/* 3) Links List */}
          <div className="flex flex-col space-y-2 px-2 text-sm font-medium">
            <button
              onClick={() => setView("more")}
              className="w-full flex items-center gap-4 px-3 py-2.5 rounded-lg hover:bg-zinc-700/50 transition-colors"
            >
              <FiUser className="w-5 h-5 text-zinc-400" />
              <span>My Profile</span>
            </button>
            <button className="w-full flex items-center justify-between gap-4 px-3 py-2.5 rounded-lg hover:bg-zinc-700/50 transition-colors">
              <div className="flex items-center gap-4">
                <FiGlobe className="w-5 h-5 text-zinc-400" />
                <span>English</span>
              </div>
              <FiChevronRight className="w-4 h-4 text-zinc-500" />
            </button>
            <button className="w-full flex items-center gap-4 px-3 py-2.5 rounded-lg hover:bg-zinc-700/50 transition-colors">
              <FiMessageSquare className="w-5 h-5 text-zinc-400" />
              <span>Contact support</span>
            </button>
            <button className="w-full flex items-center gap-4 px-3 py-2.5 rounded-lg hover:bg-zinc-700/50 transition-colors">
              <FiHelpCircle className="w-5 h-5 text-zinc-400" />
              <span>FAQ</span>
            </button>
            {/* <-- CHANGE: Logout button wapas add kar diya gaya hai --> */}

          </div>

          {/* Footer Text */}
          <div className="mt-auto text-center px-4 pb-2">
            <p className="text-xs text-zinc-500">
              By using GenZChat, you are agreeing to the{" "}
              <a href="#" className="underline hover:text-zinc-400">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline hover:text-zinc-400">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>

      {/* <-- CHANGE: Backdrop for closing sidebar on outside click --> */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-x-hidden">
        {/* Topbar */}
        <div className="fixed top-0 inset-x-0 z-20 h-15 lg:h-20 flex items-center justify-between px-4 sm:px-8 md:px-12 lg:px-15 bg-zinc-950/95 shadow-[0_0_20px_rgba(139,92,246,0.5)] backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="text-lg sm:text-2xl md:text-4xl font-bold tracking-tight bg-gradient-to-tr from-purple-400 to-blue-500 bg-clip-text text-transparent">
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
              className="inline-flex relative items-center justify-center w-8 h-8 transition-transform duration-300 hover:scale-110"
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

        {/* Messages Area */}
        <div
          className="messages-container flex-1 overflow-y-auto overscroll-contain pt-18 px-6 sm:px-8 mt-6 md:mt-10 lg:mt-14 pb-[calc(env(safe-area-inset-bottom)+120px)] flex flex-col"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="max-w-5xl mx-auto space-y-4 px-2 flex flex-col w-full">
            {safeChats.length === 0 && !loading && (
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
                className={`flex message-bubble ${chat.sender === "user" ? "justify-end" : "justify-start"
                  } mb-4`}
              >
                <div
                  className={`flex items-center gap-3 max-w-[85%] ${chat.sender === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${chat.sender === "user"
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
                  <div
                    className={`relative ${chat.sender === "user"
                        ? "bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 text-gray-100"
                        : "bg-transparent"
                      } rounded-2xl px-4 py-3 shadow-lg`}
                  >
                    {chat.text && (
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {chat.text}
                      </p>
                    )}
                    {(chat.imageUrl || chat.image) && (
                      <div className="mt-3">
                        <img
                          src={chat.imageUrl || chat.image}
                          alt="attachment"
                          className="rounded-xl max-w-full h-auto shadow-md"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

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

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="fixed inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black via-black/95 to-transparent pb-safe pt-6">
          <div className="max-w-4xl mx-auto px-4">
            <div className="relative">
              {/* Image Preview */}

              <div className="relative flex items-center gap-2 sm:gap-3 rounded-2xl border border-gray-700/50 bg-gray-900/90 backdrop-blur-xl px-3 sm:px-4 py-2.5 sm:py-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-gray-600/50 transition-colors mb-8">
                <button
                  type="button"
                  onClick={openImagePicker}
                  className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-700/50 text-gray-400 hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                  title="Attach image"
                  disabled={sending}
                >
                  <MdAttachFile className="w-4 h-4 sm:w-5 sm:h-5 rotate-25" />
                </button>

                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                  placeholder={credits > 0 ? "Message GenZChat..." : "No credits left!"}
                  disabled={credits <= 0 || sending}
                  className="flex-1 bg-transparent text-white text-sm sm:text-base placeholder-gray-400 focus:outline-none disabled:opacity-50 resize-none min-w-0"
                />

                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onImageSelected}
                  disabled={sending}
                />

                <button
                  onClick={handleSendMessage}
                  disabled={credits <= 0 || sending || (!message.trim() && !imageFile)}
                  title="Send message"
                  className="relative p-[1.5px] rounded-full bg-gradient-to-r from-fuchsia-500 to-blue-500 transition-all duration-300 transform hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:from-gray-600 disabled:to-gray-600"
                >
                  <div className="flex items-center justify-center bg-black rounded-full w-8 h-8 sm:w-10 sm:h-10">
                    {sending ? (
                      <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                    ) : (
                      <FiSend className="w-4 h-4 text-white" />
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .typing-dot {
            animation: typing 1.4s infinite;
        }
        .typing-dot:nth-child(2) {
            animation-delay: 0.2s;
        }
        .typing-dot:nth-child(3) {
            animation-delay: 0.4s;
        }
        @keyframes typing {
            0%, 80%, 100% {
                transform: scale(0);
            }
            40% {
                transform: scale(1.0);
            }
        }
      `}</style>
    </div>
  );
}