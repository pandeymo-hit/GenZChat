import React, { createContext, useEffect, useMemo, useState } from "react";
import { api, setAuthHeader, clearAuthHeader } from "../services/api";
import { isValidPhoneNumber } from "libphonenumber-js/min";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState("profile");     // "login" | "signup" | "forgot" | "profile"
  const [isFlipped, setIsFlipped] = useState(false);

  // Login
  const [loginPhone, setLoginPhone] = useState("+91");
  const [password, setPassword] = useState("");
  const [resetMode, setResetMode] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [confirmNewPass, setConfirmNewPass] = useState("");

  // Signup
  const [signupPhone, setSignupPhone] = useState("+91");
  const [signupFlipped, setSignupFlipped] = useState(false);
  const [signupOtp, setSignupOtp] = useState(["", "", "", "", "", ""]);
  const [signupTimerLeft, setSignupTimerLeft] = useState(0);

  // Onboarding
  const [dp, setDp] = useState("https://i.pravatar.cc/100?img=1");
  const [username, setUserName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [terms, setTerms] = useState(false);

  // Forgot
  const [forgotFlipped, setForgotFlipped] = useState(false);
  const [forgotPhone, setForgotPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timerLeft, setTimerLeft] = useState(0);

  // chat page state 

  const[userChat,setUserChat]=useState("hello")
  const[aiChat,setAiChat]=useState("hii buddy")

  // Common
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Token
  const [token, setToken] = useState(() => localStorage.getItem("authToken") || null);
  const setAuthToken = (tkn) => {
    setToken(tkn);
    if (tkn) { localStorage.setItem("authToken", tkn); setAuthHeader(tkn); }
    else { localStorage.removeItem("authToken"); clearAuthHeader(); }
  };
  useEffect(() => { if (token) setAuthHeader(token); }, [token]);

  // Timers
  useEffect(() => {
    if (timerLeft <= 0) return;
    const id = setInterval(() => setTimerLeft((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [timerLeft]);

  useEffect(() => {
    if (signupTimerLeft <= 0) return;
    const id = setInterval(() => setSignupTimerLeft((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [signupTimerLeft]);

  // Helpers
  const onlyDigits = (s = "") => s.replace(/\D/g, "");
  const toE164 = (v = "") => (v.startsWith("+") ? v : `+${onlyDigits(v)}`);
  const validIntl = (v) => isValidPhoneNumber(toE164(v));

  const isValidLoginPhone = useMemo(() => validIntl(loginPhone), [loginPhone]);
  const isValidSignupPhone = useMemo(() => validIntl(signupPhone), [signupPhone]);
  const isValidForgotPhone = useMemo(() => validIntl(forgotPhone), [forgotPhone]);

  // Demo heuristic
  const isInDB = useMemo(() => {
    const d = onlyDigits(loginPhone);
    return d.length > 0 && d[d.length - 1] === "7";
  }, [loginPhone]);

  // open/close form
  const openForm = () => setShowForm(true);
  const closeForm = () => setShowForm(false);

  // New function to specifically open signup form
  const openSignupForm = () => {
    setShowForm(true);
    setMode("login");
    setIsFlipped(true);
  };

  // SIGNUP FLOW
  const sendSignupOtp = async () => {
    setError("");
    if (!isValidSignupPhone) { setError("Enter a valid phone number"); return; }

    setLoading(true);
    try {
      const res = await api.post(`/signup`, null, { params: { phoneNumber: onlyDigits(signupPhone) } });
      if (res.status === 200) {
        setSignupFlipped(true);
        setSignupTimerLeft(60);
        return;
      }
      setError(res?.data?.message || "Couldn't send OTP");
    } catch (e) {
      const status = e?.response?.status;

      if (status === 404) {
        alert("Signup beech me chhod diya tha. Naya OTP bhej rahe hain.");
        try {
          const fresh = await api.post(`/v1/authentication/send-otp`, null, { params: { phone: onlyDigits(signupPhone) } });
          if (fresh.status === 200) {
            setSignupFlipped(true);
            setSignupTimerLeft(60);
            return;
          }
          setError("Couldn't re-send OTP");
        } catch (e2) {
          setError(e2?.response?.data?.message || "Couldn't re-send OTP");
        }
        return;
      }

      // 🔧 FIX: use `status` (res is undefined in catch)
      if (status === 208) {
        setError("This number is already registered. Please log in.");
        setIsFlipped(false);
        setMode("login");
        setLoginPhone(toE164(signupPhone));
        return;
      }

      setError(e?.response?.data?.message || "Couldn't send OTP");
    } finally {
      setLoading(false);
    }
  };

  const resendSignupOtp = async () => {
    if (signupTimerLeft > 0) return;
    setError("");
    try {
      const r = await api.post(`/v1/authentication/send-otp`, null, {
        params: { phone: onlyDigits(signupPhone), resend: true }
      });
      if (r.status === 200) { setSignupTimerLeft(60); return; }
      setError(r?.data?.message || "Failed to resend OTP");
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to resend OTP");
    }
  };

  const verifySignupOtp = async () => {
    setError("");
    const code = signupOtp.join("");
    if (code.length !== 6) { setError("Enter 6-digit OTP"); return; }

    setLoading(true);
    try {
      const resp = await api.post(`/v1/authentication/verify-otp`, null, {
        params: { phoneNumber: onlyDigits(signupPhone), otp: code },
      });

      if (resp.status === 200) {
        const tokenIn = resp?.data;
        if (!tokenIn) { setError("Token missing from server response"); return; }
        setAuthToken(tokenIn);
        setSignupFlipped(false);
        setSignupTimerLeft(0);
        setSignupOtp(["", "", "", "", "", ""]);
        setMode("profile");
        return;
      }

      setError(resp?.data?.message || "Invalid OTP or session");
    } catch (e) {
      const s = e?.response?.status;
      if (s === 401 || s === 403) {
        setError("Session invalid. Please restart signup.");
        setAuthToken(null);
      } else if (s === 404) {
        try {
          const re = await api.post(`/signup`, null, { params: { phoneNumber: onlyDigits(signupPhone) } });
          if (re.status === 200) {
            setSignupFlipped(true);
            setSignupTimerLeft(60);
            setError("We sent a fresh OTP. Please enter the new code.");
            return;
          }
        } catch {}
        setError("Invalid OTP or session");
      } else {
        setError(e?.response?.data?.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  // ONBOARDING
  const UserOnBoarding = async () => {
    setError("");
    if (!token) { setError("Session expired. Please login again."); return; }
    if (username.trim().length < 2) { setError("Name must be at least 2 chars"); return; }
    if (password.length < 6) { setError("Password must be at least 6 chars"); return; }
    if (!["MALE", "FEMALE", "OTHER"].includes((gender || "").toUpperCase())) { setError("Select gender"); return; }
    if (!dob) { setError("Pick a valid DOB"); return; }
    if (!terms) { setError("Please accept Terms & Conditions"); return; }

    try {
      const phNumber = onlyDigits(signupPhone);
      const payload = { username, password, phNumber, gender: (gender || "").toUpperCase(), dob, dp };
      const res = await api.post(`/user-onboarding`, payload);
      if (res.status === 201) {
        setMode("chat-page");
      } else {
        setError(res.data?.message || "Something went wrong");
      }
    } catch (e) {
      if (e?.response?.status === 401 || e?.response?.status === 403) {
        setError("Session invalid. Please login again.");
        setAuthToken(null);
      } else {
        setError(e?.response?.data?.message || "Error saving profile");
      }
    }
  };

  // LOGIN
  const login = async () => {
    setError("");
    if (!isValidLoginPhone) { setError("Please enter a valid phone number"); return; }

    if (resetMode) {
      if (newPass.length < 6) return setError("New password must be at least 6 chars");
      if (newPass !== confirmNewPass) return setError("Passwords do not match");
      alert("Login successful (password reset)");
      setResetMode(false);
      setPassword(""); setNewPass(""); setConfirmNewPass("");
      return;
    }

    if (!password) { setError("Password cannot be empty"); return; }

    // if (!isInDB) {
    //   setIsFlipped(true);
    //   setMode("signup");
    //   return;
    // }

    setLoading(true);
    try {
      const res = await api.post(`/login`, {
        phNumber: onlyDigits(loginPhone),
        password,
      });
      const freshToken = res?.data;
      if (freshToken) setAuthToken(freshToken);
      if (res.status === 200) {
        setMode("chat-page");
         const tokenIn = res?.data;
        if (!tokenIn) { setError("Token missing from server response"); return; }
        setAuthToken(tokenIn);
      }else {
        setError(res.data?.message || "Something went wrong");
      }

      setError(res.data?.message || "Login failed");
      return false;
    } catch (err) {
      const msg = (err?.response?.data?.message || err?.message || "").toLowerCase();
      if (msg.includes("not found") || err?.response?.status === 404) {
        setError("No account found. Please sign up.");
      } else if (msg.includes("invalid") || msg.includes("wrong") || err?.response?.status === 401) {
        setError("Wrong password.");
      } else {
        setError("Something went wrong");
      }
      return false;
    } finally { setLoading(false); }
  };

  // FORGOT
  const startForgot = () => {
    setMode("forgot");
    setForgotFlipped(false);
    setForgotPhone("");
    setOtp(["", "", "", "", "", ""]);
    setTimerLeft(0);
  };

  const sendForgotOtp = async () => {
    setError("");
    if (!isValidForgotPhone) { setError("Enter a valid phone number"); return; }
    setLoading(true);
    try {
      await api.post(`/forgot-password`, null, { params: { phoneNumber: onlyDigits(forgotPhone) } });
      setForgotFlipped(true);
      setTimerLeft(60);
    } catch (e) {
      setError(e?.response?.data?.message || "Couldn't send OTP");
    } finally { setLoading(false); }
  };

  const resendForgotOtp = async () => {
    if (timerLeft > 0) return;
    try {
      await api.post(`/v1/authentication/forgot-password/send-otp`, null, {
        params: { phoneNumber: onlyDigits(forgotPhone), resend: true },
      });
      setTimerLeft(60);
    } catch {
      setError("Failed to resend OTP");
    }
  };

  const verifyForgotOtp = async () => {
    setError("");
    const code = otp.join("");
    if (code.length !== 6) { setError("Enter 6-digit OTP"); return; }
    setLoading(true);
    try {
      await api.post(`/v1/authentication/forgot-password/verify-otp`, null, {
        params: { phoneNumber: onlyDigits(forgotPhone), otp: code },
      });
      setMode("login");
      setIsFlipped(false);
      setLoginPhone(forgotPhone);
      setResetMode(true);
      setTimerLeft(0);
    } catch (e) {
      setError(e?.response?.data?.message || "Invalid OTP");
    } finally { setLoading(false); }
  };

  const logout = () => setAuthToken(null);

  return (
    <AuthContext.Provider
      value={{
        // show/hide form
        showForm, openForm, closeForm, openSignupForm,

        // view + flips
        mode, setMode, isFlipped, setIsFlipped,

        // login
        loginPhone, setLoginPhone, password, setPassword,
        resetMode, setResetMode, newPass, setNewPass, confirmNewPass, setConfirmNewPass,

        // 
        userChat,setUserChat,
        aiChat,setAiChat,

        // signup
        signupPhone, setSignupPhone, signupFlipped, setSignupFlipped,
        signupOtp, setSignupOtp, signupTimerLeft, setSignupTimerLeft,

        // onboarding
        dp, setDp, username, setUserName, gender, setGender, dob, setDob, terms, setTerms,
        UserOnBoarding,

        // forgot
        forgotFlipped, setForgotFlipped, forgotPhone, setForgotPhone,
        otp, setOtp, timerLeft, setTimerLeft,

        // meta
        error, setError, loading,

        // actions
        sendSignupOtp, resendSignupOtp, verifySignupOtp,
        login, startForgot, sendForgotOtp, resendForgotOtp, verifyForgotOtp,

        // misc
        isInDB,

        // token
        token, logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
