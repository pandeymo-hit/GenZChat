import React from "react";
import Typewriter from "typewriter-effect";

export default function TypewriterHeading() {
  return (
    <h1
      className="text-5xl leading-13 sm:leading-[0.9] font-extrabold 
        text-transparent bg-gradient-to-r from-purple-500 via-blue-500 
        to-purple-500 bg-clip-text lg:text-8xl"
    >
      India's First AI {" "}
      <span className=" pl-4  inline-block min-w-[4ch] text-center">
        <Typewriter
          options={{
            strings: ["Coach", "Buddy", "Friend"],
            autoStart: true,
            loop: true,
            delay: 75,
            deleteSpeed: 50,
          }}
        />
      </span>
      <br />
      <span className="text-gray-200">GenzChat</span>
    </h1>
  );
}
