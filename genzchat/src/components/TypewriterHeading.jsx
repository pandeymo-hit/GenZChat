import React, { useMemo } from "react";
import Typewriter from "typewriter-effect";

export default function TypewriterHeading() {
  const words = ["Convo Starter", "Dating Coach", "Flirty Friend"];

  // longest word for ghost
  const longest = useMemo(
    () => words.reduce((a, b) => (a.length >= b.length ? a : b), ""),
    [words]
  );
  const ghostWord = `${longest}\u00A0`;

  return (
    <h1
      className="text-[45px] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl 
                 font-extrabold leading-tight text-center mx-auto
                 text-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 bg-clip-text
                 max-w-4xl md:max-w-5xl lg:max-w-6xl"
    >
      <span className="block">
        Your Personal AI{" "}
        <span className="inline-grid align-baseline pl-2 flex-shrink-0">
          {/* Ghost keeps consistent width */}
          <span
            className="invisible col-start-1 row-start-1 select-none inline-block"
            aria-hidden="true"
          >
            {ghostWord}
          </span>

          {/* Typewriter overlays ghost */}
          <span className="col-start-1 row-start-1 inline-block">
            <Typewriter
              options={{
                strings: words,
                autoStart: true,
                loop: true,
                delay: 65,
                deleteSpeed: 40,
                cursor: '|',
                cursorClassName: 'text-white animate-pulse'
              }}
            />
          </span>
        </span>
      </span>
      <span className="text-gray-200 block">GenZChat</span>
    </h1>
  );
}