// import React from "react";

// const HeroSection = () => {
//   return (
//     <section className="min-h-screen bg-[#07080a] text-white flex items-center">
//       {/* Inline styles for gradient animation and minor helpers */}
//       <style>{`
//         @keyframes gradientShift {
//           0% { background-position: 0% 50% }
//           50% { background-position: 100% 50% }
//           100% { background-position: 0% 50% }
//         }
//         .animate-gradient {
//           background-size: 300% 300%;
//           animation: gradientShift 6s linear infinite;
//         }
//       `}</style>

//       <div className="container mx-auto px-6 py-16">
//         <div className="grid grid-cols-12 gap-10 items-center">
//           {/* LEFT: Headline + text + CTAs */}
//           <div className="col-span-12 lg:col-span-7">
//             <div className="max-w-xl">
//               <h1 className="text-4xl md:text-6xl lg:text-[64px] font-extrabold leading-tight mb-6">
//                 <span className="block">Never Run Out of</span>
//                 <span
//                   className="block text-transparent bg-clip-text isolate
//                              animate-gradient
//                              bg-gradient-to-r from-cyan-400 via-rose-500 to-violet-500
//                              "
//                   style={{ backgroundSize: "300% 300%" }}
//                 >
//                   Perfect Replies
//                 </span>
//               </h1>

//               <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-xl">
//                 AI-powered dating assistant that analyzes your conversations and suggests the perfect replies to keep the spark alive. Screenshot or type your chat, get instant witty, flirty, or casual responses.
//               </p>

//               <div className="flex items-center gap-4">
//                 {/* Try Now Free button */}
//                 <button
//                   className="relative inline-flex items-center gap-3 px-6 py-3 rounded-full text-white font-semibold
//                              bg-gradient-to-r from-cyan-400 to-violet-500
//                              shadow-[0_10px_40px_rgba(79,70,229,0.18)]
//                              hover:scale-[1.02] transition-transform duration-200"
//                 >
//                   {/* rocket icon-ish */}
//                   <span className="inline-flex w-7 h-7 rounded-full bg-white/10 items-center justify-center">
//                     🚀
//                   </span>
//                   Try Now Free
//                 </button>

//                 {/* Watch Demo */}
//                 <button
//                   className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 text-white/90 
//                              bg-black/40 backdrop-blur-sm"
//                 >
//                   <span className="inline-flex w-7 h-7 rounded-full bg-white/5 items-center justify-center">
//                     ▶
//                   </span>
//                   Watch Demo
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT: Chat mockup */}
//           <div className="col-span-12 lg:col-span-5 flex justify-end">
//             <div className="relative w-[420px] max-w-full">
//               {/* soft glow behind card */}
//               <div className="absolute -inset-6 rounded-2xl blur-3xl opacity-30 pointer-events-none"
//                    style={{
//                      background:
//                        "radial-gradient(closest-side, rgba(99,102,241,0.18), rgba(124,58,237,0.06) 40%, transparent 60%)",
//                    }} />

//               <div className="relative bg-[#0b0c10] border border-white/6 rounded-2xl p-5 shadow-[0_8px_60px_rgba(2,6,23,0.6)]">
//                 {/* top avatar + status */}
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-yellow-300 flex items-center justify-center text-black font-semibold">S</div>
//                     <div>
//                       <div className="text-sm font-semibold">Sarah</div>
//                       <div className="text-xs text-green-400/80">Online</div>
//                     </div>
//                   </div>
//                   <div className="w-6 h-6 rounded bg-cyan-400/80"></div>
//                 </div>

//                 {/* chat bubbles */}
//                 <div className="space-y-3 mb-4">
//                   <div className="flex justify-end">
//                     <div className="bg-cyan-400 text-black px-4 py-2 rounded-2xl rounded-br-none max-w-[70%]">
//                       Hey! How was your weekend?
//                     </div>
//                   </div>

//                   <div className="flex justify-start">
//                     <div className="bg-[#15151a] text-gray-200 px-4 py-2 rounded-2xl rounded-bl-none max-w-[72%]">
//                       Amazing! Went hiking and tried that new café you mentioned. What about you?
//                     </div>
//                   </div>

//                   <div className="flex justify-end">
//                     <div className="bg-cyan-400 text-black px-4 py-2 rounded-2xl rounded-br-none max-w-[70%]">
//                       Nice! I spent it binge-watching Netflix 😅
//                     </div>
//                   </div>
//                 </div>

//                 <div className="border-t border-white/6 pt-4 mt-3">
//                   <div className="text-xs text-gray-400 flex items-center gap-2 mb-3">
//                     <svg width="12" height="12" viewBox="0 0 24 24" className="opacity-80"><path fill="currentColor" d="M12 2L3 7v6c0 5 3 9 9 9s9-4 9-9V7l-9-5z"></path></svg>
//                     AI Suggested Replies
//                   </div>

//                   {/* suggested replies list */}
//                   <div className="space-y-3">
//                     {/* item 1 */}
//                     <div className="rounded-xl p-3 border border-transparent"
//                          style={{
//                            background: "linear-gradient(180deg, rgba(10,15,30,0.65), rgba(10,15,30,0.45))",
//                          }}>
//                       <div className="p-3 rounded-lg border-[1px] border-transparent"
//                            style={{
//                              background: "linear-gradient(90deg, rgba(20,20,40,0.14), rgba(60,10,50,0.04))",
//                              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.02)",
//                            }}>
//                         <div className="flex items-start gap-3">
//                           <div className="flex-1">
//                             <div className="text-sm text-gray-200">
//                               "At least you were productive in the relaxation department!"
//                             </div>
//                           </div>
//                           <div className="text-sm">👍</div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* item 2 with pink border */}
//                     <div className="rounded-xl p-3"
//                          style={{
//                            background:
//                              "linear-gradient(180deg, rgba(15,6,23,0.65), rgba(15,6,23,0.45))",
//                          }}>
//                       <div className="p-3 rounded-lg border-[1px] border-transparent"
//                            style={{
//                              background: "linear-gradient(90deg, rgba(255,20,147,0.06), rgba(124,58,237,0.03))",
//                            }}>
//                         <div className="flex items-start gap-3">
//                           <div className="flex-1">
//                             <div className="text-sm text-gray-200">
//                               "Netflix and chill level expert, I see. What's your recommendation?"
//                             </div>
//                           </div>
//                           <div className="text-sm">🍿</div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* item 3 */}
//                     <div className="rounded-xl p-3"
//                          style={{
//                            background:
//                              "linear-gradient(180deg, rgba(10,12,18,0.6), rgba(10,12,18,0.4))",
//                          }}>
//                       <div className="p-3 rounded-lg border-[1px] border-transparent"
//                            style={{
//                              background: "linear-gradient(90deg, rgba(99,102,241,0.04), rgba(236,72,153,0.03))",
//                            }}>
//                         <div className="flex items-start gap-3">
//                           <div className="flex-1">
//                             <div className="text-sm text-gray-200">
//                               "Perfect excuse to check out another café together next weekend?"
//                             </div>
//                           </div>
//                           <div className="text-sm">☕️</div>
//                         </div>
//                       </div>
//                     </div>

//                   </div>
//                 </div>

//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* decorative floating dots */}
//       <div className="pointer-events-none">
//         <div className="absolute left-8 top-2 w-2 h-2 rounded-full bg-cyan-400/60 blur-sm" />
//         <div className="absolute right-8 bottom-20 w-2 h-2 rounded-full bg-blue-400/60 blur-sm" />
//       </div>
//     </section>
//   );
// };

// export default HeroSection;
   import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState("phone");
  const [selectedCountry, setSelectedCountry] = useState({ code: "91", flag: "🇮🇳" });
  const [phone, setPhone] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // user details
  const [dp, setDp] = useState("https://i.pravatar.cc/100?img=1");
  const [username, setUserName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [terms, setTerms] = useState(false);

  // --- NEW: token state + helpers
  const [token, setToken] = useState(() => localStorage.getItem("authToken") || null);

  const setAuthToken = (tkn) => {
    setToken(tkn);
    if (tkn) {
      localStorage.setItem("authToken", tkn);
      axios.defaults.headers.common["Authorization"] = `Bearer ${tkn}`;
    } else {
      localStorage.removeItem("authToken");
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  useEffect(() => {
    // on mount, prime axios header if token already exists
    if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }, []); // eslint-disable-line

  // open/close form
  const openForm = () => {
    setShowForm(true);
    setStep("phone");
    setPhone("");
    setPassword("");
    setOtp("");
    setError("");
  };
  const closeForm = () => {
    setShowForm(false);
    setStep("phone");
    setPhone("");
    setPassword("");
    setOtp("");
    setError("");
  };

  const baseURL = "http://ec2-user@ec2-54-252-156-179.ap-southeast-2.compute.amazonaws.com:8800";

  // --- SUBMIT PHONE: hits /signup, stores JWT from backend
  const submitPhone = async () => {
    setError("");

    if (!phone.match(/^[6-9]\d{9}$/)) {
      setError("Please enter a valid 10 digit Indian phone number");
      return;
    }

    setLoading(true);
    const phoneNumber = selectedCountry.code + phone;

    try {
      const response = await axios.post(`${baseURL}/signup?phoneNumber=${phoneNumber}`);

      // 🔐 try to read token from common patterns
      const incomingToken =
        response?.data?.token ||
        response?.data?.jwt ||
        response?.data?.jwtToken ||
        response?.headers?.authorization?.replace(/^Bearer\s+/i, "") ||
        null;

      if (!incomingToken) {
        setError("Token missing from server response");
        return;
      }

      // save token -> localStorage + axios header
      setAuthToken(incomingToken);

      if (response.data?.isRegistered) {
        setStep("password"); // existing user → login with password
      } else {
        setStep("otp"); // new user → go to OTP
      }
    } catch (e) {
      console.error(e);
      setError("Something went wrong, please try again");
    } finally {
      setLoading(false);
    }
  };

  // --- SUBMIT OTP: verify with token in header
  const submitOtp = async () => {
    setError("");

    if (otp.length !== 6) {
      setError("Please enter 6 digit OTP");
      return;
    }
   
    setLoading(true);
    const phoneNumber = selectedCountry.code + phone;

    try {
      const resp = await axios.post(
        `${baseURL}/v1/authentication/verify-otp?phoneNumber=${phoneNumber}&otp=${otp}`,
        {},
        {
          headers: {
            // header me bearer token laga rahe (axios.defaults bhi set hai, par explicit rakh rahe)
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (resp.status === 200) {
        // ✅ token accepted by backend → proceed to onboarding/profile
        setStep("profile");
      } else {
        setError("Invalid OTP or session");
      }
    } catch (e) {
      console.error("Error in submitOtp:", e);
      // agar backend ne 401/403 de diya → token mismatch
      if (e?.response?.status === 401 || e?.response?.status === 403) {
        setError("Session invalid. Please restart signup.");
        setAuthToken(null);
      } else {
        setError("Something went wrong, please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- SAVE PROFILE: token required; backend validates before saving
  const saveProfile = async () => {
    setError("");
    if (!token) {
      setError("Session expired. Please login again.");
      return;
    }

    try {
      const payload = {
        username,
        password,          // from earlier step (signup flow)
        phNumber: "91" + phone,
        gender: (gender || "").toUpperCase(),
        dob,
      };

      const response = await axios.post(`${baseURL}/user-onboarding`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 201) {
        alert("Profile saved successfully!");
        closeForm();
      } else {
        setError(response.data?.message || "Something went wrong");
      }
    } catch (e) {
      console.error("Error saving profile:", e);
      if (e?.response?.status === 401 || e?.response?.status === 403) {
        setError("Session invalid. Please login again.");
        setAuthToken(null);
      } else {
        setError(e?.response?.data?.message || "Error saving profile");
      }
    }
  };

  // --- LOGIN (for existing user with password): optionally update token if backend returns a new one
  const submitPassword = async () => {
    setError("");

    if (!phone) {
      setError("Please enter phone number");
      throw new Error("phone missing");
    }
    if (!loginPassword) {
      setError("Password cannot be empty");
      throw new Error("password missing");
    }

    setLoading(true);
    const phoneNumber = selectedCountry.code + phone;

    try {
      const res = await axios.post(`${baseURL}/login`, {
        phoneNumber,
        password: loginPassword,
      });

      // If backend returns fresh token on login, store it
      const freshToken =
        res?.data?.token ||
        res?.data?.jwt ||
        res?.data?.jwtToken ||
        res?.headers?.authorization?.replace(/^Bearer\s+/i, "") ||
        null;

      if (freshToken) setAuthToken(freshToken);

      if (res.status === 200) {
        return true;
      }

      setError(res.data?.message || "Login failed");
      throw new Error(res.data?.message || "Login failed");
    } catch (err) {
      const msg = (err?.response?.data?.message || err?.message || "").toLowerCase();

      if (msg.includes("not found") || err?.response?.status === 404) {
        setError("No account found. Please sign up.");
        throw new Error("not found");
      } else if (
        msg.includes("invalid") ||
        msg.includes("wrong") ||
        err?.response?.status === 401
      ) {
        setError("Wrong password.");
        throw new Error("wrong password");
      } else {
        setError("Something went wrong");
        throw new Error("unknown");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- Optional: logout helper
  const logout = () => {
    setAuthToken(null);
    // optionally clear local state too
  };

  return (
    <AuthContext.Provider
      value={{
        showForm,
        openForm,
        closeForm,
        step,
        phone,
        setPhone,
        loginPassword,
        setLoginPassword,
        password,
        setPassword,
        otp,
        setOtp,
        error,
        loading,
        submitPhone,
        submitOtp,
        dp,
        setDp,
        username,
        setUserName,
        gender,
        setGender,
        dob,
        setDob,
        terms,
        setTerms,
        selectedCountry,
        setSelectedCountry,
        saveProfile,
        submitPassword,
        token,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
