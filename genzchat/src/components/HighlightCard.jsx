import React from "react";

/**
 * SmartReplyFeature
 * ---------------------------------------------------------------------------
 * A single, drop‑in feature slice that mimics the reference layout:
 *  • Left: rounded showcase panel with an “app/DM” mock and sample IG‑style chat
 *  • Right: headline + marketing copy supplied by the user
 *  • Optional decorative image (mascot) that sits on the top‑right of the slice
 *
 * Props
 *  - topImageSrc?: string  → small decorative image rendered at the very top‑right
 */
export default function SmartReplyFeature({ topImageSrc }) {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-6 md:px-10 py-14 md:py-20">
      {/* tiny decorative image on top of the component */}
      {topImageSrc ? (
        <img
          src={topImageSrc}
          alt="decor"
          className="pointer-events-none select-none absolute -top-6 right-6 h-14 w-14 object-contain drop-shadow-[0_6px_24px_rgba(0,0,0,0.35)]"
        />
      ) : null}

      {/* Outer rounded container (kept visually close to the reference) */}
      <div className="relative rounded-[44px] bg-gradient-to-b from-[#1d2a73] via-[#172162] to-[#121a4b] p-1 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.6)]">
        <div className="relative rounded-[42px] bg-[#0b0f20] overflow-hidden">
          {/* soft outer glow ring (like the screenshot card rim) */}
          <div className="pointer-events-none absolute inset-0 rounded-[42px] ring-1 ring-white/10" />

          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 md:gap-14 p-6 md:p-10">
            {/* LEFT : Gradient panel with device/chat mock */}
            <div className="order-2 lg:order-1">
              <div className="relative mx-auto w-full max-w-[640px] aspect-[4/3] rounded-[36px] p-1 bg-[radial-gradient(70%_120%_at_30%_20%,rgba(255,0,153,0.35),rgba(124,58,237,0.25)_45%,rgba(59,130,246,0.2)_70%,transparent_100%)]">
                <div className="absolute inset-0 rounded-[36px] bg-gradient-to-b from-fuchsia-500/15 via-purple-500/10 to-blue-500/15" />

                {/* inner content surface */}
                <div className="relative m-4 md:m-5 rounded-[28px] bg-[#0d1126]/60 backdrop-blur-md shadow-[0_30px_80px_-20px_rgba(0,0,0,0.65)] ring-1 ring-white/10">
                  {/* header — mimics DM top bar */}
                 

                  {/* message list */}
                 
                </div>
              </div>
            </div>

            {/* RIGHT : Copy block */}
            <div className="order-1 lg:order-2 text-white">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
                <span className="mr-2">🧠</span>
                Smart Reply Generation
              </h2>
              <p className="mt-4 text-lg text-white/80 max-w-prose">“No more boring replies.” AI analyzes your chat and suggests witty, engaging responses that keep the vibe alive.</p>
              <div className="mt-6 space-y-2 text-[17px]">
                <div className="flex gap-3 items-start">
                  <span className="shrink-0">💬</span>
                  <span className="text-white/85">Instead of: <span className="italic text-white/90">“hmm”</span></span>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="shrink-0">👉</span>
                  <span className="text-white">GenZChat suggests: <span className="font-semibold">“Haha you’re funny, tell me more 🤭”</span></span>
                </div>
              </div>
            </div>
          </div>

          {/* Soft inner vignette for depth */}
          <div className="pointer-events-none absolute inset-0 rounded-[42px] shadow-[inset_0_0_120px_rgba(0,0,0,0.35)]" />
        </div>
      </div>
    </section>
  );
}
