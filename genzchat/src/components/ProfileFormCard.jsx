// src/components/ProfileFormCard.jsx
import React, { useContext, useMemo, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import boy from "../assets/boyy.webp";
import girl from "../assets/girl.webp";
import tog from "../assets/tog.webp";

/**
 * Profile form with:
 * - black bg
 * - corner glows
 * - conic gradient behind card
 * - unified input styles
 * - side avatars (boy/girl) on >= sm
 */
export default function ProfileFormCard() {
  const {
    mode,
    dp, setDp,
    username, setUserName,
    password, setPassword,
    gender, setGender,
    dob, setDob,
    terms, setTerms,
    error, loading,
    UserOnBoarding,
  } = useContext(AuthContext);

  if (mode !== "profile") return null;

  const avatars = [
    "https://i.pravatar.cc/200?img=1",
    "https://i.pravatar.cc/200?img=5",
    "https://i.pravatar.cc/200?img=10",
    "https://i.pravatar.cc/200?img=15",
    "https://i.pravatar.cc/200?img=20",
  ];

  const [age, setAge] = useState(21);

  const derivedDob = useMemo(() => {
    const y = new Date().getFullYear() - age;
    return `${y}-01-01`;
  }, [age]);

  const canSubmit = useMemo(() => {
    const isUsernameValid = username.trim().length >= 2;
    const isPasswordValid = password.length >= 6;
    const isGenderValid = ["MALE", "FEMALE", "OTHER"].includes((gender || "").toUpperCase());
    const isAgeValid = age >= 13 && age <= 100;
    const isTermsAccepted = terms;
    
    return isUsernameValid && isPasswordValid && isGenderValid && isAgeValid && isTermsAccepted;
  }, [username, password, gender, age, terms]);
  const canSubmit = useMemo(
    () =>
      username.trim().length >= 2 &&
      password.length >= 6 &&
      ["MALE", "FEMALE", "OTHER"].includes((gender || "").toUpperCase()) &&
      age >= 13 &&
      age <= 100 &&
      terms,
    [username, password, gender, age, terms]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit || loading) {
      return;
    }
    
    setDob(derivedDob);
    await UserOnBoarding(derivedDob);
  };

  // Unified input look = same as gender select
  const inputBase =
    "w-full h-10 rounded-xl bg-gray-300/10 text-white placeholder:text-gray-400 " +
    "border border-white/10 px-3 outline-none focus:border-white/30 transition";

  const selectBase =
    "w-full h-10 rounded-xl bg-black text-white " +
    "border border-white/10 px-3 outline-none focus:border-white/30 transition";

  // Custom CSS for select options
  const selectStyles = `
    .gender-select option {
      background-color: #000000;
      color: #ffffff;
    }
    .gender-select option:hover {
      background-color: #1f1f1f;
    }
  `;

  return (
    <>
      <div className="relative min-h-screen w-full flex items-center justify-center p-6">
        <div className="relative overflow-hidden rounded-xl w-[316px] min-h-[520px] z-10">
          {/* Animated conic gradient border - same as login page */}
          <div
            className="pointer-events-none absolute inset-[-70px] -z-10
                        bg-[conic-gradient(from_45deg,transparent_45%,#4210be_90%)]
                        opacity-100 transition-opacity duration-300
                        animate-[spin_8s_ease-in-out_infinite]"
          />

          {/* INNER: pure black bg */}
          <div className="absolute inset-[1px] rounded-xl p-7 h-full w-full bg-black overflow-hidden z-10 relative">
            {/* Corner glows */}
            <span
              aria-hidden
              className="pointer-events-none absolute -top-20 -left-20 h-64 w-64
                         rounded-full blur-3xl opacity-100 mix-blend-screen
                         bg-[radial-gradient(circle_at_25%_20%,rgba(28,38,122,3)_0%,rgba(28,38,42,0.3)_40%,transparent_65%)]"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-24 -right-20 h-64 w-64
                         rounded-full blur-3xl opacity-100 mix-blend-screen
                         bg-[radial-gradient(circle_at_80%_75%,rgba(28,38,82,3)_0%,rgba(28,38,42,0.3)_50%,transparent_25%)]"
            />
        {/* Wrapper to anchor side avatars relative to the card */}
        <div className="relative inline-block isolate">
          {/* Mobile (xs) : top image only */}
          <div className="sm:hidden ">
            <img
              src={tog}
              alt="GenZChat support"
              loading="lazy"
              className="h-40 w-auto mx-auto md:h-24 drop-shadow-[0_10px_30px_rgba(139,92,246,0.35)]"
            />
          </div>

          {/* Desktop/Tablet (>= sm): side images */}
          <img
            src={boy}
            alt="Support - him"
            loading="lazy"
            aria-hidden="true"
            className="hidden sm:block pointer-events-none select-none 
                              absolute right-full -mr-[60px] top-62
                               md:top-58 md:h-60
                              h-70 md:h-75 lg:h-68 lg:top-62 w-auto
                              drop-shadow-[0_0px_10px_rgba(59,130,246,0.35)] z-20"
          />
          {/* Right side - girl */}
          <img
            src={girl}
            alt="Support - her"
            loading="lazy"
            aria-hidden="true"
            className="hidden sm:block pointer-events-none select-none
                              absolute left-full -ml-[60px] top-62 md:top-58
                              h-70 md:h-75 lg:h-68 lg:top-62 w-auto
                              drop-shadow-[0_0px_10px_rgba(236,72,153,0.35)] z-20"
          />

          {/* CARD */}
          <div className="relative overflow-hidden rounded-xl w-[316px] min-h-[520px] z-10">
            {/* Conic gradient background — same as LoginPage */}
            <div
              className={`pointer-events-none absolute inset-[-70px] -z-10
                          bg-[conic-gradient(from_45deg,transparent_45%,#4210be_90%)]
                          opacity-100
                          animate-[spin_4s_linear_infinite] blur-md`}
            />

            {/* INNER: pure black bg + corner glows only */}
            <div className="absolute inset-[1px] rounded-xl p-7 h-full w-full backdrop-blur-[90px] bg-black overflow-hidden z-10">
              {/* Top-left glow */}
              <span
                aria-hidden
                className="pointer-events-none absolute -top-20 -left-20 h-64 w-64
                           rounded-full blur-3xl opacity-100 mix-blend-screen
                           bg-[radial-gradient(circle_at_25%_20%,rgba(28,38,122,3)_0%,rgba(28,38,42,0.3)_40%,transparent_65%)]"
              />
              {/* Bottom-right glow */}
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-24 -right-20  h-64 w-64
                           rounded-full blur-3xl opacity-100 mix-blend-screen
                           bg-[radial-gradient(circle_at_80%_75%,rgba(28,38,82,3)_0%,rgba(28,38,42,0.3)_50%,transparent_25%)]"
              />

              {/* Header */}
              <div className="relative z-10 flex flex-col items-center">
                <h1 className="font-semibold text-lg text-white">Complete Your Profile</h1>
                <p className="text-[13px] text-gray-400 mt-1">Just a few details to get started</p>
              </div>

              {/* DP preview */}
              <div className="relative z-10 mt-4 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full overflow-hidden">
                  <img src={dp} alt="avatar" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Avatar picker */}
              <div className="relative z-10 mt-3 grid grid-cols-5 gap-2">
                {avatars.map((src) => {
                  const selected = src === dp;
                  return (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setDp(src)}
                      className={`relative rounded-full overflow-hidden aspect-square transition
                                  ${selected ? "ring-2 ring-white scale-[1.02]" : "ring-1 ring-white/15 hover:ring-white/30"}`}
                    >
                      <img src={src} alt="pick" className="w-full h-full object-cover" />
                      {selected && (
                        <span className="absolute inset-0 border-2 border-white/40 rounded-full pointer-events-none" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="relative z-10 mt-4 space-y-3">
                {/* name */}
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Your name"
                  className={inputBase}
                  required
                  minLength={2}
                />

                {/* password */}
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className={inputBase}
                  required
                  minLength={6}
                />

              <div className="grid grid-cols-2 gap-3">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className={`${selectBase} gender-select`}
                  required
                >
                  <option value="" disabled>Choose</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
                <div className="grid grid-cols-2 gap-3">
                  {/* gender (same style as inputs) */}
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full h-10 rounded-xl bg-gray-300/10 text-white border border-white/10 px-3 outline-none focus:border-white/30 transition"
                    required
                  >
                    <option value="" disabled>Choose</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>

                <div className="rounded-xl px-3 py-2 border border-white/10">
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={13}
                      max={100}
                      value={age}
                      onChange={(e) => setAge(parseInt(e.target.value || "0", 10))}
                      className="w-full accent-white"
                    />
                    <input
                      type="number"
                      min={13}
                      max={100}
                      value={age}
                      onChange={(e) => {
                        const v = Math.max(13, Math.min(100, parseInt(e.target.value || "0", 10)));
                        setAge(Number.isNaN(v) ? 13 : v);
                      }}
                      className="w-14 rounded-md bg-transparent border border-white/10 text-white text-sm px-2 py-1 outline-none focus:border-white/30 text-center"
                    />
                  </div>
                </div>
              </div>
                  {/* age slider + number (boxed like input/select) */}
                  <div className="rounded-xl border border-white/10 bg-gray-300/10 px-3 py-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={18}
                        max={100}
                        value={age}
                        onChange={(e) => setAge(parseInt(e.target.value || "0", 10))}
                        className="w-full accent-white"
                      />
                      <input
                        type="number"
                        min={13}
                        max={100}
                        value={age}
                        onChange={(e) => {
                          const v = Math.max(13, Math.min(100, parseInt(e.target.value || "0", 10)));
                          setAge(Number.isNaN(v) ? 13 : v);
                        }}
                        className="w-14 h-10 rounded-md bg-gray-300/10 border border-white/10 text-white text-sm px-2 outline-none focus:border-white/30 text-center"
                      />
                    </div>
                  </div>
                </div>

                <label className="flex items-center gap-2 text-white/80 text-xs">
                  <input
                    type="checkbox"
                    checked={terms}
                    onChange={(e) => setTerms(e.target.checked)}
                    className="accent-white w-4 h-4 rounded"
                    required
                  />
                  I agree to the <span className="underline">Terms &amp; Conditions</span>
                </label>

                {error && (
                  <div className="text-red-300 text-xs bg-red-900/30 border border-red-500/30 rounded-lg px-3 py-2">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!canSubmit || loading}
                  className={`w-full h-10 rounded-2xl text-sm font-semibold grid place-content-center mt-1 transition
                    ${!canSubmit || loading
                      ? "bg-[#3b3b3b] text-white/60 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-800 to-blue-500 text-white hover:bg-white/25"}`}
                >
                  {loading ? "Saving…" : "Create account"}
                </button>

              <p className="text-[10px] text-white/40 text-center mt-1">
                By continuing, you agree to our Privacy Policy.
              </p>
            </form>
          </div>
        </div>

        {/* Animation keyframes and select styles */}
        <style>{`
          @keyframes spin { to { transform: rotate(360deg) } }
          ${selectStyles}
        `}</style>
                <p className="text-[10px] text-white/40 text-center mt-1">
                  By continuing, you agree to our Privacy Policy.
                </p>
              </form>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          /* Gender select dropdown options background */
          select option, select optgroup {
            background-color: #1f2937; /* bg-gray-800 */
            color: #ffffff;
          }
        `}</style>
      </div>
    </>
  );
}
