// src/components/ProfileFormCard.jsx
import React, { useContext, useMemo, useState } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Renders AFTER OTP verification when mode === "profile"
 */
export default function ProfileFormCard() {
  const {
    // show this form only when mode === "profile"
    mode,

    // profile fields
    dp, setDp,
    username, setUserName,
    password, setPassword,
    gender, setGender,
    dob, setDob, // we'll set this from age as YYYY-01-01
    terms, setTerms,

    // status + action
    error, loading,
    UserOnBoarding,
  } = useContext(AuthContext);

  // render nothing unless we've reached the profile step
  if (mode !== "profile") return null;

  // ── Avatar choices (5)
  const avatars = [
    "https://i.pravatar.cc/200?img=1",
    "https://i.pravatar.cc/200?img=5",
    "https://i.pravatar.cc/200?img=10",
    "https://i.pravatar.cc/200?img=15",
    "https://i.pravatar.cc/200?img=20",
  ];

  // ── Age state → convert to dob for backend on submit
  const [age, setAge] = useState(21);

  const derivedDob = useMemo(() => {
    const y = new Date().getFullYear() - age;
    return `${y}-01-01`;
  }, [age]);

  const canSubmit = useMemo(() => {
    return (
      username.trim().length >= 2 &&
      password.length >= 6 &&
      ["MALE", "FEMALE", "OTHER"].includes((gender || "").toUpperCase()) &&
      age >= 13 &&
      age <= 100 &&
      terms
    );
  }, [username, password, gender, age, terms]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // push derived dob to context just before submit
    setDob(derivedDob);
    await UserOnBoarding();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-neutral-900 p-6">
      <div className="relative bg-[#272727] rounded-3xl w-[340px] p-5 shadow-[0_6px_16px_rgba(0,0,0,0.35)]">
        {/* Header */}
        <h2 className="text-white text-xl font-semibold text-center">Complete your profile</h2>
        <p className="text-white/60 text-xs text-center mt-1">
          Pick an avatar, set your details, and you’re in.
        </p>

        {/* Big DP preview */}
        <div className="mt-4 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-white/20 shadow-md">
            <img src={dp} alt="avatar" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Avatar picker (5 options) */}
        <div className="mt-3 grid grid-cols-5 gap-2">
          {avatars.map((src) => {
            const selected = src === dp;
            return (
              <button
                key={src}
                type="button"
                onClick={() => setDp(src)}
                className={`relative rounded-xl overflow-hidden aspect-square ring-1 transition ${
                  selected ? "ring-white ring-2 scale-[1.02]" : "ring-white/15 hover:ring-white/30"
                }`}
              >
                <img src={src} alt="pick" className="w-full h-full object-cover" />
                {selected && (
                  <span className="absolute inset-0 border-2 border-white/70 rounded-xl pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          {/* Name */}
          <div>
            <label className="block text-white text-sm mb-1">Name</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-xl bg-[#3a3a3a] text-white text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-white"
              required
              minLength={2}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-white text-sm mb-1">Set password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full rounded-xl bg-[#3a3a3a] text-white text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-white"
              required
              minLength={6}
            />
          </div>

          {/* Gender + Age row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-white text-sm mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-xl bg-[#3a3a3a] text-white text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-white"
                required
              >
                <option value="" disabled>
                  Choose
                </option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Age selector */}
            <div>
              <label className="block text-white text-sm mb-1">Age</label>
              <div className="rounded-xl bg-[#3a3a3a] px-3 py-2">
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={13}
                    max={100}
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value || "0", 10))}
                    className="w-full"
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
                    className="w-14 rounded-md bg-[#2f2f2f] text-white text-sm px-2 py-1 outline-none ring-1 ring-white/15 focus:ring-white/40 text-center"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Terms */}
          <label className="flex items-center gap-2 text-white/80 text-xs">
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              className="accent-white w-4 h-4 rounded"
              required
            />
            I agree to the <span className="underline">Terms & Conditions</span>
          </label>

          {/* Error */}
          {error && (
            <div className="text-red-300 text-xs bg-red-900/30 border border-red-500/30 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!canSubmit || loading}
            className={`w-full h-10 rounded-2xl text-sm font-semibold grid place-content-center mt-1 transition shadow-[inset_0px_3px_6px_-4px_rgba(255,255,255,0.6),inset_0px_-3px_6px_-2px_rgba(0,0,0,0.8)] ${
              !canSubmit || loading
                ? "bg-[#3b3b3b] text-white/60 cursor-not-allowed"
                : "bg-[#373737] text-white hover:bg-[rgba(255,255,255,0.25)] hover:shadow-[inset_0px_3px_6px_rgba(255,255,255,0.6),inset_0px_-3px_6px_rgba(0,0,0,0.8),0_0_8px_rgba(255,255,255,0.05)]"
            }`}
          >
            {loading ? "Saving…" : "Create account"}
          </button>

          <p className="text-[10px] text-white/40 text-center mt-1">
            By continuing, you agree to our Privacy Policy.
          </p>
        </form>
      </div>
    </div>
  );
}
