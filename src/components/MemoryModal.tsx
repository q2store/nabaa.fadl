import { useEffect, useState } from "react";
import type { Memory } from "../data/memories";

interface MemoryModalProps {
  memory: Memory;
  onClose: () => void;
}

export function MemoryModal({ memory, onClose }: MemoryModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 500);
  };

  const formattedDate = new Date(memory.date).toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />

      {/* Floating particles in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: i % 2 === 0 ? "#ff69b4" : "#ffd700",
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              opacity: 0.4,
            }}
          />
        ))}
      </div>

      {/* Modal */}
      <div
        className={`relative max-w-md w-full transform transition-all duration-700 ${
          visible
            ? "scale-100 translate-y-0"
            : "scale-75 translate-y-10"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-purple-900/95 via-pink-900/95 to-indigo-900/95 border border-pink-400/20 shadow-2xl shadow-pink-500/30">
          {/* Decorative top glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full blur-3xl opacity-30"
            style={{
              background:
                "radial-gradient(circle, rgba(255,105,180,0.8) 0%, transparent 70%)",
            }}
          />

          {/* Header with emoji */}
          <div className="text-center pt-10 pb-4 relative">
            <div
              className={`text-7xl mb-4 transition-all duration-1000 delay-200 ${
                visible
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-50"
              }`}
            >
              <span className="inline-block animate-bounce drop-shadow-2xl">
                {memory.emoji}
              </span>
            </div>
            <h2
              className={`text-3xl font-bold bg-gradient-to-r from-pink-200 to-pink-100 bg-clip-text text-transparent transition-all duration-700 delay-300 ${
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              {memory.title}
            </h2>
            <p
              className={`text-pink-400/60 text-sm mt-2 font-light tracking-wider transition-all duration-700 delay-400 ${
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              {formattedDate}
            </p>
          </div>

          {/* Divider */}
          <div className="flex justify-center px-10">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-pink-400/40 to-transparent" />
          </div>

          {/* Message */}
          <div className="p-8 pb-4">
            <p
              className={`text-white/90 text-lg leading-loose text-center font-light transition-all duration-700 delay-500 ${
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              dir="rtl"
            >
              {memory.message}
            </p>
          </div>

          {/* Sparkles decoration */}
          <div className="flex justify-center gap-3 pb-3 text-xl">
            {["✨", "💫", "✨"].map((s, i) => (
              <span
                key={i}
                className="animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                {s}
              </span>
            ))}
          </div>

          {/* Close button */}
          <div className="p-6 pt-3 text-center">
            <button
              onClick={handleClose}
              className="px-10 py-3.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-300 shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-105 active:scale-95 text-lg"
            >
              الرجوع للكون 🌌
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
