import React from "react";

// assets
import Instagram from "../assets/instagram.webp";
import WhatsApp from "../assets/whatsapp.png";
import Bumble from "../assets/bumble.webp";
import Hinge from "../assets/hinge.webp";
import Jambau from "../assets/jambau.webp";
import Tinder from "../assets/tinder.png";

export default function SocialMedia() {
  const icons = [
    { src: Instagram, name: "Instagram" },
    { src: WhatsApp,  name: "WhatsApp"  },
    { src: Bumble,    name: "Bumble"    },
    { src: Hinge,     name: "Hinge"     },
    { src: Jambau,    name: "Jambau"    },
    { src: Tinder,    name: "Tinder"    },
  ];

  return (
    <>
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .marquee-container {
            display: flex;
            width: max-content;
            animation: marquee 22s linear infinite;
          }
          .fade-mask {
            -webkit-mask-image: linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%);
                    mask-image: linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%);
          }
          /* Accessibility: respect reduced motion */
          @media (prefers-reduced-motion: reduce) {
            .marquee-container { animation: none; transform: none; }
          }
        `}
      </style>

      <section className="py-14 mt-10 relative overflow-hidden bg-black/20 backdrop-blur-5xl">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-[20px] font-black mb-8 text-gray-400">
            Works everywhere you chat
          </p>

          <div className="overflow-hidden relative fade-mask">
            <div className="marquee-container">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex whitespace-nowrap">
                  {icons.map((icon, idx) => (
                    <div
                      key={`${icon.name}-${idx}`}
                      className="
                        mx-6 sm:mx-10 
                        flex items-center gap-2
                        text-gray-300 opacity-85 hover:opacity-100
                        transition-opacity
                        leading-none
                      "
                    >
                      <img
                        src={icon.src}
                        alt={icon.name}
                        className="h-6 w-6 object-contain shrink-0"
                        draggable="false"
                      />
                      <span className="text-sm">{icon.name}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* optional tiny note */}
          {/* <p className="mt-4 text-xs text-gray-500">Tinder, Bumble, Hinge, WhatsApp & more</p> */}
        </div>
      </section>
    </>
  );
}
