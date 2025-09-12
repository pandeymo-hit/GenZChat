import React, { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaPaperPlane } from 'react-icons/fa';
import FadeUpSection from '../hooks/FadeUpSection';
import TypewriterHeading from '../components/TypewriterHeading';
import girl from '../assets/girl.webp';
import boy from '../assets/image.webp';

const MainSection = () => {
  const { openSignupForm } = useContext(AuthContext);

  // shift in vw: 0 = original, e.g. 12 = close together
  const [shiftVW, setShiftVW] = useState(0);
  const lastY = useRef(typeof window !== 'undefined' ? window.scrollY : 0);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current; // negative = scrolling up
      lastY.current = y;

      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        if (delta < -4) {
          // ⬆️ scrolling UP → images go FAR (back to original)
          setShiftVW(0);
        } else if (delta > 4) {
          // ⬇️ scrolling DOWN → images come CLOSER
          setShiftVW(8); // tweak 8–16 as you like
        }
        ticking.current = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <FadeUpSection>
      <section
        className="relative mx-auto mt-5 overflow-visible" // was overflow-hidden
        style={{
          // ek hi jagah size control — screen ke hisaab se auto
          '--hero-img-h': 'clamp(170px, 30vw, 440px)',
          // jitni jagah reserve karni (image height + thoda extra)
          '--hero-reserve': 'calc(var(--hero-img-h) + 56px)',
        }}
      >
        <div className="relative z-10 max-w-6xl mx-auto mb-8 pb-[var(--hero-reserve)]">
          <div className="text-center space-y-6 md:space-y-5">
            <div className="flex justify-center items-center gap-3 flex-wrap text-gray-400 text-base px-2 mb-6">
              <span className="badge-red">Left on Seen</span>
              <span className="badge-red">Getting "hmm"</span>
              <span className="badge-red">Chats dying</span>
            </div>

            <p className="text-gray-500 font-semibold pt-2">We Present</p>
            <TypewriterHeading />

            <p className="text-gray-500 font-semibold leading-8 sm:leading-0 text-xl mx-auto pt-8 hidden sm:block">
              Stop getting left on seen.Start real conversations with GenZChat.
            </p>

            <div className="pt-3 sm:pt-6">
              <button
                // onClick={() => openForm("signup")}
                onClick={openSignupForm}
                type="button"
                className="btn-aurora relative inline-flex items-center justify-center overflow-hidden rounded-[100px] p-[2px]"
              >
                <span className="relative z-[1] inline-flex items-center justify-center gap-2 rounded-[100px] px-8 py-3.5 md:px-10 md:py-4 text-gray-100 text-base sm:text-lg font-semibold bg-black/80 shadow-md">
                  <FaPaperPlane className="w-5 h-5" />
                  Start for free
                </span>
              </button>


            </div>
          </div>
        </div>

         {/* Left (girl) */}
        <img
          src={girl}
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute bottom-0 left-5 sm:left-22 
          w-[clamp(160px,30vw,450px)] h-[clamp(200px,35vw,500px)] object-contain z-0
          drop-shadow-[0_10px_40px_rgba(0,0,0,0.45)]
          transition-transform duration-1500 ease-out will-change-transform md:left-25 lg:left-50"
          style={{
            transform: `translateX(${shiftVW}vw)`,
          }}
        />

        {/* Right (boy) */}
        <img
          src={boy}
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute bottom-0 right-5 sm:right-22
          w-[clamp(160px,30vw,450px)] h-[clamp(200px,35vw,500px)] object-contain z-0
          drop-shadow-[0_10px_40px_rgba(0,0,0,0.45)]
          transition-transform duration-1500 ease-out will-change-transform md:right-25 lg:right-50"
          style={{
            transform: `translateX(-${shiftVW}vw)`,
          }}
        />
      </section>
    </FadeUpSection>
  );
};

export default MainSection;