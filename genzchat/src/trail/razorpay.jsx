// // src/trail/Razorpay.jsx
// import React, { useState } from "react";
// import { FiArrowLeft } from "react-icons/fi";

// // Safely read env (Vite + CRA) without ever touching undefined `process`
// function getRazorpayKey() {
//   // try {
//   //   if (typeof import !== "undefined" && import.meta?.env?.VITE_RAZORPAY_KEY_ID) {
//   //     return import.meta.env.VITE_RAZORPAY_KEY_ID;
//   //   }
//   // } catch {}
//   // try {
//   //   if (typeof process !== "undefined" && process.env?.REACT_APP_RAZORPAY_KEY_ID) {
//   //     return process.env.REACT_APP_RAZORPAY_KEY_ID;
//   //   }
//   // } catch {}
//   // return "rzp_test_1234567890abcd"; // TODO: replace in production
// }

// export default function Razorpay({ onBack }) {
//   const [loading, setLoading] = useState(false);
//   const RAZORPAY_KEY_ID = getRazorpayKey();

//   const PLAN = { name: "Enterprise Package – Monthly", amount: 250, currency: "USD" };

//   function loadRazorpay() {
//     return new Promise((resolve, reject) => {
//       if (window.Razorpay) return resolve(true);
//       const s = document.createElement("script");
//       s.src = "https://checkout.razorpay.com/v1/checkout.js";
//       s.onload = () => resolve(true);
//       s.onerror = () => reject(new Error("Razorpay SDK failed to load"));
//       document.body.appendChild(s);
//     });
//   }

//   async function createOrderOnServer(amountSubunits, currency) {
//     try {
//       const res = await fetch("/api/create-order", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           amount: amountSubunits,
//           currency,
//           notes: { plan: "Enterprise", period: "Monthly" },
//         }),
//       });
//       if (!res.ok) return null;
//       return await res.json(); // { id, amount, currency }
//     } catch {
//       return null;
//     }
//   }

//   async function openCheckout() {
//     try {
//       setLoading(true);
//       await loadRazorpay();

//       const amountSubunits = Math.round(PLAN.amount * 100);
//       const order = await createOrderOnServer(amountSubunits, PLAN.currency);

//       const options = {
//         key: RAZORPAY_KEY_ID,
//         name: "GenZChat",
//         description: PLAN.name,
//         order_id: order?.id,
//         amount: order?.amount ?? amountSubunits,
//         currency: order?.currency ?? PLAN.currency,
//         theme: { color: "#8B5CF6" },
//         prefill: { name: "Customer", email: "customer@example.com", contact: "9999999999" },
//         notes: { plan: "Enterprise Monthly" },
//         handler: async (response) => {
//           try {
//             await fetch("/api/verify", {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify(response),
//             });
//             alert("Payment successful ✅");
//           } catch {
//             alert("Payment captured — verify on server.");
//           }
//         },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.on("payment.failed", (resp) => {
//         alert(resp?.error?.description || "Payment failed ❌");
//       });
//       rzp.open();
//     } catch (err) {
//       console.error(err);
//       alert("Could not open Razorpay. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <section className="min-h-screen w-full  text-white flex flex-col items-center justify-center px-4 my-20 overflow-y-hidden">
//       {/* Optional top bar with back */}
//       {(typeof onBack === "function") && (
//         <div className="fixed top-0 inset-x-0 z-10 h-14 flex items-center gap-3 px-4  ">
//           <button onClick={onBack} className="p-2 rounded-full hover:bg-zinc-800" aria-label="Back" title="Back">
//             <FiArrowLeft className="w-5 h-5" />
//           </button>
//         </div>
//       )}

//       {/* Heading */}
//       <div className="text-center max-w-2xl mx-auto mb-10">
//         <h2 className="text-3xl sm:text-4xl font-bold">
//           Choose the perfect plan to fit your business goals and budget
//         </h2>
//         <p className="mt-4 text-white/70 text-sm sm:text-base">
//           Whether you're just getting started or looking to scale, we offer flexible pricing options that grow with you.
//         </p>
//       </div>

//       {/* Billing toggle (static) */}
//       <div className="flex items-center gap-2 mb-10 bg-white/5 border border-white/10 rounded-full p-1">
//         <button className="px-5 py-2 text-sm rounded-full transition bg-white text-black font-medium">Monthly</button>
//       </div>

//       {/* Card */}
//       <div className="w-full max-w-sm bg-transparent  border border-violet-600 rounded-3xl p-8 shadow-[0_0_10px_rgba(139,92,246,0.5)] md:shadow-none md:hover:shadow-[0_0_50px_rgba(139,92,246,0.5)] backdrop-blur">
//         <div className="flex items-center justify-between mb-6">
//           <span className="text-sm text-white/90 font-extrabold">BASIC PACKAGE</span>
//           <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80">🚀</span>
//         </div>

//         <p className="text-3xl font-bold mb-6">
//           ${PLAN.amount} <span className="text-base font-normal text-white/50">/ per month</span>
//         </p>

//         <div className="border-t border-white/10 pt-6 mb-6">
//           <p className="mb-4 text-sm font-medium text-white/80">What you will get</p>
//           <ul className="space-y-2 text-sm text-white/70">
//             <li>✔ UNLIMITED CHATSt</li>
//             <li>✔ FASTER REPLIES</li>
//             <li>✔ Analytics & Reporting</li>
//             <li>✔ 24/7 Dedicated Support</li>
//             <li>✔ Enterprise-Grade Security</li>
//             <li>✔ Custom Solutions & Tailored Features</li>
//           </ul>
//         </div>

//         <button
//           onClick={openCheckout}
//           disabled={loading}
//           className="w-full rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 text-black font-medium py-3 mb-4 transition hover:opacity-90 disabled:opacity-60"
//         >
//           {loading ? "Processing…" : "Get Started"}
//         </button>
//       </div>
//     </section>
//   );
// }


// src/trail/Razorpay.jsx
import React, { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";

// Safely read env (Vite + CRA) without ever touching undefined `process`
function getRazorpayKey() {
  // Production-ready key fetching logic can be uncommented here
  // try {
  //   if (typeof import !== "undefined" && import.meta?.env?.VITE_RAZORPAY_KEY_ID) {
  //     return import.meta.env.VITE_RAZORPAY_KEY_ID;
  //   }
  // } catch {}
  // try {
  //   if (typeof process !== "undefined" && process.env?.REACT_APP_RAZORPAY_KEY_ID) {
  //     return process.env.REACT_APP_RAZORPAY_KEY_ID;
  //   }
  // } catch {}
  return "rzp_test_1234567890abcd"; // Fallback test key
}

// ---▼▼▼ NEW: Plan Definitions ▼▼▼---
const MONTHLY_PLAN = {
  name: "Basic Package",
  period: "Monthly",
  amount: 250,
  currency: "USD",
  badge: null,
  features: [
    "✔ UNLIMITED CHATS",
    "✔ FASTER REPLIES",
    "✔ Analytics & Reporting",
    "✔ 24/7 Dedicated Support",
    "✔ Enterprise-Grade Security",
    "✔ Custom Solutions & Tailored Features",
  ],
};

const ANNUALLY_PLAN = {
  name: "Enterprise Package",
  period: "Annually",
  amount: 2500, // e.g., $250 * 12 * 0.8 = $2400 (20% discount)
  currency: "USD",
  badge: "SAVE 20%",
  features: [
    "✔ Everything in Basic",
    "✔ Priority Access to New Features",
    "✔ Advanced AI Models",
    "✔ Dedicated Account Manager",
    "✔ Higher API Rate Limits",
    "✔ Early Access to Betas",
  ],
};
// ---▲▲▲ END of Plan Definitions ▲▲▲---


export default function Razorpay({ onBack }) {
  const [loading, setLoading] = useState(false);
  // ---▼▼▼ NEW: State for billing cycle ▼▼▼---
  const [billingCycle, setBillingCycle] = useState("monthly");
  // ---▲▲▲ END of State ▲▲▲---
  
  const RAZORPAY_KEY_ID = getRazorpayKey();

  // Function to load Razorpay script
  function loadRazorpay() {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) return resolve(true);
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = () => resolve(true);
      s.onerror = () => reject(new Error("Razorpay SDK failed to load"));
      document.body.appendChild(s);
    });
  }

  // ---▼▼▼ UPDATED: `openCheckout` now accepts a plan object ▼▼▼---
  async function openCheckout(plan) {
    if (!plan) return;
    try {
      setLoading(true);
      await loadRazorpay();

      // In a real app, you would create an order on your server for this specific plan
      // const order = await createOrderOnServer(plan.amount * 100, plan.currency);

      const options = {
        key: RAZORPAY_KEY_ID,
        name: "GenZChat",
        description: `${plan.name} – ${plan.period}`,
        amount: plan.amount * 100, // Amount in the smallest currency unit
        currency: plan.currency,
        theme: { color: "#8B5CF6" },
        prefill: { name: "Valued Customer", email: "customer@example.com", contact: "9999999999" },
        notes: { plan: plan.name, period: plan.period },
        handler: (response) => {
          alert("Payment successful ✅. Verification needed on server.");
          console.log(response);
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (resp) => {
        alert(resp?.error?.description || "Payment failed ❌");
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Could not open Razorpay. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Determine which plan is currently active
  const activePlan = billingCycle === "monthly" ? MONTHLY_PLAN : ANNUALLY_PLAN;

  return (
    <section className="min-h-screen w-full text-white flex flex-col items-center justify-center px-4 py-12">
      {/* Optional top bar with back */}
      {typeof onBack === "function" && (
        <div className="fixed top-0 inset-x-0 z-20 h-14 flex items-center gap-3 px-4">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-zinc-800" aria-label="Back" title="Back">
            <FiArrowLeft className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Heading */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold">
          Choose the perfect plan to fit your business goals and budget
        </h2>
        <p className="mt-4 text-white/70 text-sm sm:text-base">
          Whether you're just getting started or looking to scale, we offer flexible pricing options that grow with you.
        </p>
      </div>
      
      {/* ---▼▼▼ UPDATED: Billing Toggle ▼▼▼--- */}
      <div className="flex items-center gap-2 mb-10 bg-black/20 border border-white/10 rounded-full p-1.5 backdrop-blur-sm z-10">
        <button 
          onClick={() => setBillingCycle("monthly")}
          className={`px-5 py-2 text-sm rounded-full transition-colors font-medium ${billingCycle === 'monthly' ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}
        >
          Monthly
        </button>
        <button 
          onClick={() => setBillingCycle("annually")}
          className={`px-5 py-2 text-sm rounded-full transition-colors font-medium ${billingCycle === 'annually' ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}
        >
          Annually
        </button>
      </div>
      {/* ---▲▲▲ END of Billing Toggle ▲▲▲--- */}


      {/* ---▼▼▼ NEW: Animated Card Container ▼▼▼--- */}
      <div className="relative w-full max-w-sm h-[520px]">
        {/* Monthly Card */}
        <div 
          className={`absolute inset-0 transition-all duration-500 ease-in-out ${billingCycle === 'monthly' ? 'opacity-100 transform-none' : 'opacity-0 translate-y-8 pointer-events-none'}`}
        >
          <div className="w-full h-full bg-black/30 border border-violet-600 rounded-3xl p-8 shadow-[0_0_50px_rgba(139,92,246,0.3)] backdrop-blur-lg flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-white/90 font-extrabold uppercase">{MONTHLY_PLAN.name}</span>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80">🚀</span>
            </div>
            <p className="text-3xl font-bold mb-6">
              ${MONTHLY_PLAN.amount} <span className="text-base font-normal text-white/50">/ month</span>
            </p>
            <div className="border-t border-white/10 pt-6 mb-6 flex-grow">
              <p className="mb-4 text-sm font-medium text-white/80">What you will get</p>
              <ul className="space-y-2 text-sm text-white/70">
                {MONTHLY_PLAN.features.map(f => <li key={f}>{f}</li>)}
              </ul>
            </div>
            <button
              onClick={() => openCheckout(MONTHLY_PLAN)}
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-3 transition hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Processing…" : "Get Started"}
            </button>
          </div>
        </div>

        {/* Annually Card */}
        <div 
          className={`absolute inset-0 transition-all duration-500 ease-in-out ${billingCycle === 'annually' ? 'opacity-100 transform-none' : 'opacity-0 -translate-y-8 pointer-events-none'}`}
        >
          <div className="w-full h-full bg-black/30 border border-cyan-500 rounded-3xl p-8 shadow-[0_0_50px_rgba(45,212,191,0.4)] backdrop-blur-lg flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-white/90 font-extrabold uppercase">{ANNUALLY_PLAN.name}</span>
              <span className="px-3 py-1 text-xs font-bold bg-cyan-400 text-black rounded-full">{ANNUALLY_PLAN.badge}</span>
            </div>
            <p className="text-3xl font-bold mb-6">
              ${ANNUALLY_PLAN.amount} <span className="text-base font-normal text-white/50">/ year</span>
            </p>
            <div className="border-t border-white/10 pt-6 mb-6 flex-grow">
              <p className="mb-4 text-sm font-medium text-white/80">Everything in Basic, plus</p>
              <ul className="space-y-2 text-sm text-white/70">
                 {ANNUALLY_PLAN.features.map(f => <li key={f}>{f}</li>)}
              </ul>
            </div>
            <button
              onClick={() => openCheckout(ANNUALLY_PLAN)}
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-500 text-black font-semibold py-3 transition hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Processing…" : "Get Started"}
            </button>
          </div>
        </div>
      </div>
      {/* ---▲▲▲ END of Card Container ▲▲▲--- */}
    </section>
  );
}