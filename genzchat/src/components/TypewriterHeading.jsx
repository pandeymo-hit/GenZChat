import React, { useMemo } from "react";
import Typewriter from "typewriter-effect";

export default function TypewriterHeading() {
  const words = ["convo starter", "dating coach", "Flirty wingman"];

  // Longest string for stable slot width
  const longest = useMemo(
    () => words.reduce((a, b) => (a.length >= b.length ? a : b), ""),
    []
  );
  const ghostWord = `${longest}\u00A0`; // extra space for cursor width

  return (
    <h1
      className="
        font-extrabold leading-[1.1]
        text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl
        tracking-tight md:tracking-[-0.01em]
        text-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 bg-clip-text
        text-center px-4 max-w-[min(92vw,1200px)] mx-auto
      "
    >
      {/* Left phrase (breaks to its own line on small screens) */}
      <span className="block sm:inline">Your Personal AI&nbsp;</span>

      {/* Typewriter slot: ghost sets fixed width; live sits on top */}
      <span className="inline-grid align-baseline w-fit">
        {/* Ghost occupies width, invisible but keeps layout stable */}
        <span
          className="invisible col-start-1 row-start-1 select-none whitespace-nowrap"
          aria-hidden="true"
        >
          {ghostWord}
        </span>

        {/* Live typewriter in same grid cell */}
        <span className="col-start-1 row-start-1 whitespace-nowrap">
          <Typewriter
            options={{
              strings: words,
              autoStart: true,
              loop: true,
              delay: 70,
              deleteSpeed: 45,
              wrapperClassName: "tw-wrap",   // custom classes below
              cursorClassName: "tw-cursor",
            }}
          />
        </span>
      </span>

      {/* Brand on next line for small screens, inline for larger */}
      <span className="block sm:inline text-gray-200 mt-2 sm:mt-0"> GenZChat</span>

      {/* Local styles for the Typewriter internals */}
      <style>{`
        .tw-wrap {
          display: inline-block;
          vertical-align: baseline;
          /* inherit font weight/size/gradient from H1 */
        }
        .tw-cursor {
          display: inline-block;
          margin-left: 0.08em;
          /* Cursor should be visible over gradient text */
          color: rgba(255,255,255,0.9);
        }
        /* Prevent selection highlighting oddities on mobile */
        .tw-wrap::selection, .tw-cursor::selection { background: transparent; }
      `}</style>
    </h1>
  );
}
