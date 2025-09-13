// src/components/ProfileFormCard.jsx
import React, { useContext, useMemo, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import boy_1 from "../assets/avtar_1.png";
import boy_2 from "../assets/avtar_2.png";
import boy_3 from "../assets/avtar_3.png";
import girl_1 from "../assets/avtar_4.png";
import girl_2 from "../assets/avtar_5.png";
import girl_3 from "../assets/avtar_6.png";

import boy from "../assets/boyy.webp";
import girl from "../assets/girl.webp";
import tog from "../assets/tog.webp";

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

  // <-- FIX 1: allAvatars ki list mein poore 6 avatars hone chahiye -->
  const allAvatars = useMemo(() => [
     girl_1, boy_2, girl_2, boy_3, girl_3
  ], []);

  // Neeche dikhane wale 5 avatars ke liye alag state
  const [selectableAvatars, setSelectableAvatars] = useState([]);

  // Yeh useEffect dp badalne par neeche ki list ko update karega
  useEffect(() => {
    if (dp) {
      setSelectableAvatars(allAvatars.filter(avatarSrc => avatarSrc !== dp));
    }
  }, [dp, allAvatars]);

  // Avatar badalne aur swap karne ke liye function
  const handleAvatarSwap = (clickedAvatarSrc, index) => {
    const oldDp = dp; // Vartaman DP ko save karein

    // 1. Mukhya DP ko naye click kiye gaye avatar par set karein
    setDp(clickedAvatarSrc);

    // 2. Neeche ki list ko update karein:
    const newSelectableList = [...selectableAvatars];
    //    ...jahan se click kiya gaya tha, wahan purana DP daal dein.
    newSelectableList[index] = oldDp;
    setSelectableAvatars(newSelectableList);
  };
  
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit || loading) {
      return;
    }
    
    setDob(derivedDob);
    await UserOnBoarding(derivedDob);
  };

  const inputBase =
    "w-full h-10 rounded-xl bg-transparent text-white placeholder:text-gray-400 " +
    "border border-white/10 px-3 outline-none focus:border-white/30 transition";

  const selectBase =
    "w-full h-10 rounded-xl bg-black text-white " +
    "border border-white/10 px-3 outline-none focus:border-white/30 transition";

  const selectStyles = `
    .gender-select option { background-color: #000000; color: #ffffff; }
    .gender-select option:hover { background-color: #1f1f1f; }
  `;

  return (
    <>
      <div className="relative min-h-screen w-full flex items-center justify-center p-6">
          <div className="relative inline-block isolate">
              <div className="sm:hidden ">
                  <img
                      src={tog}
                      alt="GenZChat support"
                      loading="lazy"
                      className="h-40 w-auto mx-auto md:h-24 drop-shadow-[0_10px_30px_rgba(139,92,246,0.35)]"
                  />
              </div>
              <img
                  src={boy}
                  alt="Support - him"
                  loading="lazy"
                  aria-hidden="true"
                  className="hidden sm:block pointer-events-none select-none absolute right-full -mr-[60px] top-62 md:top-58 h-70 md:h-75 lg:h-68 lg:top-62 w-auto drop-shadow-[0_0px_10px_rgba(59,130,246,0.35)] z-20"
              />
              <img
                  src={girl}
                  alt="Support - her"
                  loading="lazy"
                  aria-hidden="true"
                  className="hidden sm:block pointer-events-none select-none absolute left-full -ml-[60px] top-62 md:top-58 h-70 md:h-75 lg:h-68 lg:top-62 w-auto drop-shadow-[0_0px_10px_rgba(236,72,153,0.35)] z-20"
              />
              <div className="relative overflow-hidden rounded-xl w-[316px] min-h-[520px] z-10">
                <div
                    className="pointer-events-none absolute inset-[-70px] -z-10 bg-[conic-gradient(from_45deg,transparent_45%,#4210be_90%)] opacity-100 transition-opacity duration-300 animate-[spin_8s_ease-in-out_infinite]"
                />
                <div className="absolute inset-[1px] rounded-xl p-7 h-full w-full bg-black overflow-hidden z-10 relative">
                    <span
                    aria-hidden
                    className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full blur-3xl opacity-100 mix-blend-screen bg-[radial-gradient(circle_at_25%_20%,rgba(28,38,122,3)_0%,rgba(28,38,42,0.3)_40%,transparent_65%)]"
                    />
                    <span
                    aria-hidden
                    className="pointer-events-none absolute -bottom-24 -right-20 h-64 w-64 rounded-full blur-3xl opacity-100 mix-blend-screen bg-[radial-gradient(circle_at_80%_75%,rgba(28,38,82,3)_0%,rgba(28,38,42,0.3)_50%,transparent_25%)]"
                    />
                    <div className="relative z-10 flex flex-col items-center">
                    <h1 className="font-semibold text-lg text-white">Complete Your Profile</h1>
                    <p className="text-[13px] text-gray-400 mt-1">Just a few details to get started</p>
                    </div>

                    <div className="relative z-10 mt-4 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full overflow-hidden">
                          {/* <-- FIX 2: Yahan hardcoded 'boy_1' ki jagah 'dp' state ka use karein --> */}
                          <img src={boy_1} alt="avatar" className="w-full h-full object-cover" />
                      </div>
                    </div>

                    <div className="relative z-10 mt-3 grid grid-cols-5 gap-2">
                      {selectableAvatars.map((src, index) => (
                          <button
                              key={src}
                              type="button"
                              onClick={() => handleAvatarSwap(src, index)}
                              className="relative rounded-full overflow-hidden aspect-square transition ring-1 ring-white/15 hover:ring-white/30"
                          >
                              <img src={src} alt="pick" className="w-full h-full object-cover" />
                          </button>
                      ))}
                    </div>

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
                          className={`${selectBase} gender-select`}
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
              <style>{`
                @keyframes spin { to { transform: rotate(360deg) } }
                ${selectStyles}
              `}</style>
          </div>
      </div>
    </>
  );
}