import React, { useState } from "react";

const faqs = [
  {
    question: "How does GenZChat work?",
    answer:
      "GenZChat uses advanced AI to analyze your conversation context and generate personalized, flirty responses that match your communication style. Simply paste your chat or describe the situation, and get instant suggestions."
  },
  { question: "Is my chat data private?", answer: "Yes, your data is fully encrypted and private." },
  { question: "What languages are supported?", answer: "Multiple languages are supported." },
  { question: "Can I use this with any messaging app?", answer: "Yes, it works with any messaging app." },
  { question: "Is there a free trial?", answer: "Yes, you can try it for free before subscribing." },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="  pb-15 pt-15 text-white flex flex-col items-center ">
      <h2 className="text-4xl font-bold mb-13 ">
        Frequently <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Asked Questions</span>
      </h2>

      <div className="w-full max-w-3xl space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`border-b border-gray-800 hover:border-b-2  transition-all duration-300 ${
              openIndex === index ? "bg-gray-600/40" : "bg-transparent"
            }`}
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center p-4  font-medium focus:outline-none"
            >
              {faq.question}
              <span className="text-white">
                {openIndex === index ? "-" : "+"}
              </span>
            </button>
            {openIndex === index && (
              <div className="px-4 pb-4 text-gray-300 text-sm">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection; 