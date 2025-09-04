import React from "react";
import { Users, MapPin, Activity, TrendingUp } from "lucide-react";

const stats = [
  { id: 1, title: "Users", value: "50,000+", icon: Users },
  { id: 2, title: "Cities", value: "100+", icon: MapPin },
  { id: 3, title: "Active Daily Users", value: "10,000+", icon: Activity },
  { id: 4, title: "Success Rate", value: "93.7%", icon: TrendingUp },
];

const StatIcon = ({ Icon, label }) => (
  <Icon
    aria-hidden="true"
    focusable="false"
    className="w-8 h-8 text-indigo-300"
    title={label}
    strokeWidth={2}
  />
);

const Stats = () => {
  return (
    <section className="relative py-12" aria-labelledby="stats-heading">
      <div className="max-w-6xl mx-auto px-4">
        {/* Heading + tagline */}
        <header className="text-center mb-10 relative">
          <h2
            id="stats-heading"
            className="py-5 font-extrabold tracking-tight text-3xl sm:text-4xl md:text-5xl bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 bg-clip-text text-transparent"
          >
            Performance Highlights
          </h2>

          <p className="mt-3 text-sm text-gray-300 relative inline-block">
            Real traction. Real community.
            {/* shimmer underline */}
            <span className="absolute left-1/2 -bottom-1.5 w-40 h-[2px] -translate-x-1/2 bg-gradient-to-r from-transparent via-blue-400 to-transparent overflow-hidden rounded">
              <span
                className="block w-full h-full animate-[shine_2s_linear_infinite]"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)",
                }}
              />
            </span>
          </p>

          <style>
            {`
              @keyframes shine {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
              }
            `}
          </style>
        </header>

        {/* Stats grid */}
        <dl className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {stats.map(({ id, title, value, icon: Icon }) => (
            <div
              key={id}
              role="listitem"
              className="
               hover:shadow-[0_0_50px_rgba(139,92,246,0.5)] 
                relative group overflow-hidden rounded-2xl
                border border-white/10 bg-white/5 backdrop-blur-md
                p-5 flex flex-col items-center text-center
                min-h-[150px]
                transform-gpu origin-center
                transition-transform duration-300 ease-out
                hover:scale-[1.035]
                will-change-transform
              "
              style={{ backfaceVisibility: "hidden" }}
            >
              {/* full-card inner glow (inside only) */}
              {/* <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    "radial-gradient(120% 120% at 50% 50%, rgba(99,102,241,0.22) 0%, rgba(37,99,235,0.20) 45%, rgba(13,13,18,0.85) 100%)",
                }}
              /> */}

              {/* content (isolated from paint jitter) */}
              <div
                className="relative z-10 flex flex-col items-center antialiased"
                style={{ transform: "translateZ(0)" }}
              >
                <div className="mb-3">
                  <StatIcon Icon={Icon} label={title} />
                </div>

                <dd className="text-2xl sm:text-3xl font-bold text-slate-100 leading-none">
                  {value}
                </dd>

                <dt className="mt-1 text-[13px] sm:text-sm text-gray-400/90 leading-tight">
                  {title}
                </dt>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default Stats;
