// src/components/StepCard.jsx
import React from "react";

const StepCard = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-center text-center p-8 rounded-lg bg-transparent">
      {/* Icon Circle */}
      <div className="bg-purple-500 rounded-full p-6 mb-6 flex items-center justify-center">
        {React.cloneElement(icon, { className: "text-white text-4xl" })}
      </div>

      {/* Title */}
      <h3 className="font-semibold text-xl mb-3">{title}</h3>

      {/* Description */}
      <p className="text-base text-gray-300">{description}</p>
    </div>
  );
};

export default StepCard;
