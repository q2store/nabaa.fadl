import { useState, useEffect } from "react";

export function HintOverlay() {
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setShow(false), 1000);
    }, 7000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-40 transition-all duration-1000 ${
        fadeOut ? "opacity-0 translate-y-4" : "opacity-100"
      }`}
    >
      <div className="bg-black/60 backdrop-blur-xl rounded-2xl px-6 py-4 border border-purple-500/15 text-center shadow-lg shadow-purple-500/10">
        <p className="text-purple-200/80 text-sm md:text-base" dir="rtl">
          🌟 المسي النجوم لاكتشاف الذكريات 🌟
        </p>
        <p className="text-purple-300/40 text-xs mt-1.5" dir="rtl">
          اسحبي للتدوير • قرّبي وبعّدي بإصبعين
        </p>
      </div>
    </div>
  );
}
