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

  const safeApiCall = async (apiPromise) => {
    if (mockMode) {
      throw new Error("Mock mode is active. Please try again later.");
    }
    try {
      const response = await apiPromise;
      if (mockMode) {
        setMockMode(false);
        setOfflineUsed(false);
      }
      return response;
    } catch (err) {
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
    }
  };

  const resetConnectionState = () => {
    setMockMode(false);
    setOfflineUsed(false);
    setError("");
    fetchPreviousChats();
  };

  // ---▼▼▼ NEW: Function to clear the error message ▼▼▼---
  const clearError = () => setError("");

  // ---▼▼▼ NEW: Function to clear all chats from state and localStorage ▼▼▼---
  const clearChats = () => {
    setChats([]);
    localStorage.removeItem(LS.chats);
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

      if (axios.isAxiosError(error)) {
        if (!error.response) {
          setError(`Cannot connect to server at ${api.defaults.baseURL}. Please check your connection.`);
          isServerDown = true;
        } else if (error.response.status >= 500) {
          setError(`Server error: ${error.response.status}. Please try again later.`);
          isServerDown = true;
        } else if (error.response.status === 401 || error.response.status === 403) {
          setError("Authentication failed. Please login again.");
        } else {
          setError(`Error: ${error.response.data?.message || error.message}`);
        }
      } else {
        setError(`An unexpected error occurred: ${error.message}`);
      }

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
        // ---▼▼▼ NEW: Exporting new functions ▼▼▼---
        clearError,
        clearChats,
        // ---▲▲▲ END of new functions ▲▲▲---
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}