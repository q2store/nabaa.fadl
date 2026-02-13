import { useState, useEffect } from "react";

interface WelcomeScreenProps {
  onEnter: () => void;
}

export function WelcomeScreen({ onEnter }: WelcomeScreenProps) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleEnter = () => {
    setExiting(true);
    setTimeout(onEnter, 1500);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] sm:pt-[18vh] transition-all duration-[1500ms] ${
        exiting
          ? "opacity-0 scale-110"
          : visible
          ? "opacity-100 scale-100"
          : "opacity-0 scale-95"
      }`}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950/90 to-black">
        {/* Animated stars */}
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              backgroundColor:
                Math.random() > 0.7
                  ? "#ff69b4"
                  : Math.random() > 0.5
                  ? "#ffd700"
                  : "#ffffff",
              animation: `twinkle ${2 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random(),
            }}
          />
        ))}

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255,20,147,0.08) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-8">
        <div
          className={`transition-all duration-1000 delay-300 ${
            visible && !exiting
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-8xl mb-6 animate-pulse drop-shadow-2xl">💫</div>
        </div>

        <div
          className={`transition-all duration-1000 delay-500 ${
            visible && !exiting
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent mb-3 drop-shadow-lg">
            كون خاص بيج
          </h1>
          <p className="text-lg md:text-xl text-purple-300/80 font-light mb-2 tracking-widest">
            عالم الصداقة الخاص
          </p>
        </div>

        <div
          className={`transition-all duration-1000 delay-700 ${
            visible && !exiting
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="w-56 h-px bg-gradient-to-r from-transparent via-pink-400/60 to-transparent mx-auto my-8" />
          <p
            className="text-pink-200/50 text-sm md:text-base max-w-sm mx-auto mb-10 leading-relaxed"
            dir="rtl"
          >
            كون كامل مصمم خصيصاً إلج يا غفران…
            <br />
            كل نجمة فيه تحكي ذكرى، وكل كوكب يدور حولج ⭐
          </p>
        </div>

        <div
          className={`transition-all duration-1000 delay-1000 ${
            visible && !exiting
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <button
            onClick={handleEnter}
            className="group relative px-12 py-5 rounded-full overflow-hidden text-white font-bold text-xl transition-all duration-500 hover:scale-110 active:scale-95 shadow-2xl shadow-pink-500/30"
          >
            {/* Button gradient bg */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 transition-all duration-500 group-hover:from-pink-600 group-hover:via-purple-600 group-hover:to-indigo-600" />
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            {/* Border glow */}
            <div className="absolute inset-0 rounded-full border border-white/20" />
            <span className="relative drop-shadow-lg">ادخلي الكون ✨</span>
          </button>

          <p className="text-purple-400/30 text-xs mt-4 tracking-wider">
            TAP TO ENTER YOUR UNIVERSE
          </p>
        </div>

        {/* Floating emojis */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {["⭐", "🌟", "🌙", "💫", "✨", "🌸", "💎", "🔥"].map(
            (emoji, i) => (
              <span
                key={i}
                className="absolute text-2xl opacity-20"
                style={{
                  left: `${10 + i * 12}%`,
                  animation: `float ${8 + i * 2}s ease-in-out infinite`,
                  animationDelay: `${i * 0.8}s`,
                  bottom: "-10%",
                }}
              >
                {emoji}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
}
