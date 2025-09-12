import React, { useState, useEffect } from "react";
import Marquee from "react-fast-marquee"; // npm i react-fast-marquee
import img from '../assets/pfp4.jpg';
import img1 from '../assets/pfp3.jpg';
/** 👉 Replace with your image URLs (more items = richer loop) */
const images = [
img,img1,
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
  const [currentIndex, setCurrentIndex] = useState(0);

  // Get cards per view based on screen size
  const getCardsPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 3; // lg screens - 3 cards
      if (window.innerWidth >= 768) return 2;  // md screens - 2 cards
      return 1; // sm screens - 1 card
    }
    return 3;
  };

  const [cardsPerView, setCardsPerView] = useState(getCardsPerView());

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setCardsPerView(getCardsPerView());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-advance testimonials every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        // For continuous loop, reset to 0 when reaching the end
        return (prevIndex + 1) % testimonials.length;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Calculate transform percentage for continuous loop
  const getTransformX = () => {
    if (cardsPerView === 1) {
      // For single card view, show one card at a time with continuous loop
      return currentIndex * 100;
    } else {
      // For multiple cards view, use the existing logic
      const maxIndex = testimonials.length - cardsPerView;
      const adjustedIndex = currentIndex > maxIndex ? maxIndex : currentIndex;
      return (adjustedIndex * (100 / cardsPerView));
    }
  };

  // Get center card index for scaling effect  
  const getCenterCardIndex = () => {
    if (cardsPerView === 1) {
      return currentIndex % testimonials.length;
    }
    return Math.floor(currentIndex + (cardsPerView / 2));
  };

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
                            className="first:ml-0 last:mr-4 mx-6 sm:mx-8 md:mx-10 w-[76px] h-[120px] sm:w-[96px] sm:h-[152px] md:w-[106px] md:h-[168px]
             rounded-xl overflow-hidden ring-1 ring-white/20 transition-all duration-300
             transform-gpu hover:scale-105 will-change-transform"
                            style={{ filter: "brightness(0.9) saturate(1.1)" }}   // ⬅️ no rotate here
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
            <h2 className="font-black tracking-tight leading-none text-4xl sm:text-6xl ">
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

          {/* Testimonials carousel */}
         

          {/* Button with Aurora Glow Effect */}
<button
  onClick={() => openForm("signup")}
  type="button"
  className="btn-aurora group relative overflow-hidden rounded-full px-[2px] py-[2px] transition-transform duration-300 hover:scale-110"
>
  {/* Glow Layer */}
  <div className="absolute inset-0 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />

  {/* Inner Button Content */}
  <span className="relative z-10 inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 md:px-10 md:py-4 text-white text-base sm:text-lg font-semibold bg-black/80 shadow-md">
   Join Our Community
  </span>
</button>
        </div>

        {/* ===== BOTTOM STRIP ===== */}
        <div className="relative h-[160px] sm:h-[200px] md:h-[220px] lg:h-[240px] mt-4">
          <div className="absolute inset-0 px-4 sm:px-6 md:px-8">
            <div className="h-full w-full mask-x overflow-hidden scrollbar-hide rotate-[5deg] origin-center -translate-y-2 z-[5]">
              <Marquee speed={imageSpeed} gradient={false} direction="right" autoFill className="scrollbar-hide">
                {images.slice().reverse().map((src, i) => (
                    <div
                        key={`bottom-${i}`}
                        className="first:ml-0 last:mr-4 mx-4 sm:mx-12 md:mx-14 w-[88px] h-[140px] sm:w-[108px] sm:h-[172px] md:w-[118px] md:h-[188px]
             rounded-xl overflow-hidden ring-1 ring-white/20 transition-all duration-300
             transform-gpu hover:scale-105 will-change-transform"
                        style={{ filter: "brightness(0.9) saturate(1.1)" }}   // ⬅️ no rotate here
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
