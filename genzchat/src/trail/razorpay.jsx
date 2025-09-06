// src/trail/Razorpay.jsx
import React, { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";

// Safely read env (Vite + CRA) without ever touching undefined `process`
function getRazorpayKey() {
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
  // return "rzp_test_1234567890abcd"; // TODO: replace in production
}

export default function Razorpay({ onBack }) {
  const [loading, setLoading] = useState(false);
  const RAZORPAY_KEY_ID = getRazorpayKey();

  const PLAN = { name: "Enterprise Package – Monthly", amount: 250, currency: "USD" };

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

  async function createOrderOnServer(amountSubunits, currency) {
    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountSubunits,
          currency,
          notes: { plan: "Enterprise", period: "Monthly" },
        }),
      });
      if (!res.ok) return null;
      return await res.json(); // { id, amount, currency }
    } catch {
      return null;
    }
  }

  async function openCheckout() {
    try {
      setLoading(true);
      await loadRazorpay();

      const amountSubunits = Math.round(PLAN.amount * 100);
      const order = await createOrderOnServer(amountSubunits, PLAN.currency);

      const options = {
        key: RAZORPAY_KEY_ID,
        name: "GenZChat",
        description: PLAN.name,
        order_id: order?.id,
        amount: order?.amount ?? amountSubunits,
        currency: order?.currency ?? PLAN.currency,
        theme: { color: "#8B5CF6" },
        prefill: { name: "Customer", email: "customer@example.com", contact: "9999999999" },
        notes: { plan: "Enterprise Monthly" },
        handler: async (response) => {
          try {
            await fetch("/api/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            alert("Payment successful ✅");
          } catch {
            alert("Payment captured — verify on server.");
          }
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

  return (
    <section className="min-h-screen w-full  text-white flex flex-col items-center justify-center px-4 my-20 overflow-y-hidden">
      {/* Optional top bar with back */}
      {(typeof onBack === "function") && (
        <div className="fixed top-0 inset-x-0 z-10 h-14 flex items-center gap-3 px-4  ">
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

      {/* Billing toggle (static) */}
      <div className="flex items-center gap-2 mb-10 bg-white/5 border border-white/10 rounded-full p-1">
        <button className="px-5 py-2 text-sm rounded-full transition bg-white text-black font-medium">Monthly</button>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-transparent backdrop-blur-3xl border border-violet-600 rounded-3xl p-8 shadow-[0_0_50px_rgba(139,92,246,0.5)] md:shadow-none md:hover:shadow-[0_0_50px_rgba(139,92,246,0.5)] backdrop-blur">
        <div className="flex items-center justify-between mb-6">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80">🚀</span>
          <span className="text-sm text-white/50">Enterprise Package</span>
        </div>

        <p className="text-3xl font-bold mb-6">
          ${PLAN.amount} <span className="text-base font-normal text-white/50">/ per month</span>
        </p>

        <div className="border-t border-white/10 pt-6 mb-6">
          <p className="mb-4 text-sm font-medium text-white/80">What you will get</p>
          <ul className="space-y-2 text-sm text-white/70">
            <li>✔ Premium AI Chatbot</li>
            <li>✔ Unlimited Integrations</li>
            <li>✔ Analytics & Reporting</li>
            <li>✔ 24/7 Dedicated Support</li>
            <li>✔ Enterprise-Grade Security</li>
            <li>✔ Custom Solutions & Tailored Features</li>
          </ul>
        </div>

        <button
          onClick={openCheckout}
          disabled={loading}
          className="w-full rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 text-black font-medium py-3 transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Processing…" : "Get Started"}
        </button>
      </div>
    </section>
  );
}
