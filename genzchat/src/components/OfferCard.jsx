import React, { useState } from "react";

export default function OfferCard() {
  

  return (
    <section className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-center px-4 py-20">
      {/* Heading */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold">
          Choose the perfect plan to fit your business goals and budget
        </h2>
        <p className="mt-4 text-white/70 text-sm sm:text-base">
          Whether you're just getting started or looking to scale, we offer
          flexible pricing options that grow with you. Find the plan that works
          best for your needs and start experiencing the benefits of intelligent
          automation today.
        </p>
      </div>

      {/* Billing toggle */}
      <div className="flex items-center gap-2 mb-10 bg-white/5 border border-white/10 rounded-full p-1">
       
        <button
          className="px-5 py-2 text-sm rounded-full transition  bg-white text-black font-medium"
        >
          Monthly
        </button>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-black border border-violet-600 rounded-3xl p-8 shadow-[0_0_50px_rgba(139,92,246,0.5)] md:shadow-none md:hover:shadow-[0_0_50px_rgba(139,92,246,0.5)] backdrop-blur">
        <div className="flex items-center justify-between mb-6">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80">
            🚀
          </span>
          <span className="text-sm text-white/50">Enterprise Package</span>
        </div>

          <p className="text-3xl font-bold mb-6">
            $250 <span className="text-base font-normal text-white/50">/ per month</span>
          </p>
        
        <div className="border-t border-white/10 pt-6 mb-6">
          <p className="mb-4 text-sm font-medium text-white/80">What you will get</p>
          <ul className="space-y-2 text-sm text-white/70">
            <li>✔ Premium AI Chatbot</li>
            <li>✔ Unlimited Integrations</li>
            <li>✔ Comprehensive Analytics & Reporting</li>
            <li>✔ 24/7 Dedicated Support</li>
            <li>✔ Enterprise-Grade Security</li>
            <li>✔ Custom Solutions & Tailored Features</li>
          </ul>
        </div>

        <button className="w-full rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 text-black font-medium py-3 hover:bg-white/90 transition">
          Get Started
        </button>
      </div>
    </section>
  );
}