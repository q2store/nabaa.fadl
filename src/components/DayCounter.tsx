import { useState, useEffect } from "react";
import { friendshipQuotes } from "../data/memories";

export function DayCounter() {
  const [quote, setQuote] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    setQuote(friendshipQuotes[Math.floor(Math.random() * friendshipQuotes.length)]);
    setTimeout(() => setShow(true), 500);
  }, []);

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-40 text-center pointer-events-none transition-all duration-1000 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}
    >
      <div className="bg-black/50 backdrop-blur-xl rounded-2xl px-6 py-3 border border-pink-500/15 shadow-xl shadow-pink-500/10">
        <p
          className="text-pink-200/70 text-sm md:text-base max-w-[280px] leading-relaxed"
          dir="rtl"
        >
          {quote}
        </p>
      </div>
    </div>
  );
}
