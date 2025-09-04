// src/components/BackgroundAnimation.jsx
import React, { useEffect, useRef } from "react";

const icons = ["✨", "💫", "❄", "💝"];

const BackgroundAnimation = () => {
  const containerRef = useRef(null);

  // Define strips with their left position and active icons count
  const strips = [
    { left: "10%", activeCount: 0 },
    { left: "90%", activeCount: 0 },
  ];

  useEffect(() => {
    const container = containerRef.current;
    const activeIcons = new Set();

    const createIcon = () => {
      // Find a strip with less than 2 active icons
      const availableStrip = strips.find((strip) => strip.activeCount < 2);
      if (!availableStrip) return; // no strip available, wait

      const icon = document.createElement("div");
      icon.className = "absolute text-white opacity-30 pointer-events-none select-none";
      icon.style.fontSize = `${Math.random() * 10 + 8}px`;
      icon.style.left = availableStrip.left;

      // start near bottom (just outside viewport)
      icon.style.top = `115%`;

      icon.textContent = icons[Math.floor(Math.random() * icons.length)];

      container.appendChild(icon);
      activeIcons.add(icon);
      availableStrip.activeCount += 1;

       // Animation duration — jitna chota duration hoga, icon utni tezi se upar jayega
      const duration = 20000; // 20 sec

      const animation = icon.animate(
        [
          { transform: `translateY(0px)`, opacity: 1 },
          { transform: `translateY(-110vh)`, opacity: 0 }, // 110vh moves icon fully above viewport
        ],
        {
          duration,
          iterations: 1,
          easing: "linear",
        }
      );

      animation.onfinish = () => {
        container.removeChild(icon);
        activeIcons.delete(icon);
        availableStrip.activeCount -= 1;
      };
    };

    const interval = setInterval(() => {
      createIcon();
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden z-0"
      style={{ pointerEvents: "none" }}
    ></div>
  );
};

export default BackgroundAnimation;
