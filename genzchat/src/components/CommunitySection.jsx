import React from "react";
import Marquee from "react-fast-marquee"; // npm i react-fast-marquee

/** 👉 Replace with your image URLs (more items = richer loop) */
const images = [
  "/avatars/1.jpg","/avatars/2.jpg","/avatars/3.jpg","/avatars/4.jpg",
  "/avatars/5.jpg","/avatars/6.jpg","/avatars/7.jpg","/avatars/8.jpg",
  "/avatars/1.jpg","/avatars/2.jpg","/avatars/3.jpg","/avatars/4.jpg", // duplicates for smoother loop
];

/** Community testimonials */
const testimonials = [
  { id: 1, name: "Sakshi", age: 19, text: "Finally found my tribe! The conversations here are so genuine and fun. Best community app ever! 💫", avatar: "👩🏻‍💻" },
  { id: 2, name: "Arjun",  age: 21, text: "From strangers to besties - this place creates real friendships. The energy is unmatched! 🔥", avatar: "👨🏻‍🎨" },
  { id: 3, name: "Maya",   age: 20, text: "Love how safe and inclusive this space feels. Everyone's so supportive and positive! ✨", avatar: "👩🏻‍🎤" },
  { id: 4, name: "Rahul",  age: 22, text: "Been here for months and still discovering amazing people. This community hits different! 🚀", avatar: "👨🏻‍💼" },
  { id: 5, name: "Priya",  age: 18, text: "The perfect blend of fun and meaningful connections. Found my creative collaborators here! 🎨", avatar: "👩🏻‍🎨" },
  { id: 6, name: "Karan",  age: 23, text: "What started as casual chats turned into lifelong friendships. This community is pure magic! ⚡", avatar: "👨🏻‍🚀" },
];

export default function CommunitySection() {
  const imageSpeed = 50;      // Top & bottom image carousels
  const testimonialSpeed = 25; // Center—slower for readability

  return (
    <section className="relative w-full bg-black/10 backdrop-blur-md text-white overflow-x-hidden overflow-y-visible py-16 sm:py-20 md:py-24">
      {/* Edge mask + scrollbar utility */}
      <style>{`
        .mask-x {
          mask-image: linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%);
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%);
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>

      {/* Background effects (unchanged) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="h-[70vw] w-[70vw] max-h-[600px] max-w-[600px] rounded-full blur-[120px] opacity-40"
            style={{
              background:
                "radial-gradient(circle, rgba(168,85,247,0.4) 0%, rgba(236,72,153,0.3) 30%, rgba(59,130,246,0.2) 60%, transparent 80%)",
            }}
          />
        </div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] opacity-60" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[100px] opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-transparent" />
      </div>

      {/* max-w-6xl as requested */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ===== TOP STRIP ===== */}
        <div className="relative h-[160px] sm:h-[200px] md:h-[220px] lg:h-[240px] mb-4">
          {/* Padding inside the reserved row => left/right spacing without changing angle */}
          <div className="absolute inset-0 px-4 sm:px-6 md:px-8">
            <div className="h-full w-full mask-x overflow-hidden scrollbar-hide -rotate-[5deg] origin-center translate-y-2 z-[5]">
              <Marquee speed={imageSpeed} gradient={false} autoFill className="scrollbar-hide">
                {images.map((src, i) => (
                  <div
                    key={`top-${i}`}
                    className="first:ml-0 last:mr-0 mx-6 sm:mx-8 md:mx-10 w-[88px] h-[140px] sm:w-[108px] sm:h-[172px] md:w-[118px] md:h-[188px]
                               rounded-3xl overflow-hidden ring-1 ring-white/20 transition-all duration-300 transform-gpu hover:scale-105"
                    style={{
                      transform: `rotate(${i % 2 ? -2 : 2}deg)`,
                      filter: "brightness(0.9) saturate(1.1)",
                    }}
                  >
                    <img
                      src={src}
                      alt="Community member"
                      className="w-full h-full object-cover transition-all duration-300 hover:brightness-110"
                      loading="lazy"
                    />
                  </div>
                ))}
              </Marquee>
            </div>
          </div>
        </div>

        {/* ===== CENTER CONTENT ===== */}
        <div className="relative text-center my-12 sm:my-16 md:my-20 z-10">
          <div className="mb-8">
            <h2 className="font-black tracking-tight leading-none text-4xl sm:text-6xl md:text-7xl lg:text-8xl">
              <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                OUR
              </span>
              <br className="sm:hidden" />
              <span className="sm:ml-4">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  COMMUNITY
                </span>
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-base sm:text-lg md:text-xl text-white/90 leading-relaxed font-medium">
              Where Gen Z connects authentically. A safe space built on respect, creativity, and genuine friendships.
              <br className="hidden sm:block" />
              <span className="text-purple-300">Join thousands finding their tribe daily.</span>
            </p>
          </div>

          {/* Testimonials marquee */}
          <div className="mt-10 sm:mt-12">
            <Marquee speed={testimonialSpeed} gradient={false} autoFill className="scrollbar-hide">
              {[...testimonials, ...testimonials].map((t, idx) => (
                <div
                  key={`testimonial-${idx}`}
                  className="first:ml-0 last:mr-0 mx-10  sm:mx-16 md:mx-20 w-[300px] sm:w-[340px] md:w-[360px]
                             rounded-3xl p-6 sm:p-7
                             bg-gradient-to-br from-purple-500/25 via-pink-500/20 to-blue-500/25 
                             backdrop-blur-2xl border border-white/15 hover:border-purple-400/50
                             transition-all duration-300 hover:scale-105 transform-gpu"
                >
                  {/* User info header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-2xl">{t.avatar}</div>
                    <div className="text-left">
                      <h3 className="font-bold text-white text-base">{t.name}</h3>
                      <p className="text-purple-300 text-sm font-medium">{t.age} years old</p>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base leading-relaxed text-white/95 font-medium">
                    "{t.text}"
                  </p>

                  <div className="flex gap-1 mt-4 justify-center">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-sm">★</span>
                    ))}
                  </div>
                </div>
              ))}
            </Marquee>
          </div>

          {/* CTA */}
          <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group relative overflow-hidden rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-3 font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_30px_rgba(168,85,247,0.5)]">
              <span className="relative z-10">Join Our Community</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </button>

            <button className="group flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-purple-400/50">
              <span>Meet Our Ambassadors</span>
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* ===== BOTTOM STRIP ===== */}
        <div className="relative h-[160px] sm:h-[200px] md:h-[220px] lg:h-[240px] mt-4">
          <div className="absolute inset-0 px-4 sm:px-6 md:px-8">
            <div className="h-full w-full mask-x overflow-hidden scrollbar-hide rotate-[5deg] origin-center -translate-y-2 z-[5]">
              <Marquee speed={imageSpeed} gradient={false} direction="right" autoFill className="scrollbar-hide">
                {images.slice().reverse().map((src, i) => (
                  <div
                    key={`bottom-${i}`}
                    className="first:ml-0 last:mr-0 mx-6 sm:mx-8 md:mx-10 w-[88px] h-[140px] sm:w-[108px] sm:h-[172px] md:w-[118px] md:h-[188px]
                               rounded-3xl overflow-hidden ring-1 ring-white/20 transition-all duration-300 transform-gpu hover:scale-105"
                    style={{
                      transform: `rotate(${i % 2 ? 2 : -2}deg)`,
                      filter: "brightness(0.9) saturate(1.1)",
                    }}
                  >
                    <img
                      src={src}
                      alt="Community member"
                      className="w-full h-full object-cover transition-all duration-300 hover:brightness-110"
                      loading="lazy"
                    />
                  </div>
                ))}
              </Marquee>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
