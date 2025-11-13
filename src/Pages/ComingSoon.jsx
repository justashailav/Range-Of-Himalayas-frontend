import React, { useEffect, useState } from "react";

export default function ComingSoon() {
  const launchDate = new Date("2025-03-01T00:00:00"); // 🗓️ Set your real launch date
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = launchDate - now;

      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          mins: Math.floor((diff / (1000 * 60)) % 60),
          secs: Math.floor((diff / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [launchDate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-rose-100 text-center px-4">
      <img
        src="/images/apple-logo.png"
        alt="Brand Logo"
        className="w-20 mb-6 animate-pulse"
      />

      <h1 className="text-3xl sm:text-5xl font-bold text-gray-800 mb-4">
        We’re Launching Soon 🍎
      </h1>
      <p className="text-gray-600 text-lg max-w-md mb-8">
        Our fresh Himachali apples are almost ready to reach your doorstep.
        Stay tuned for something delicious!
      </p>

      {/* Countdown Timer */}
      <div className="flex gap-4 sm:gap-6 text-center mb-10">
        {[
          { label: "Days", value: timeLeft.days },
          { label: "Hours", value: timeLeft.hours },
          { label: "Minutes", value: timeLeft.mins },
          { label: "Seconds", value: timeLeft.secs },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md px-4 py-3 sm:px-6 sm:py-4"
          >
            <p className="text-3xl sm:text-5xl font-bold text-[#F08C7D]">
              {item.value < 10 ? `0${item.value}` : item.value}
            </p>
            <p className="text-sm sm:text-base text-gray-600 mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Notify Button */}
      <a
        href="https://forms.gle/your-google-form-link" // replace with your actual form link
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-[#F08C7D] text-white font-semibold text-lg py-3 px-8 rounded-full shadow-md hover:bg-[#e67a6c] transition-all"
      >
        Notify Me
      </a>

      <p className="mt-8 text-gray-500 text-sm">
        © {new Date().getFullYear()} YourBrand. All rights reserved.
      </p>
    </div>
  );
}
