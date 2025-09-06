import React, { useMemo } from "react";
import Typewriter from "typewriter-effect";

export default function TypewriterHeading() {
  const words = ["Coach", "Buddy", "Friend"];
  const longest = useMemo(
    () => words.reduce((a, b) => (a.length >= b.length ? a : b), ""),
    []
  );
  const ghostWord = `${longest}\u00A0`; // extra space for cursor width

  return (
    <h1
      className="text-5xl lg:text-8xl font-extrabold leading-tight
                 text-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 bg-clip-text"
    >
      {/* keep this phrase stable; optional nowrap on larger screens */}
      <span className="sm:whitespace-nowrap">
        Your Personal AI{" "}
        <span className="inline-grid align-baseline pl-2 text-center">
          {/* Ghost sets fixed width */}
          <span
            className="invisible col-start-1 row-start-1 select-none"
            aria-hidden="true"
          >
            {ghostWord}
          </span>

          {/* Live typewriter overlays in same grid cell */}
          <span className="col-start-1 row-start-1">
            <Typewriter
              options={{
                strings: words,
                autoStart: true,
                loop: true,
                delay: 75,
                deleteSpeed: 50,
              }}
            />
          </span>
        </span>
      </span>

      <br />
      <span className="text-gray-200">GenZChat</span>
    </h1>
  );
}
