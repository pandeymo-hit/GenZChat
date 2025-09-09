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
  const [mockMode, setMockMode] = useState(false); // Start with false, don't use localStorage initially
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
      console.log(`Making GET request to: ${url}`);
      const response = await api.get(url, opts);
      console.log(`GET ${url} success:`, response.status, response.data);
      return response;
    } catch (e) {
      console.error(`GET ${url} failed:`, e.response?.status, e.response?.data, e.message);
      setMockMode(true);
      throw e;
    }
  };
  const safePost = async (url, body, opts) => {
    if (mockMode) throw new Error("Mock mode");
    try {
      console.log(`Making POST request to: ${url}`, body);
      const response = await api.post(url, body, opts);
      console.log(`POST ${url} success:`, response.status, response.data);
      return response;
    } catch (e) {
      console.error(`POST ${url} failed:`, e.response?.status, e.response?.data, e.message);
      setMockMode(true);
      throw e;
    }
  };

  // -------- these are the ONLY backend calls --------
  const fetchUser = async () => {
    setError("");
    // Skip user API call since it doesn't exist - user info comes from auth
    console.log("Skipping user API call - using existing user state");
  };

  const fetchCredits = async () => {
    setError("");
    // Skip credits API call since it doesn't exist - credits come with each chat response
    console.log("Skipping credits API call - credits will be updated from chat responses");
  };

  const fetchPreviousChats = async () => {
    setError("");
    console.log("Fetching previous chats...");
    try {
      const { data } = await safeGet("/chat/history");
      console.log("Chat history API response:", data);
      // Transform the API response to match UI expectations
      const transformedChats = [];
      if (Array.isArray(data)) {
        data.forEach((item) => {
          if (item.userMessage) {
            transformedChats.push({
              sender: "user",
              text: item.userMessage,
              time: new Date().toLocaleTimeString(), // You can enhance this with actual timestamps if available
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
      console.log("Transformed chats:", transformedChats);
      setChats(transformedChats);
    } catch (error) {
      console.error("Error fetching chat history:", error);
      console.log("fetchPreviousChats failed, keeping existing chats");
      // Don't automatically enable mock mode for chat history failure
    }
  };

  // Reset connection state - useful when server comes back online
  const resetConnectionState = () => {
    console.log("Manually resetting connection state");
    setMockMode(false);
    setOfflineUsed(false);
    setError("");
  };

  /**
   * POST /api/send
   * payload: string OR { text, image: File }
   * Locks until reply or safety timeout (20s).
   */
  const sendMessage = async (payload) => {
    console.log("sendMessage called with payload:", payload);
    console.log("Current state - sending:", sending, "mockMode:", mockMode, "credits:", credits);
    
    if (sending) {
      console.log("Already sending, returning early");
      return;
    }

    const text =
      typeof payload === "string" ? payload : payload?.text || "";
    const imageFile =
      typeof payload === "object" ? payload?.image || null : null;

    console.log("Extracted text:", text, "imageFile:", imageFile);

    if (!text.trim() && !imageFile) {
      console.log("No text or image, returning early");
      return;
    }
    if (credits <= 0) {
      console.log("No credits left");
      setError("No credits left.");
      return;
    }
    if (mockMode && offlineUsed) {
      console.log("Mock mode and offline message already sent - attempting to reconnect to server");
      // Try to reconnect to server first before blocking the user
      console.log("Attempting to reconnect to server...");
      
      // Reset mock mode temporarily to try the real API
      setMockMode(false);
      console.log("Temporarily disabled mock mode to test server connection");
      
      // Don't return early - let the function continue to try the real API
    }

    console.log("Setting sending and loading states to true");
    setSending(true);
    setLoading(true);
    setError("");

    const now = new Date().toLocaleTimeString();
    const localUrl = imageFile ? URL.createObjectURL(imageFile) : null;

    console.log("Adding user message to chat");
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
    // Don't decrement credits locally - server will return the updated count

    // safety unlock (network hang)
    const safety = setTimeout(() => {
      console.log("Safety timeout triggered");
      setSending(false);
      setLoading(false);
      setError("Request timed out. Please try again.");
    }, 20000);

    // offline path
    if (mockMode) {
      console.log("Using mock mode - one message allowed until server responds");
      setTimeout(() => {
        setChats((prev) => [
          ...prev,
          {
            sender: "ai",
            text: "⚠️ Server is currently down. Please try again later. You can send another message once the server is back online.",
            time: new Date().toLocaleTimeString(),
          },
        ]);
        setOfflineUsed(true); // Mark that offline message was sent
        clearTimeout(safety);
        setLoading(false);
        setSending(false);
      }, 900);
      return;
    }

    // live path
    console.log("Starting live API call");
    try {
      let res;
      if (imageFile) {
        console.log("Sending with image");
        const form = new FormData();
        form.append("message", text || "");
        form.append("image", imageFile);
        res = await safePost("/api/send", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        console.log("Sending text message to /chat endpoint");
        res = await safePost("/chat", { userMessage: text || "" });
      }
      console.log("Send message API response:", res.data);

      // Extract the reply text and remaining queries from the response
      let replyText = "";
      let remainingQueries = null;
      
      if (res.data && typeof res.data === 'object') {
        // Response format: { "botMessage": "...", "queriesRemaining": 12 }
        replyText = res.data.botMessage || "";
        remainingQueries = res.data.queriesRemaining;
        
        console.log("Extracted botMessage:", replyText);
        console.log("Extracted queriesRemaining:", remainingQueries);
        
        // Update credits from response
        if (typeof remainingQueries === 'number' && remainingQueries >= 0) {
          console.log("Updating credits to:", remainingQueries);
          setCredits(remainingQueries);
        }
      } else {
        // Fallback - treat response as plain text
        replyText = String(res.data || "");
        console.log("Using fallback - treating response as plain text:", replyText);
      }
      
      const replyImg = res?.data?.imageUrl;

      console.log("Adding AI response to chat");
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
      
      // Reset offline usage when we get a successful API response
      if (mockMode) {
        console.log("Successful API response - resetting mock mode and offline usage");
        setMockMode(false);
        setOfflineUsed(false);
      }
      
      console.log("Message sent successfully");
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Check if it's a network error
      if (!error.response) {
        setError(`Cannot connect to server at ${api.defaults.baseURL}. Please check if the backend server is running.`);
      } else if (error.response.status === 401 || error.response.status === 403) {
        setError("Authentication failed. Please login again.");
      } else {
        setError(`Server error: ${error.response.status} - ${error.response.data?.message || error.message}`);
      }
      
      // Don't flip to mock mode immediately for auth/network issues
      if (error.response?.status === 401 || error.response?.status === 403) {
        // Authentication issue - don't use mock mode
        clearTimeout(safety);
        setLoading(false);
        setSending(false);
        return;
      }
      
      // flip to offline one-shot only for actual server errors
      console.log("Flipping to mock mode due to error");
      setMockMode(true);
      // Don't set offlineUsed yet - only set it after showing the mock response
      if (offlineUsed) {
        clearTimeout(safety);
        setLoading(false);
        setSending(false);
        setError("Please wait for the server to respond before sending another message.");
        return;
      }
      setTimeout(() => {
        setChats((prev) => [
          ...prev,
          {
            sender: "ai",
            text: "⚠️ Server is down. Please try after some time. You can send another message once the server is back online.",
            time: new Date().toLocaleTimeString(),
          },
        ]);
        setOfflineUsed(true); // Now mark that offline message was sent
        clearTimeout(safety);
        setLoading(false);
        setSending(false);
      }, 900);
    }
  };

  // -------- boot: call only the working APIs --------
  useEffect(() => {
    (async () => {
      console.log("Initializing ChatProvider...");
      try {
        // Only call fetchPreviousChats since other APIs don't exist
        await fetchPreviousChats();
        console.log("ChatProvider initialization completed successfully");
      } catch (error) {
        console.error("ChatProvider initialization failed:", error);
        // Don't automatically enable mock mode if it's just an auth issue
        if (error.message !== "Mock mode") {
          console.log("Chat history fetch failed, but not enabling mock mode yet");
        }
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
        resetConnectionState,

        // bonus derived
        isAuthed,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
