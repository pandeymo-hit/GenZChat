// src/chat/ChatContext.jsx
import React, { createContext, useEffect, useMemo, useState } from "react";
import { api, setAuthHeader, clearAuthHeader } from "../services/api";
import axios from "axios";

export const ChatContext = createContext(null);

// const api = axios.create({
//   baseURL: import.meta?.env?.VITE_API_URL || "",
//   withCredentials: true,
// });

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

  // offline fallback controller
  const [mockMode, setMockMode] = useState(
    () => localStorage.getItem(LS.mock) === "1"
  );
  const [offlineUsed, setOfflineUsed] = useState(
    () => localStorage.getItem(LS.offlineOnce) === "1"
  );

  // ui flags
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false); // lock while awaiting reply
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

  // -------- safe API wrappers (auto-flip to mock on failure) --------
  const safeGet = async (url, opts) => {
    if (mockMode) throw new Error("Mock mode");
    try {
      return await api.get(url, opts);
    } catch (e) {
      setMockMode(true);
      throw e;
    }
  };
  const safePost = async (url, body, opts) => {
    if (mockMode) throw new Error("Mock mode");
    try {
      return await api.post(url, body, opts);
    } catch (e) {
      setMockMode(true);
      throw e;
    }
  };

  // -------- these are the ONLY backend calls --------
  const fetchUser = async () => {
    setError("");
    try {
      const { data } = await safeGet("/api/user");
      setUser(data || null);
    } catch {
      // go mock, keep local user if any
      setMockMode(true);
    }
  };

  const fetchCredits = async () => {
    setError("");
    try {
      const { data } = await safeGet("/api/credits");
      const n = Number(data?.credits);
      if (Number.isFinite(n)) setCredits(n);
    } catch {
      setMockMode(true);
    }
  };

  const fetchPreviousChats = async () => {
    setError("");
    try {
      const { data } = await safeGet("/chat/history");
      setChats(normalizeChats(data));
    } catch {
      setMockMode(true);
    }
  };

  /**
   * POST /api/send
   * payload: string OR { text, image: File }
   * Locks until reply or safety timeout (20s).
   */
  const sendMessage = async (payload) => {
    if (sending) return;

    const text =
      typeof payload === "string" ? payload : payload?.text || "";
    const imageFile =
      typeof payload === "object" ? payload?.image || null : null;

    if (!text.trim() && !imageFile) return;
    if (credits <= 0) {
      setError("No credits left.");
      return;
    }
    if (mockMode && offlineUsed) {
      setError("Offline demo: only one message allowed.");
      return;
    }

    setSending(true);
    setLoading(true);
    setError("");

    const now = new Date().toLocaleTimeString();
    const localUrl = imageFile ? URL.createObjectURL(imageFile) : null;

    // show user's message instantly
    setChats((prev) => [
      ...prev,
      {
        sender: "user",
        text: text.trim(),
        time: now,
        ...(localUrl ? { imageUrl: localUrl } : {}),
      },
    ]);
    setCredits((c) => Math.max(0, c - 1));

    // safety unlock (network hang)
    const safety = setTimeout(() => {
      setSending(false);
      setLoading(false);
      setError("Request timed out. Please try again.");
    }, 20000);

    // offline path
    if (mockMode) {
      setTimeout(() => {
        setChats((prev) => [
          ...prev,
          {
            sender: "ai",
            text: "⚠️ Server is down. Please try after some time.",
            time: new Date().toLocaleTimeString(),
          },
        ]);
        setOfflineUsed(true);
        clearTimeout(safety);
        setLoading(false);
        setSending(false);
      }, 900);
      return;
    }

    // live path
    try {
      let res;
      if (imageFile) {
        const form = new FormData();
        form.append("message", text || "");
        form.append("image", imageFile);
        res = await safePost("/api/send", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await safePost("/chat", { userMessage: text || "" });
      }
      console.log(res)

      const replyText = res?.data;
      const replyImg = res?.data?.imageUrl;

      setChats((prev) => [
        ...prev,
        {
          sender: "ai",
          text: replyText,
          time: new Date().toLocaleTimeString(),
          ...(replyImg ? { imageUrl: replyImg } : {}),
        },
      ]);

      clearTimeout(safety);
      setLoading(false);
      setSending(false);
    } catch {
      // flip to offline one-shot
      setMockMode(true);
      if (offlineUsed) {
        clearTimeout(safety);
        setLoading(false);
        setSending(false);
        setError("Offline demo: only one message allowed.");
        return;
      }
      setTimeout(() => {
        setChats((prev) => [
          ...prev,
          {
            sender: "ai",
            text: "⚠️ Server is down. Please try after some time.",
            time: new Date().toLocaleTimeString(),
          },
        ]);
        setOfflineUsed(true);
        clearTimeout(safety);
        setLoading(false);
        setSending(false);
      }, 900);
    }
  };

  // -------- boot: call only the 3 GETs above --------
  useEffect(() => {
    (async () => {
      try {
        await Promise.all([
          fetchUser(),
          fetchCredits(),
          fetchPreviousChats(),
        ]);
      } catch {
        // mockMode already toggled inside wrappers on failure
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------- derived --------
  const isAuthed = useMemo(() => Boolean(user), [user]);
  const toggleSidebar = () => setSidebarOpen((v) => !v);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <ChatContext.Provider
      value={{
        // data
        user,
        credits,
        chats,

        // ui
        sidebarOpen,
        toggleSidebar,
        closeSidebar,
        loading,
        sending,
        error,
        mockMode,

        // backend funcs (ONLY these four)
        fetchUser,
        fetchCredits,
        fetchPreviousChats,
        sendMessage,

        // bonus derived
        isAuthed,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
