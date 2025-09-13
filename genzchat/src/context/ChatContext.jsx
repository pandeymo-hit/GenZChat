import React, { createContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api"; // 'setAuthHeader' and 'clearAuthHeader' are not used here, so they can be removed if you wish.
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
  return []; // Always return an array
};

const LS = {
  user: "chat.user",
  chats: "chat.items",
  credits: "chat.credits",
  mock: "chat.mockmode",
  offlineOnce: "chat.offline.once",
};

export function ChatProvider({ children }) {
  // -------- STATE MANAGEMENT --------

  // The user state now holds the entire profile object for cleanliness
  const [user, setUser] = useState(() => {
    const s = localStorage.getItem(LS.user);
    return s ? JSON.parse(s) : null;
  });

  // Credits are kept as a separate state for easy updates
  const [credits, setCredits] = useState(() => {
    const s = localStorage.getItem(LS.credits);
    const n = s ? Number(s) : NaN;
    return Number.isFinite(n) ? n : 10; // Default to 10 credits
  });

  // Always initialize chats as an empty array to prevent mapping errors
  const [chats, setChats] = useState(() => {
      const s = localStorage.getItem(LS.chats);
      return s ? normalizeChats(JSON.parse(s)) : [];
  });

  // UI and connection states
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mockMode, setMockMode] = useState(false);
  const [offlineUsed, setOfflineUsed] = useState(() => localStorage.getItem(LS.offlineOnce) === "1");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // -------- PERSISTENCE (Saving to localStorage) --------
  useEffect(() => {
    if (user) {
      localStorage.setItem(LS.user, JSON.stringify(user));
    } else {
      localStorage.removeItem(LS.user);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(LS.credits, String(credits));
  }, [credits]);

  useEffect(() => {
    if (chats) {
      localStorage.setItem(LS.chats, JSON.stringify(chats));
    }
  }, [chats]);

  useEffect(() => {
    localStorage.setItem(LS.mock, mockMode ? "1" : "0");
  }, [mockMode]);

  useEffect(() => {
    localStorage.setItem(LS.offlineOnce, offlineUsed ? "1" : "0");
  }, [offlineUsed]);


  // -------- API & DATA FETCHING LOGIC --------

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

  // CORRECTED and improved data fetching function
 // src/context/ChatContext.js

const fetchInitialData = async () => {
    setError("");
    try {
        // Use Promise.allSettled to handle individual API call failures
        const results = await Promise.allSettled([
            safeApiCall(api.get("/chat/history")),
            safeApiCall(api.get("/profile"))
        ]);

        const chatHistoryResult = results[0];
        const profileResult = results[1];

        // --- Handle Chat History ---
        if (chatHistoryResult.status === 'fulfilled') {
            const chatData = chatHistoryResult.value.data;
            const transformedChats = [];
            if (Array.isArray(chatData)) {
                chatData.forEach((item) => {
                    if (item.userMessage) transformedChats.push({ sender: "user", text: item.userMessage, time: new Date().toLocaleTimeString() });
                    if (item.botMessage) transformedChats.push({ sender: "ai", text: item.botMessage, time: new Date().toLocaleTimeString() });
                });
            }
            setChats(transformedChats);
        } else {
            // If chat history fails, log the error but don't crash.
            console.error("Failed to fetch chat history:", chatHistoryResult.reason);
            setChats([]); // Set chats to empty array on failure
        }

        // --- Handle Profile Data ---
        if (profileResult.status === 'fulfilled') {
            const profileData = profileResult.value.data;
            console.log("Fetched profile:", profileData);

            // Update user and credits state
            setUser(profileData);
            if (typeof profileData?.credits === 'number') {
                setCredits(profileData.credits);
            }
        } else {
            // If profile fails, this is a more critical error.
            console.error("Failed to fetch profile:", profileResult.reason);
            setError("Could not fetch your profile data.");
        }

    } catch (error) {
        // This catch block will now only catch very unexpected errors
        console.error("A critical error occurred in fetchInitialData:", error);
        setError("An unexpected error occurred.");
    }
};

  // Run the initial data fetch only once when the component mounts
  useEffect(() => {
    fetchInitialData();
  }, []);

  // -------- CORE CHAT LOGIC --------

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

    // Optimistic UI update for user's message
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
        res = await safeApiCall(api.post("/chat/image", form, { headers: { "Content-Type": "multipart/form-data" } }));
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

      if (mockMode) setMockMode(false);

    } catch (error) {
      console.error("Error sending message:", error);
      let isServerDown = false;
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          setError(`Cannot connect to server. Please check your connection.`);
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
                  { sender: "ai", text: "⚠️ Server is down. Please try again.", time: new Date().toLocaleTimeString() },
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

  // -------- HELPER FUNCTIONS --------

  const resetConnectionState = () => {
    setMockMode(false);
    setOfflineUsed(false);
    setError("");
    fetchInitialData(); // Refetch all data on reset
  };

  const clearError = () => setError("");

  const clearChats = () => {
    setChats([]);
    localStorage.removeItem(LS.chats);
    // Optionally, you might want an API call here to clear history on the server
  };

  const isAuthed = useMemo(() => Boolean(user), [user]);
  const toggleSidebar = () => setSidebarOpen((v) => !v);
  const closeSidebar = () => setSidebarOpen(false);

  // -------- PROVIDER VALUE --------

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
        clearError,
        clearChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}