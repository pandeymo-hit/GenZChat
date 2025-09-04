import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const avatars = [
  "https://i.pravatar.cc/100?img=1",
  "https://i.pravatar.cc/100?img=2",
  "https://i.pravatar.cc/100?img=3",
  "https://i.pravatar.cc/100?img=4",
  "https://i.pravatar.cc/100?img=5",
];

export default function OnBoardingPage() {
  const [error, setError] = useState("");
  const {
    showForm,
    dp,
    setDp,
    username,
    setUserName,
    password,
    setPassword,
    gender,
    setGender,
    dob,
    setDob,
    terms,
    setTerms,
    saveProfile,
  } = useContext(AuthContext);

  if (!showForm) return null;


  const calculateAge = (dob) => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const diff = Date.now() - birthDate.getTime();
    return new Date(diff).getUTCFullYear() - 1970;
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setError("");

  //   if (!username.trim()) return setError("⚠️ Please enter your name");
  //   if (password.length < 6)
  //     return setError("⚠️ Password must be at least 6 characters");
  //   if (!gender) return setError("⚠️ Please select your gender");
  //   const age = calculateAge(dob);
  //   if (age < 18) return setError("⚠️ Minimum age should be 18");
  //   if (!terms) return setError("⚠️ Please accept Terms & Conditions");

  //   saveProfile(); // send data to backend
  // };

  return (
    <div className="fixed inset-0 flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 px-4">
      <div className="w-full max-w-md bg-gray-800 text-white shadow-xl rounded-2xl p-6">
        {/* Profile DP */}
        <div className="flex justify-center mb-6">
          <img
            src={dp}
            alt="DP"
            className="w-24 h-24 rounded-full border-4 border-purple-500 shadow-md"
          />
        </div>

        {/* Avatar Selection */}
        <div className="flex justify-center gap-3 mb-6">
          {avatars.map((avatar, idx) => (
            <img
              key={idx}
              src={avatar}
              alt={`Avatar ${idx}`}
              className={`w-12 h-12 rounded-full cursor-pointer border-2 transform transition duration-200 hover:scale-110 ${
                dp === avatar ? "border-purple-500" : "border-transparent"
              }`}
              onClick={() => setDp(avatar)}
            />
          ))}
        </div>

        {/* Form */}
        <form  className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border p-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Gender & DOB */}
          <div className="flex gap-4">
            <select
              className="border p-3 rounded-xl bg-gray-700 text-white flex-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="Male">👨 Male</option>
              <option value="Female">👩 Female</option>
              <option value="Transgender">⚧ Transgender</option>
              <option value="Prefer not to say">🙈 Prefer not to say</option>
            </select>

            <input
              type="date"
              className="border p-3 rounded-xl bg-gray-700 text-white flex-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>

          {/* Terms */}
          <div className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              className="w-4 h-4 accent-purple-600"
            />
            <label>I agree to the Terms & Conditions</label>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500 text-white p-2 rounded-xl text-center text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            onClick={saveProfile}
            className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition duration-200 shadow-md"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}
