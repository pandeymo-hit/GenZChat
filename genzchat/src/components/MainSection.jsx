import React, { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaPaperPlane } from 'react-icons/fa';
import FadeUpSection from '../hooks/FadeUpSection';
import TypewriterHeading from '../components/TypewriterHeading';
import StatsBlock from '../components/StatsBlock';
import girl from '../assets/girl.webp';
import boy from '../assets/image.webp';

const MainSection = () => {
  const { openForm } = useContext(AuthContext);

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
        setShiftVW(12); // tweak 8–16 as you like
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
        className="relative mx-auto mt-5 sm:mt-13 overflow-hidden pb-28 sm:pb-36 md:pb-44 lg:pb-88"
      >
        <div className="relative z-10 max-w-6xl mx-auto mb-25 md:mb-1">
          <div className="text-center space-y-6 md:space-y-5">
            <div className="flex justify-center items-center gap-3 flex-wrap text-gray-400 text-base px-2 mb-6">
              <span className="badge-red">Left on Seen</span>
              <span className="badge-red">Getting "hmm"</span>
              <span className="badge-red">Chats dying</span>
            </div>

            <p className="text-gray-500 font-semibold pt-2">We Present</p>
            <TypewriterHeading />

            <p className="text-gray-500 font-semibold leading-8 sm:leading-0 text-xl mx-auto pt-8 hidden sm:block">
              Unlock the power of AI with our cutting-edge platform.
            </p>

            <div className="pt-3 sm:pt-6">
              <button
                className="relative border border-gray-700 hover:border-[1.5px] hover:border-gray-400 transition-all duration-300 text-gray-100 px-8 py-3.5 rounded-4xl text-base sm:text-lg md:px-10 md:py-4 font-semibold shadow-md hover:shadow-purple-900/30 group flex items-center justify-center gap-2 mx-auto bg-gradient-to-r from-purple-500 to-blue-500"
                onClick={openForm}
              >
                <FaPaperPlane className="w-5 h-5" />
                Start for free
              </button>

              <StatsBlock />
            </div>
          </div>
        </div>

        {/* Left (girl) */}
        <img
          src={girl}
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -bottom-[1px] left-6 sm:left-0
                     w-[clamp(140px,28vw,420px)] max-h-[50vh] object-contain z-0
                     drop-shadow-[0_10px_40px_rgba(0,0,0,0.45)]
                     transition-transform duration-1500 ease-out will-change-transform  md:left-36"
          style={{
            transform: `translateX(${shiftVW}vw)`,
          }}
        />

        {/* Right (boy) */}
        <img
          src={boy}
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -bottom-[1px] right-6 sm:right-0
                     w-[clamp(140px,28vw,420px)] max-h-[50vh] object-contain z-0
                     drop-shadow-[0_10px_40px_rgba(0,0,0,0.45)]
                     transition-transform duration-1500 ease-out will-change-transform md:right-36"
          style={{
            transform: `translateX(-${shiftVW}vw)`,
          }}
        />
      </section>
    </FadeUpSection>
  );
};

export default MainSection;
