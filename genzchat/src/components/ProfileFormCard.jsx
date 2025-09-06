// src/components/ProfileFormCard.jsx
import React, { useContext, useMemo, useState } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Profile form with ONLY:
 * - black bg
 * - top-left & bottom-right corner glows
 * - conic BORDER on the outer wrapper
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

  const canSubmit = useMemo(() =>
    username.trim().length >= 2 &&
    password.length >= 6 &&
    ["MALE", "FEMALE", "OTHER"].includes((gender || "").toUpperCase()) &&
    age >= 13 && age <= 100 &&
    terms
  , [username, password, gender, age, terms]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDob(derivedDob);
    await UserOnBoarding();
  };

  const inputBase =
    "w-full h-10 rounded-xl bg-transparent text-white placeholder:text-gray-400 " +
    "border border-white/10 px-3 outline-none focus:border-white/30 transition";

  return (
    <>
      {/* Self-contained conic BORDER CSS (no inner conic, no shadows) */}
      <style>{`
        @keyframes gzc-aurora-rotate { to { --angle: 360deg; } }

        .gzc-aurora-card {
          position: relative;
          isolation: isolate;
          overflow: visible;           /* allow outer glow */
          border-radius: 12px;         /* match rounded-xl */
          --angle: 0deg;
          --ring1: rgba(139, 92, 246, 0.9);
          --ring2: rgba(96, 165, 250, 0.9);
          --ring-thickness: 2px;
        }
        .gzc-aurora-card::before,
        .gzc-aurora-card::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          background:
            conic-gradient(
              from var(--angle) at 50% 50%,
              transparent 0%,
              transparent 22%,
              var(--ring1) 34%,
              var(--ring2) 55%,
              transparent 72%,
              transparent 100%
            );
          animation: gzc-aurora-rotate 3s linear infinite;
        }
        /* outer soft glow */
        .gzc-aurora-card::before {
          inset: -10px;
          filter: blur(20px);
          opacity: 0.7;
          z-index: 20;
        }
        /* sharp border ring only */
        .gzc-aurora-card::after {
          padding: var(--ring-thickness);
          -webkit-mask:
            linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
                  mask-composite: exclude;
          z-index: 30;
        }
        .gzc-aurora-card:hover {
          --ring1: rgba(139, 92, 246, 1);
          --ring2: rgba(96, 165, 250, 1);
        }
        @media (prefers-reduced-motion: reduce) {
          .gzc-aurora-card::before,
          .gzc-aurora-card::after { animation: none; }
        }
      `}</style>

      <div className="relative min-h-screen w-full flex items-center justify-center p-6">
        {/* OUTER: conic BORDER only; NO shadow */}
        <div
          className="gzc-aurora-card relative rounded-xl w-[316px] min-h-[520px]"
          style={{
            ["--ring1"]: "rgba(139, 92, 246, 0.9)",
            ["--ring2"]: "rgba(96, 165, 250, 0.9)",
            ["--ring-thickness"]: "2px",
          }}
        >
          {/* INNER: pure black bg + corner glows only */}
          <div className="absolute inset-0 rounded-xl p-7 h-full w-full bg-black overflow-hidden z-10">
            {/* Top-left glow */}
            <span
              aria-hidden
              className="pointer-events-none absolute -top-24 -left-24 h-56 w-56 rounded-full blur-3xl opacity-70
                         bg-[radial-gradient(closest-side,rgba(42,202,255,0.28),transparent_85%)]"
            />
            {/* Bottom-right glow */}
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full blur-3xl opacity-70
                         bg-[radial-gradient(closest-side,rgba(126,130,255,0.30),transparent_85%)]"
            />

            {/* Header */}
            <div className="relative z-10 flex flex-col items-center">
              <h1 className="font-semibold text-lg text-white">Complete Your Profile</h1>
              <p className="text-[13px] text-gray-400 mt-1">Just a few details to get started</p>
            </div>

            {/* DP preview (no ring/shadow) */}
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
              <input
                type="text"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Your name"
                className={inputBase}
                required
                minLength={2}
              />
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
                  className={inputBase}
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
                      className="w-14 rounded-md bg-transparent border border-white/10 text-white text-sm px-2 py-1 outline-none focus:border-white/30 text-center"
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
      </div>
    </>
  );
}
