// src/components/AuthUI.jsx
import React, { useRef, useEffect, useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import ProfileFormCard from "../components/ProfileFormCard";
import mess from "../assets/mess.webp";
import forgot from "../assets/pass-icon.webp";
import signupp from "../assets/sicon.webp";
import { ChatProvider } from "../context/ChatContext";
import EvolvingText from "../components/EvolvingText";
import ChatPAge from "./ChatPAge";


export default function LoginPage() {
  const {
    showForm, closeForm, openForm,
    // view + flips
    mode, setMode, isFlipped, setIsFlipped,
    // login
    loginPhone, setLoginPhone, password, setPassword,
    resetMode, newPass, setNewPass, confirmNewPass, setConfirmNewPass,
    // signup
    signupPhone, setSignupPhone, signupFlipped, setSignupFlipped,
    signupOtp, setSignupOtp, signupTimerLeft,
    // forgot
    forgotFlipped, setForgotFlipped, forgotPhone, setForgotPhone,
    otp, setOtp, timerLeft,
    // meta
    error, setError, loading,
    // actions
    sendSignupOtp, resendSignupOtp, verifySignupOtp,
    login, startForgot, sendForgotOtp, verifyForgotOtp, resendForgotOtp,
    // misc
    isInDB,
  } = useContext(AuthContext);

  // dont reset mode after refres

  

  // Rotating-Text
  const evolvingTexts = [
    "Start Your Dating Evolution",
    "Find Your Perfect Match",
    "Don't Worry More",
  ];
  const [evolvingIndex, setEvolvingIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setEvolvingIndex((prev) => (prev + 1) % evolvingTexts.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);


  // flipped timer

  // --- 1s delayed visual flips + pre-flip scale ---
  const [delayedIsFlipped, setDelayedIsFlipped] = useState(isFlipped);
  const [delayedSignupFlipped, setDelayedSignupFlipped] = useState(signupFlipped);
  const [delayedForgotFlipped, setDelayedForgotFlipped] = useState(forgotFlipped);

  useEffect(() => {
    const t = setTimeout(() => setDelayedIsFlipped(isFlipped), 600);
    return () => clearTimeout(t);
  }, [isFlipped]);

  useEffect(() => {
    const t = setTimeout(() => setDelayedSignupFlipped(signupFlipped), 600);
    return () => clearTimeout(t);
  }, [signupFlipped]);

  useEffect(() => {
    const t = setTimeout(() => setDelayedForgotFlipped(forgotFlipped), 600);
    return () => clearTimeout(t);
  }, [forgotFlipped]);

  // scale while we're *waiting* to flip (the 1s window)
  const preMainFlip = isFlipped !== delayedIsFlipped;
  const preSignupFlip = signupFlipped !== delayedSignupFlipped;
  const preForgotFlip = forgotFlipped !== delayedForgotFlipped;




  // container height
  const containerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(480);
  const activeCardId = mode === 'forgot' ? 'forgot-card' : (isFlipped ? 'signup-card' : 'login-card');

  useEffect(() => {
    const measure = () => {
      const el = document.querySelector(`#${activeCardId} form`) || document.getElementById(activeCardId);
      if (!el) return;
      const h = el.scrollHeight + 24; // include some padding
      setContainerHeight(Math.max(360, h));
    };
    measure();
    const ro = new ResizeObserver(measure);
    const target = document.querySelector(`#${activeCardId} form`) || document.getElementById(activeCardId);
    if (target) ro.observe(target);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, [activeCardId, evolvingIndex, error, loading, resetMode, loginPhone, password, newPass, confirmNewPass, signupPhone, forgotPhone, signupOtp, otp, timerLeft, signupTimerLeft]);

  // Gradient visibility management
  const [hideGradient, setHideGradient] = useState(false);
  const [gradientCountdown, setGradientCountdown] = useState(0);
  const outerFlipRef = useRef(null);
  const signupStepFlipRef = useRef(null);
  const forgotFlipRef = useRef(null);
  const mountedRef = useRef(false);

  // Countdown timer for gradient reappearance
  useEffect(() => {
    let countdownInterval;
    if (gradientCountdown > 0) {
      countdownInterval = setInterval(() => {
        setGradientCountdown(prev => {
          if (prev <= 1) {
            setHideGradient(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(countdownInterval);
  }, [gradientCountdown]);

  // Hide gradient on any button/link click
  useEffect(() => {
    const handleClick = (e) => {
      // Check if the click is on a button or link
      if (e.target.tagName === 'BUTTON' ||
        e.target.tagName === 'A' ||
        e.target.closest('button') ||
        e.target.closest('a')) {
        setHideGradient(true);
        setGradientCountdown(1); // Start 3-second countdown
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Hide gradient during transitions
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }

    // Hide gradient when any flip starts
    setHideGradient(true);
    setGradientCountdown(1); // Start 3-second countdown

    // Set up transition end listeners
    const els = [outerFlipRef.current, signupStepFlipRef.current, forgotFlipRef.current].filter(Boolean);
    let ended = false;

    const onTransitionEnd = (e) => {
      if (e.propertyName !== "transform") return;
      ended = true;
    };

    els.forEach(el => {
      if (el) el.addEventListener("transitionend", onTransitionEnd);
    });

    // Fallback in case transitionend doesn't fire
    const timeoutId = setTimeout(() => {
      if (!ended) {
        // Gradient will be shown after countdown completes
      }
    }, 1000);

    return () => {
      els.forEach(el => {
        if (el) el.removeEventListener("transitionend", onTransitionEnd);
      });
      clearTimeout(timeoutId);
    };
  }, [isFlipped, signupFlipped, forgotFlipped]);

  const showGradient = showForm && !hideGradient;

  const passwordRef = useRef(null);

  // ---- handlers ----
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    await login();
  };

  const handleSendOtpSignup = async (e) => {
    e.preventDefault();
    setError("");
    await sendSignupOtp();
  };

  const handleVerifyOtpSignup = async (e) => {
    e.preventDefault();
    setError("");
    await verifySignupOtp();
  };

  const handleSignupOtpChange = (index, value) => {
    const isDigit = value === "" || (value.length === 1 && value >= "0" && value <= "9");
    if (!isDigit) return;
    const next = [...signupOtp]; next[index] = value; setSignupOtp(next);
    const nextInput = document.querySelector(`#signup-otp-${index + 1}`);
    if (value && nextInput) nextInput.focus();
  };

  const handleSignupOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !signupOtp[index]) {
      const prevInput = document.querySelector(`#signup-otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleOtpChange = (index, value) => {
    const isDigit = value === "" || (value.length === 1 && value >= "0" && value <= "9");
    if (!isDigit) return;
    const next = [...otp]; next[index] = value; setOtp(next);
    const nextInput = document.querySelector(`#forgot-otp-${index + 1}`);
    if (value && nextInput) nextInput.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index]) {
      const prevInput = document.querySelector(`#forgot-otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSendOtpForgot = async (e) => {
    e.preventDefault();
    setError("");
    await sendForgotOtp();
  };

  if (!showForm) return null;

  // Shared classes
  const phoneWrapperClass = `w-full flex items-center gap-2 backdrop-blur-[60px] rounded-xl px-1 py-1 text-white
    border border-white/10 transition focus-within:ring-1 focus-within:ring-[#8B5CF6]
    focus-within:shadow-[0_0_50px_rgba(139,92,246,0.5)]
    [&_.react-international-phone-input]:!bg-transparent
    [&_.react-international-phone-input]:!py-1
    [&_.react-international-phone-input]:!text-white
    [&_.react-international-phone-input]:!text-[15px]
    [&_.react-international-phone-input]:!placeholder:text-gray-400
    [&_.react-international-phone-country-selector-button]:!bg-transparent
    [&_.react-international-phone-input-container_.react-international-phone-country-selector-button]:!border-none
    [&_.react-international-phone-country-selector-button]:!text-white
[&_.react-international-phone-country-selector-button]:!border-l
[&_.react-international-phone-country-selector-button]:!border-l-2
[&_.react-international-phone-country-selector-button]:!border-l-gray-300
[&_.react-international-phone-input-container .react-international-phone-country-selector-button]:!border-none

    [&_.react-international-phone-country-selector-button:focus]:!bg-[#3a3a3a]
    [&_.react-international-phone-country-selector-button.react-international-phone-country-selector-button--open]:!bg-[#3a3a3a]
    [&_.react-international-phone-country-selector-dropdown]:!bg-[#2f2f2f]
    [&_.react-international-phone-country-selector-dropdown]:!w-50
    [&_.react-international-phone-country-selector-dropdown]:!h-35
    [&_.react-international-phone-country-selector-dropdown]:!text-white
    [&_.react-international-phone-country-selector-option]:!text-white
    [&_.react-international-phone-country-selector-option--highlighted]:!bg-zinc-700`;

  const inputBase = "w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none text-sm focus:ring-1 focus:ring-[#8B5CF6] focus:shadow-[0_0_40px_rgba(139,92,246,0.45)]";
  const primaryBtn = "w-full h-10 rounded-2xl text-sm font-semibold grid place-content-center bg-gradient-to-r from-purple-800 to-blue-500 text-white transition mt-1 hover:bg-white/25 disabled:opacity-60 disabled:cursor-not-allowed";
  const subtleBtn = "w-full h-10 rounded-2xl text-sm font-semibold grid place-content-center bg-[#373737] text-white transition mt-1 hover:bg-white/25";

  // ---------- Cards ----------
  const GlowDecor = () => (
    <>
      {/* Glow — top-left */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-20 -left-20 h-64 w-64
                   rounded-full blur-3xl opacity-100 mix-blend-screen
                   bg-[radial-gradient(circle_at_25%_20%,rgba(28,38,122,3)_0%,rgba(28,38,42,0.3)_40%,transparent_65%)]"
      />

      {/* Glow — bottom-right */}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-20  h-64 w-64
                   rounded-full blur-3xl opacity-100 mix-blend-screen
                   bg-[radial-gradient(circle_at_80%_75%,rgba(28,38,82,3)_0%,rgba(28,38,42,0.3)_50%,transparent_25%)]"
      />
    </>
  );

  const LoginCard = (
    <div className="absolute inset-0 rounded-xl p-7 h-full w-full [backface-visibility:hidden]  backdrop-blur-[90px]  bg-black overflow-hidden">
      <GlowDecor />
      <button
        type="button"
        onClick={closeForm}
        aria-label="Close"
        className="group absolute top-3 left-3 z-20"
      >
        <span className="relative grid place-items-center w-9 h-9 rounded-full bg-white/0 backdrop-blur-[30px] border border-white/10">
          <span className="absolute inset-[-2px] rounded-full bg-black/10 blur-[4px] opacity-70 group-hover:opacity-95 transition" />
          <span className="relative text-lg leading-none font-extrabold text-[#8B5CF6]">!</span>
        </span>
      </button>

      <form onSubmit={handleLogin} className="flex flex-col justify-center items-center gap-3 h-full">
        {/* Brand + evolving text */}
        <h1 className="font-bold text-xl text-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 bg-clip-text">GenZChat</h1>
        <div className="mb-1 px-3 rounded-2xl bg-gray-700/10  ">
          <EvolvingText
            texts={evolvingTexts}
            interval={2500}
            fadeDuration={500}
            className="font-semibold text-gray-500  text-[15px] transition-opacity duration-500 [text-shadow:0_0_16px_rgba(139,92,246,0.35)]"
          />
          {/* <h2 className="font-semibold text-gray-500  text-[15px] transition-opacity duration-500 [text-shadow:0_0_16px_rgba(139,92,246,0.35)]">
            {evolvingTexts[evolvingIndex]}
            </h2> */}
        </div>
        <img src={mess} alt="messenger" className="w-[35px] h-[40px]" />
        <span className="w-full text-center text-2xl font-bold py-1.5 text-white">{resetMode ? "Reset & Login" : "Welcome Back!"}</span>

        {/* Phone */}
        <div className={phoneWrapperClass}>
          <PhoneInput
            inputClassName="!bg-transparent !text-white placeholder:!text-gray-400 !border-transparent !outline-none !shadow-none"
            defaultCountry="in"
            value={loginPhone}
            onChange={setLoginPhone}
            forceDialCode
            disabled={resetMode}
          />
        </div>

        {!resetMode ? (
          <input
            type="password"
            placeholder="Password"
            value={password}
            ref={passwordRef}
            onChange={(e) => setPassword(e.target.value)}
            className={inputBase}
            required
          />
        ) : (
          <>
            <input
              type="password"
              placeholder="Enter New Password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className={inputBase}
              required
              minLength={6}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmNewPass}
              onChange={(e) => setConfirmNewPass(e.target.value)}
              className={inputBase}
              required
              minLength={6}
            />
          </>
        )}

        <button type="submit" disabled={loading} className="py-3 w-full h-10 rounded-2xl text-sm font-semibold grid place-content-center bg-gradient-to-r from-purple-800 to-blue-500 text-white transition mt-1 hover:bg-white/25">
          {resetMode ? "Reset & Sign In" : loading ? "Signing in..." : "Sign In"}
        </button>

        {error && <p className="text-xs text-red-300 mt-1">{error}</p>}

        {!resetMode && (
          <p className="w-full text-left text-[rgba(255,255,255,0.7)] text-xs leading-5">
            {isInDB ? (
              <>
                New user?{" "}
                <button
                  type="button"
                  onClick={() => { setIsFlipped(true); setMode("login"); }}
                  className="font-semibold underline hover:text-white"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Number not found.{" "}
                <button
                  type="button"
                  onClick={() => { setIsFlipped(true); setMode("login"); }}
                  className="font-semibold underline hover:text-white"
                >
                  Create an account
                </button>
              </>
            )}
            <br />
            <button
              type="button"
              onClick={() => { startForgot(); }}
              className="underline font-semibold hover:text-white"
            >
              Forgot password?
            </button>
          </p>
        )}
      </form>
    </div>
  );

  const SignupCard = (
    <div
      className="absolute inset-0 rounded-xl p-7 h-full w-full [backface-visibility:hidden] [transform:rotateY(180deg)] backdrop-blur-[25px] bg-black overflow-hidden"
    >
      <GlowDecor />

      {/* Close button */}
      <button
        type="button"
        onClick={() => { setIsFlipped(false); setMode('login'); }}
        aria-label="Close"
        className="group absolute top-3 left-3 z-20"
      >
        <span className="relative grid place-items-center w-9 h-9 rounded-full bg-white/0 backdrop-blur-[30px] border border-white/10">
          <span className="absolute inset-[-2px] rounded-full bg-black/10 blur-[4px] opacity-70 group-hover:opacity-95 transition" />
          <span className="relative text-lg leading-none font-extrabold text-[#8B5CF6]">!</span>
        </span>
      </button>

      <div
        ref={signupStepFlipRef}
        className={`relative z-10 h-full w-full [transform-style:preserve-3d] transition-transform duration-700 ease-in-out ${signupFlipped ? "[transform:rotateY(180deg)]" : ""}`}
      >
        {/* Step 1: phone */}
        <form onSubmit={handleSendOtpSignup} className="absolute inset-0 flex flex-col justify-center items-center gap-3 [backface-visibility:hidden]">
          <h1 className="font-bold text-xl text-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 bg-clip-text">GenZChat</h1>
          <div className="mb-1 px-3 rounded-2xl bg-gray-700/10  ">
            <h2 className="font-semibold text-gray-500  text-[15px] transition-opacity duration-500 [text-shadow:0_0_16px_rgba(139,92,246,0.35)]">{evolvingTexts[evolvingIndex]}</h2>
          </div>
          <img src={signupp} alt="messenger" className="w-[65px] h-[65px]" />
          <span className="w-full text-center font-bold py-1.5 text-gray-300">Start Your Dating Evolution</span>

          <div className={phoneWrapperClass}>
            <PhoneInput
              defaultCountry="in"
              value={signupPhone}
              onChange={setSignupPhone}
              inputProps={{ name: "signupPhone", autoComplete: "tel", required: true }}
              inputClassName="!bg-transparent !text-white placeholder:!text-white/50 !border-transparent !outline-none !shadow-none"
              className="signup-phone"
              forceDialCode
            />
          </div>

          <button type="submit" disabled={loading} className={primaryBtn}>
            {loading ? "Sending..." : "Send OTP"}
          </button>

          <p className="w-full text-left text-[rgba(255,255,255,0.7)] text-xs">
            Already a user?
            <button
              type="button"
              onClick={() => { setIsFlipped(false); setMode('login'); }}
              className="font-semibold underline ml-1 hover:text-white"
            >
              Please login
            </button>
          </p>
        </form>

        {/* Step 2: verify */}
        <form
          onSubmit={handleVerifyOtpSignup}
          onKeyDown={(e) => { if (e.key === "Enter" && signupOtp.join("").length < 6) e.preventDefault(); }}
          className="absolute inset-0 flex flex-col justify-center items-center gap-3 [backface-visibility:hidden] [transform:rotateY(180deg)]"
        >
          <span className="w-full text-center text-2xl font-bold py-1.5 text-white">Verify OTP</span>

          <div className="flex gap-2">
            {signupOtp.map((d, i) => (
              <input
                key={i}
                id={`signup-otp-${i}`}
                value={d}
                onChange={(e) => handleSignupOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleSignupOtpKeyDown(i, e)}
                inputMode="numeric"
                maxLength={1}
                className="w-9 h-10 text-center rounded-lg bg-transparent backdrop-blur-3xl text-white outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:shadow-[0_0_35px_rgba(139,92,246,0.45)]"
              />
            ))}
          </div>

          <div className="text-xs text-white/80">
            Didn't get the code?{" "}
            <button
              type="button"
              onClick={resendSignupOtp}
              disabled={signupTimerLeft > 0}
              className={`underline font-semibold ${signupTimerLeft > 0 ? "opacity-50 cursor-not-allowed" : "hover:text-white"}`}
            >
              {signupTimerLeft > 0 ? `Resend OTP (${signupTimerLeft}s)` : "Resend OTP"}
            </button>
          </div>

          <button type="submit" disabled={loading} className={subtleBtn}>
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>

          <button type="button" onClick={() => { setSignupFlipped(false); }} className="text-xs underline text-white/80 hover:text-white">
            Edit number
          </button>
        </form>
      </div>
    </div>
  );

  const ForgotCard = (
    <div className="absolute inset-0 rounded-xl p-7 h-full w-full [transform-style:preserve-3d] backdrop-blur-[25px] bg-black overflow-hidden">
      <GlowDecor />
      <div
        ref={forgotFlipRef}
        className={`absolute inset-0 transition-transform duration-700 ease-in-out [transform-style:preserve-3d] ${forgotFlipped ? "[transform:rotateY(180deg)]" : ""}`}
      >
        {/* Step 1 */}
        <div className="absolute inset-0 rounded-xl p-2 h-full w-full [backface-visibility:hidden]">
          <button
            type="button"
            onClick={() => { setIsFlipped(false); setMode('login'); }}
            aria-label="Close"
            className="group absolute top-3 left-3 z-20"
          >
            <span className="relative grid place-items-center w-9 h-9 rounded-full bg-white/0 backdrop-blur-[30px] border border-white/10">
              <span className="absolute inset-[-2px] rounded-full bg-black/10 blur-[4px] opacity-70 group-hover:opacity-95 transition" />
              <span className="relative text-lg leading-none font-extrabold text-[#8B5CF6]">!</span>
            </span>
          </button>
          <form onSubmit={handleSendOtpForgot} className="flex flex-col justify-center items-center gap-3 h-full">
            <h1 className="font-bold text-xl text-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 bg-clip-text">Forgot PassWord ?</h1>
            <div className="mb-1 px-3 rounded-2xl bg-gray-700/10  ">
              <h2 className="font-semibold text-gray-500  text-[15px] transition-opacity duration-500 [text-shadow:0_0_16px_rgba(139,92,246,0.35)]">{evolvingTexts[evolvingIndex]}</h2>
            </div>
            <img src={forgot} alt="messenger" className="w-[55px] h-[50px]" />
            <span className="w-full text-center font-bold py-1.5 text-gray-700 ">Don't Worry 'GenZChat' Here </span>

            <div className={phoneWrapperClass}>
              <PhoneInput
                inputClassName="!bg-transparent !text-white placeholder:!text-gray-400 !border-transparent !outline-none !shadow-none"
                defaultCountry="in"
                value={forgotPhone}
                onChange={setForgotPhone}
                inputProps={{ name: "forgotPhone", autoComplete: "tel", required: true }}
                forceDialCode
              />
            </div>

            <button type="submit" disabled={loading} className={primaryBtn}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
            <button type="button" onClick={() => { setMode("login"); setIsFlipped(false); }} className="text-xs underline text-white/80 hover:text-white">
              Back to login
            </button>
          </form>
        </div>

        {/* Step 2 */}
        <div className="absolute inset-0 rounded-xl p-2 h-full w-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <form
            onSubmit={verifyForgotOtp}
            onKeyDown={(e) => { if (e.key === "Enter" && otp.join("").length < 6) e.preventDefault(); }}
            className="flex flex-col justify-center items-center gap-3 h-full"
          >
            <span className="w-full text-center text-2xl font-bold py-1.5 text-white">Verify OTP</span>
            <div className="flex gap-2">
              {otp.map((d, i) => (
                <input
                  key={i}
                  id={`forgot-otp-${i}`}
                  value={d}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  inputMode="numeric"
                  maxLength={1}
                  className="w-9 h-10 text-center rounded-lg bg-[#3a3a3a] text-white outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:shadow-[0_0_35px_rgba(139,92,246,0.45)]"
                />
              ))}
            </div>

            <div className="text-xs text-white/80">
              Didn't get the code?{" "}
              <button
                type="button"
                onClick={resendForgotOtp}
                disabled={timerLeft > 0}
                className={`underline font-semibold ${timerLeft > 0 ? "opacity-50 cursor-not-allowed" : "hover:text-white"}`}
              >
                {timerLeft > 0 ? `Resend OTP (${timerLeft}s)` : "Resend OTP"}
              </button>
            </div>

            <button type="submit" disabled={loading} className={subtleBtn}>
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>

            <button type="button" onClick={() => { setForgotFlipped(false); }} className="text-xs underline text-white/80 hover:text-white">
              Edit number
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  // ---------- Main render ----------
  if (mode === "profile") return <ProfileFormCard />;
  if (mode === "chat-page") {
    return (
      <ChatProvider>
        <ChatPAge />
      </ChatProvider>
    );
  }
  return (
    <>
      <div className="min-h-screen w-full flex items-center justify-center 0 p-6 ">
        <div
          ref={containerRef}
          className="relative overflow-hidden rounded-xl w-[316px] z-10 transition-[height] duration-300"
          style={{ height: containerHeight }}
        >
          {/* Conic gradient background — hidden during flips */}
          <div
            className={`pointer-events-none absolute inset-[-70px] -z-10
                        bg-[conic-gradient(from_45deg,transparent_45%,#4210be_90%)]
                        ${showGradient ? "opacity-100" : "opacity-0"}
                        transition-opacity duration-300
                        animate-[spin_8s_ease-in-out_infinite]`}
          />

          {/* Countdown display */}


          {mode !== "forgot" ? (
            <div
              ref={outerFlipRef}
              className={`absolute inset-[1px] z-10 p-4 [transform-style:preserve-3d]
              transition-transform duration-700 ease-in-out
              ${preMainFlip ? "scale-[0.98]" : ""}
              ${delayedIsFlipped ? "[transform:rotateY(180deg)]" : ""}`}
            >

              {LoginCard}
              {SignupCard}
            </div>
          ) : (
            <div className="absolute inset-[1px] z-10 p-4 [transform-style:preserve-3d]">
              {ForgotCard}
            </div>
          )}

          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </div>
    </>
  );
}

// background: radial-gradient(circle at 0% 0%, rgba(87, 205, 255, 0.41), rgba(87, 205, 255, 0) 21%),
// linear-gradient(to bottom right, rgba(30, 41, 59, 1), rgba(30, 41, 59, 1));