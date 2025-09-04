import React, { useState, useRef } from "react";

const OTPInput = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputsRef = useRef([]);

  // Handle input change
  const handleChange = (e, index) => {
    const val = e.target.value;
    if (!/^\d*$/.test(val)) return; // allow only digits

    const newOtp = [...otp];
    newOtp[index] = val.slice(-1); // only last digit
    setOtp(newOtp);

    // Focus next input if input filled
    if (val && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "") {
        if (index > 0) {
          inputsRef.current[index - 1].focus();
        }
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").slice(0, 4);
    if (!/^\d+$/.test(paste)) return;
    const pasteArr = paste.split("");
    const newOtp = [...otp];
    for (let i = 0; i < 4; i++) {
      newOtp[i] = pasteArr[i] || "";
      if (inputsRef.current[i]) inputsRef.current[i].value = newOtp[i];
    }
    setOtp(newOtp);
    if (inputsRef.current[3]) inputsRef.current[3].focus();
  };

  const handleSubmit = () => {
    alert("Entered OTP: " + otp.join(""));
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#0b0b13] px-4">
      <div className="max-w-sm w-full bg-[#14141f] rounded-xl p-8 text-center text-white space-y-6 shadow-lg relative">
        
        {/* Top badge */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-purple-700 text-purple-300 text-sm px-4 py-1 rounded-full flex items-center space-x-2 select-none cursor-default">
          <span>30K+ users never left on read</span>
          <span className="text-xl">👀</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-extrabold text-blue-600">GENZCHAT</h1>

        {/* Chat icon */}
        <div className="mx-auto w-12 h-12 relative">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/742/742751.png" 
            alt="Chat Icon" 
            className="mx-auto w-full h-full object-contain" 
          />
        </div>

        {/* Subtitle */}
        <p className="text-gray-400 text-sm">
          Teaching you to text like you mean it <span>💬</span>
        </p>

        {/* OTP message */}
        <p className="text-green-400 text-sm font-semibold">
          ✓ OTP sent to your WhatsApp!
        </p>

        {/* OTP inputs */}
        <div
          onPaste={handlePaste}
          className="flex justify-center space-x-4 border border-purple-700 rounded-lg px-3 py-2"
        >
          {otp.map((num, idx) => (
            <input
              key={idx}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={num}
              ref={(el) => (inputsRef.current[idx] = el)}
              onChange={(e) => handleChange(e, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className="w-10 h-12 text-center bg-transparent border border-purple-700 rounded-md text-white font-semibold text-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          ))}
        </div>

        {/* Verify button */}
        <button
          onClick={handleSubmit}
          className="w-full py-3 font-semibold rounded-md bg-gradient-to-r from-purple-600 to-cyan-400 hover:from-purple-700 hover:to-cyan-500 transition-colors"
        >
          Verify & Enter
        </button>
      </div>
    </div>
  );
};

export default OTPInput;
