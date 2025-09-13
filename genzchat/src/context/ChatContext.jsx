// src/chat/ChatContext.jsx
import React, { createContext, useEffect, useMemo, useState } from "react";
import { api, setAuthHeader, clearAuthHeader } from "../services/api";
import axios from "axios";

export const ChatContext = createContext(null);

// --- utils ---
const normalizeChats = (incoming) => {
  try {
    if (Array.isArray(incoming)) return incoming;
    if (Array.isArray(incoming?.chats)) return incoming.chats;
    if (Array.isArray(incoming?.items)) return incoming.items;
    if (Array.isArray(incoming?.data)) return incoming.data;
    if (typeof incoming === "string") {
      const parsed = JSON.parse(incoming);
      if (Array.isArray(parsed)) return parsed;
      if (Array.isArray(parsed?.chats)) return parsed.chats;
    }
  } catch {}
  return [];
};

const LS = {
  user: "chat.user",
  chats: "chat.items",
  credits: "chat.credits",
  mock: "chat.mockmode",
  offlineOnce: "chat.offline.once",
};

export function ChatProvider({ children }) {
  // -------- state --------
  const [user, setUser] = useState(() => {
    const s = localStorage.getItem(LS.user);
    return s ? JSON.parse(s) : null;
  });

  const [credits, setCredits] = useState(() => {
    const s = localStorage.getItem(LS.credits);
    const n = s ? Number(s) : NaN;
    return Number.isFinite(n) ? n : 10;
  });

  const [chats, setChats] = useState(() => {
    const s = localStorage.getItem(LS.chats);
    return s ? normalizeChats(JSON.parse(s)) : [];
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mockMode, setMockMode] = useState(false);
  const [offlineUsed, setOfflineUsed] = useState(() => localStorage.getItem(LS.offlineOnce) === "1");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // -------- persistence --------
  useEffect(() => {
    user
      ? localStorage.setItem(LS.user, JSON.stringify(user))
      : localStorage.removeItem(LS.user);
  }, [user]);

  useEffect(() => {
    localStorage.setItem(LS.credits, String(credits));
  }, [credits]);

  useEffect(() => {
    localStorage.setItem(LS.chats, JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem(LS.mock, mockMode ? "1" : "0");
  }, [mockMode]);

  useEffect(() => {
    localStorage.setItem(LS.offlineOnce, offlineUsed ? "1" : "0");
  }, [offlineUsed]);

  // -------- <--- बदलाव: API wrappers को स्मार्ट बनाया गया --------
  const safeApiCall = async (apiPromise) => {
    if (mockMode) {
      // अगर पहले से ही मॉक मोड में हैं, तो सीधे एरर दें
      throw new Error("Mock mode is active. Please try again later.");
    }
    try {
      const response = await apiPromise;
      // सफल प्रतिक्रिया पर मॉक मोड और ऑफ़लाइन उपयोग को रीसेट करें
      if (mockMode) {
        setMockMode(false);
        setOfflineUsed(false);
      }
      return response;
    } catch (err) {
      // एरर को आगे भेजें ताकि sendMessage उसे संभाल सके
      throw err;
    }
  };

  const fetchPreviousChats = async () => {
    setError("");
    try {
      const { data } = await safeApiCall(api.get("/chat/history"));
      const transformedChats = [];
      if (Array.isArray(data)) {
        data.forEach((item) => {
          if (item.userMessage) {
            transformedChats.push({
              sender: "user",
              text: item.userMessage,
              time: new Date().toLocaleTimeString(),
            });
          }
          if (item.botMessage) {
            transformedChats.push({
              sender: "ai",
              text: item.botMessage,
              time: new Date().toLocaleTimeString(),
            });
          }
        });
      }
      setChats(transformedChats);
    } catch (error) {
      console.error("Error fetching chat history:", error);
      // इतिहास लाने में विफलता पर मॉक मोड चालू न करें
    }
  };

  const resetConnectionState = () => {
    setMockMode(false);
    setOfflineUsed(false);
    setError("");
    // दोबारा कोशिश करने के लिए चैट हिस्ट्री को फिर से लाने का प्रयास करें
    fetchPreviousChats();
  };

  const sendMessage = async (payload) => {
    if (sending) return;

    const text = typeof payload === "string" ? payload : payload?.text || "";
    const imageFile = typeof payload === "object" ? payload?.image || null : null;

    if (!text.trim() && !imageFile) return;
    if (credits <= 0) {
      setError("No credits left.");
      return;
    }

    setSending(true);
    setLoading(true);
    setError("");

    const now = new Date().toLocaleTimeString();
    const localUrl = imageFile ? URL.createObjectURL(imageFile) : null;

    setChats((prev) => [
      ...prev,
      { sender: "user", text: text.trim(), time: now, ...(localUrl ? { imageUrl: localUrl } : {}) },
    ]);

    const safety = setTimeout(() => {
      setSending(false);
      setLoading(false);
      setError("Request timed out. Please try again.");
    }, 20000);

    // <--- बदलाव: एरर हैंडलिंग लॉजिक को यहाँ बेहतर किया गया है ---
    try {
      let res;
      if (imageFile) {
        const form = new FormData();
        form.append("userMessage", text || "");
        form.append("image", imageFile);
        res = await safeApiCall(api.post("/chat/image", form, {
          headers: { "Content-Type": "multipart/form-data" },
        }));
      } else {
        res = await safeApiCall(api.post("/chat", { userMessage: text || "" }));
      }

      const replyText = res.data?.botMessage || String(res.data || "");
      const remainingQueries = res.data?.queriesRemaining;

      if (typeof remainingQueries === 'number' && remainingQueries >= 0) {
        setCredits(remainingQueries);
      }

      setChats((prev) => [
        ...prev,
        { sender: "ai", text: replyText, time: new Date().toLocaleTimeString() },
      ]);

      if (mockMode) {
        setMockMode(false);
        setOfflineUsed(false);
      }

    } catch (error) {
      console.error("Error sending message:", error);
      let isServerDown = false;

      // Axios एरर की जाँच करें
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          // 1. कोई प्रतिक्रिया नहीं = नेटवर्क एरर (सर्वर सचमुच डाउन है)
          setError(`Cannot connect to server at ${api.defaults.baseURL}. Please check your connection.`);
          isServerDown = true;
        } else if (error.response.status >= 500) {
          // 2. 5xx एरर = सर्वर साइड पर क्रैश
          setError(`Server error: ${error.response.status}. Please try again later.`);
          isServerDown = true;
        } else if (error.response.status === 401 || error.response.status === 403) {
          // 3. 401/403 एरर = प्रमाणीकरण (Authentication) समस्या
          setError("Authentication failed. Please login again.");
        } else {
          // 4. अन्य 4xx एरर = क्लाइंट की गलती (जैसे गलत डेटा भेजना)
          setError(`Error: ${error.response.data?.message || error.message}`);
        }
      } else {
        // अन्य जावास्क्रिप्ट एरर
        setError(`An unexpected error occurred: ${error.message}`);
      }

      // केवल तभी मॉक मोड में जाएँ जब सर्वर वास्तव में डाउन हो
      if (isServerDown) {
        setMockMode(true);
        if (!offlineUsed) {
           setTimeout(() => {
                setChats((prev) => [
                  ...prev,
                  {
                    sender: "ai",
                    text: "⚠️ Server is down. Please try after some time. You can send one more message to check the connection.",
                    time: new Date().toLocaleTimeString(),
                  },
                ]);
                setOfflineUsed(true);
            }, 900);
        }
      }
    } finally {
      // अंत में, लोडर और सेफ्टी टाइमर को हमेशा साफ़ करें
      clearTimeout(safety);
      setLoading(false);
      setSending(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchPreviousChats();
    })();
  }, []);

  const isAuthed = useMemo(() => Boolean(user), [user]);
  const toggleSidebar = () => setSidebarOpen((v) => !v);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <ChatContext.Provider
      value={{
        user,
        credits,
        chats,
        sidebarOpen,
        toggleSidebar,
        closeSidebar,
        loading,
        sending,
        error,
        mockMode,
        sendMessage,
        resetConnectionState,
        isAuthed,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}