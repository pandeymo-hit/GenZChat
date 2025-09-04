import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules"; // Autoplay जोड़ा
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

const chats = [
  {
    id: 1,
    name: "Emma",
    emoji: "👩‍💻",
    messages: [
      { from: "other", text: "I'm having such a long day at work" },
      {
        from: "self",
        text: "Aw, sounds like you need some serious self-care time! How about I virtually send you some good vibes and maybe we plan something fun for the weekend? 🌟✨",
      },
      { from: "other", text: "You always know how to cheer me up! 🥰" },
    ],
  },
   {
    id: 2,
    name: "Shalini",
    emoji: "👨‍🎨",
    messages: [
      { from: "other", text: "Tumhara pyar mujhe dikh kyu ni rha h" },
      {
        from: "self",
        text: "kyuki ldkiyo ko saccha pyar nahi dikhta na isliye💡",
      },
      { from: "other", text: "Tumhe b to nhi dikhta h kyu??" },
      {
        from: "self",
        text: "kyuki ldke pyar m andhe hote h na 😎",
      },
    ],
  },
  {
    id: 3,
    name: "Jake",
    emoji: "🧑‍💼",
    messages: [
      { from: "other", text: "Do you believe in love at first sight?" },
      {
        from: "self",
        text: "I believe in connection at first conversation 😊 And speaking of connections... I'm really enjoying talking with you. There's something special here ✨",
      },
      { from: "other", text: "Smooth! I like that answer 😘" },
    ],
  },
  {
    id: 4,
    name: "Shalini",
    emoji: "👨‍🎨",
    messages: [
      { from: "other", text: "Tumhara pyar mujhe dikh kyu ni rha h" },
      {
        from: "self",
        text: "kyuki ldkiyo ko saccha pyar nahi dikhta na isliye💡",
      },
      { from: "other", text: "Tumhe b to nhi dikhta h kyu??" },
      {
        from: "self",
        text: "kyuki ldke pyar m andhe hote h na 😎",
      },
    ],
  },
];

const ChatSlider = () => {
  return (
    <section className="max-w-7xl mx-auto md:px-12 py-10  text-white w-full bg-black/20 backdrop-blur-4xl">
      <div className="px-4 sm:px-6 md:px-9 mb-6 md:pb-9 text-center md:text-left">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
          Real Problems, <span className="">Real Solutions</span>
        </h2>
        <p className="text-sm sm:text-base text-gray-300">
          Swipe to see how AI handles every situations
        </p>
      </div>

      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={1.2}
        loops={true}
        breakpoints={{
          640: { slidesPerView: 1.5 },
          768: { slidesPerView: 2.2 },
          1024: { slidesPerView: 3.2 },
        }}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 80,
          modifier: 1,
          slideShadows: false,
        }}
       
        pagination={{
          clickable: true,
        }}
         
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true, // hover par pause
        }}
        modules={[EffectCoverflow, Pagination, Autoplay]} // Autoplay
        className="mySwiper"
      >
        {chats.map(({ id, name, emoji, messages }) => (
          <SwiperSlide key={id}
          className="pt-4">
            <div className=" rounded-xl p-8 flex flex-col border border-gray-500 hover:border-violet-900 hover:scale-105 transition-transform duration-400 ease-in-out h-full">
              <h3 className="text-gray-300 font-semibold flex items-center space-x-2 mb-4">
                <span>{emoji}</span>
                <span>{name}</span>
              </h3>
              <div className="flex flex-col space-y-3">
                {messages.map(({ from, text }, i) => {
                  const isSelf = from === "self";
                  return (
                    <div
                      key={i}
                      className={`max-w-[90%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                        isSelf
                          ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white self-end rounded-tr-none"
                          : "bg-gray-800 text-gray-300 rounded-bl-none"
                      }`}
                    >
                      {text}
                    </div>
                  );
                })}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      
      <style jsx>{`
       .swiper-pagination {
        position: relative !important;
        margin-top: 20px;
      }
      `}</style>
    </section>
  );
};

export default ChatSlider;
