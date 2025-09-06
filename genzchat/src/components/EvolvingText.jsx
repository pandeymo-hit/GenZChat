import React, { useEffect, useState } from "react";

export default function EvolvingText({
  texts = [],
  interval = 2500,      // total time per item
  fadeDuration = 600,   // fade in/out duration
  className = "",
  as: Tag = "span",
}) {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (!texts.length) return;
    let timeoutId;

    const tick = setInterval(() => {
      setFade(false); // fade out
      timeoutId = setTimeout(() => {
        setIndex((i) => (i + 1) % texts.length); // swap text
        setFade(true); // fade in
      }, fadeDuration);
    }, interval);

    return () => {
      clearInterval(tick);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [texts.length, interval, fadeDuration]);

  if (!texts.length) return null;

  return (
    <Tag
      aria-live="polite"
      aria-atomic="true"
      className={`inline-block transition-opacity ${fade ? "opacity-100" : "opacity-0"} ${className}`}
      style={{ transitionDuration: `${fadeDuration}ms` }}
    >
      {texts[index]}
    </Tag>
  );
}
