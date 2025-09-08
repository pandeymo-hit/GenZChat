// src/components/MoreSection.jsx
import React from "react";
import { User2, LogOut, CalendarDays, ArrowLeft } from "lucide-react";

export default function MorePage({
  username = "user name",
  signupDate = "12 Jan 2025",
  onLogout,
  onBack,
}) {
  return (
    <section className="min-h-screen w-full ">
      {/* Full-screen glass overlay */}
      <div className="absolute inset-0 bg-transparent backdrop-blur-3xl" />
      
      {/* center content */}
      <div className="relative h-screen w-full flex items-center justify-center p-4 ">
        {/* Container with glass effect */}
        <div className="relative w-full max-w-md h-full md:h-[92vh] bg-black/20 text-white border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
          {/* Back button */}
          <div className="absolute top-4 left-4 z-10">
            <button
              type="button"
              onClick={onBack}
              className="p-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 hover:bg-black/60 transition-all duration-300"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          </div>
          
          {/* vertical layout */}
          <div className="h-full flex flex-col pt-16">
            {/* Top user card - improved layout */}
            <div className="p-5 pb-3">
              <GlassCard className="p-5">
                <div className="flex items-center gap-4">
                  <div className="grid place-items-center w-12 h-12 rounded-xl bg-white/10 border border-white/10">
                    <User2 className="w-6 h-6 text-white/90" />
                  </div>
                  <div className="flex-1">
                    <div className="text-lg font-semibold tracking-wide truncate">
                      {username}
                    </div>
                    <div className="mt-2 inline-flex items-center gap-2 text-xs text-white/80 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                      <CalendarDays className="w-3.5 h-3.5" />
                      Joined: {signupDate}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Scrollable stack: boxes + logout */}
            <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-4 scrollbar-hide">
              <SplitBox registration={signupDate} username={username} tall />
              <SplitBox registration={signupDate} username={username} />
              <SplitBox registration={signupDate} username={username} tall />

              {/* Logout button with confirmation */}
                <div className="flex flex-col items-center gap-3">
                  <div className="text-center">
                    <p className="text-sm text-white/70 mb-2">Ready to sign out?</p>
                    <button
                      type="button"
                      aria-label="Log out"
                      onClick={() => {
                        if (onLogout && confirm('Are you sure you want to logout?')) {
                          onLogout();
                        }
                      }}
                      className="group relative p-[2px] rounded-full hover:scale-105 transition-transform duration-300"
                    >
                      {/* soft pulse */}
                      <span className="pointer-events-none absolute inset-0 -z-10 rounded-full " />
                      {/* inner circle */}
                      <span className="block rounded-full bg-red-900/40 backdrop-blur-xl border border-red-600/30 p-4 transition-all duration-300 hover:bg-red-900/60 hover:border-red-500/50 hover:shadow-[0_0px_15px_rgba(239,68,68,0.4)]">
                        <LogOut className="w-6 h-6 text-red-300 group-hover:text-red-200" />
                      </span>
                    </button>
                    <p className="text-xs text-white/50 mt-2">Logout</p>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* tiny CSS */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes ringPulse {
          0% { transform: scale(1);   opacity: .45; }
          70%{ transform: scale(1.35);opacity: 0;   }
          100%{transform: scale(1.35);opacity: 0;   }
        }
      `}</style>
    </section>
  );
}

/* ---------- Glass Card Component ---------- */

function GlassCard({ children, className = "" }) {
  return (
    <div className="relative p-[1.5px] rounded-xl bg-gradient-to-br from-violet-400/25 via-white/10 to-blue-400/25">
      <div
        className={`rounded-[calc(theme(borderRadius.xl)-1px)] bg-white/5 backdrop-blur-xl
                    border border-white/10 shadow-[0_0_24px_rgba(139,92,246,0.20)]
                    transition duration-300 hover:shadow-[0_0_40px_rgba(139,92,246,0.35)] ${className}`}
      >
        {children}
      </div>
    </div>
  );
}

/* ---------- Split Box Component ---------- */

function SplitBox({ registration, username, tall = false }) {
  return (
    <GlassCard className={`px-5 ${tall ? "py-5 min-h-[140px]" : "py-4"}`}>
      <div className="relative">
        <div className="pb-3 flex items-center justify-between">
          <span className="text-sm text-white/80">Registration</span>
          <span className="text-sm font-medium text-white">{registration}</span>
        </div>
        
        {/* Divider line */}
        <div className="absolute left-0 right-0 h-px bg-white/10 top-1/2 transform -translate-y-1/2" />
        
        <div className="pt-3 flex items-center justify-between">
          <span className="text-sm text-white/80">Username</span>
          <span className="text-sm font-semibold tracking-wide truncate max-w-[120px]">{username}</span>
        </div>
      </div>
    </GlassCard>
  );
}