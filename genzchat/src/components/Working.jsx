// src/components/HowItWorks.jsx
import React from "react";
import { FaUpload, FaTools, FaPaperPlane } from "react-icons/fa";
import StepCard from "../components/StepCard"; 

const steps = [
  {
    id: 1,
    icon: <FaUpload />,
    title: "Share Your Chat",
    description:
      "Copy and paste your conversation or describe the situation you need help with.",
  },
  {
    id: 2,
    icon: <FaTools />,
    title: "AI Analyzes",
    description:
      "Our AI understands the context, tone, and relationship dynamics to craft the perfect response.",
  },
  {
    id: 3,
    icon: <FaPaperPlane />,
    title: "Get Perfect Reply",
    description:
      "Receive multiple personalized response options that match your style and keep the spark alive.",
  },
];

const HowItWorks = () => {
  return (
    <section className=" text-white py-18">
      <div className="max-w-6xl mx-auto px-4">
        {/* Heading */}
        <h2 className="bg-gradient-to-r from-indigo-400 to-violet-400 text-transparent bg-clip-text text-3xl md:text-4xl font-bold text-center mb-12">
          How <span className="text-violet-300">GenZChat</span> Works
        </h2>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <StepCard
              key={step.id}
              icon={step.icon}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
