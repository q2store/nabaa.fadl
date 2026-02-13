import { useEffect, useState } from "react";

interface SecretRevealProps {
  onClose: () => void;
}

export function SecretReveal({ onClose }: SecretRevealProps) {
  const [phase, setPhase] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const t1 = setTimeout(() => setPhase(1), 1500);
    const t2 = setTimeout(() => setPhase(2), 3500);
    const t3 = setTimeout(() => setPhase(3), 6500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 800);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-1000 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-black">
        {/* Animated stars */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 80 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${1 + Math.random() * 2}px`,
                height: `${1 + Math.random() * 2}px`,
                backgroundColor:
                  i % 3 === 0
                    ? "#ff69b4"
                    : i % 3 === 1
                    ? "#ffd700"
                    : "#ffffff",
                animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: Math.random() * 0.8,
              }}
            />
          ))}
        </div>

        {/* Radial glow */}
        <div
          className={`absolute inset-0 transition-opacity duration-[3000ms] ${
            phase >= 1 ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background:
              "radial-gradient(circle at center, rgba(100,149,237,0.25) 0%, rgba(50,0,100,0.1) 40%, transparent 70%)",
          }}
        />

        {/* Second glow layer */}
        <div
          className={`absolute inset-0 transition-opacity duration-[3000ms] ${
            phase >= 2 ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background:
              "radial-gradient(circle at center, rgba(255,215,0,0.1) 0%, transparent 50%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-lg w-full">
        {/* Phase 0: Initial glow */}
        {phase === 0 && (
          <div className="transition-all duration-[1500ms] opacity-100 scale-100">
            <div className="text-8xl md:text-9xl animate-pulse drop-shadow-2xl">
              💫
            </div>
          </div>
        )}

        {/* Phase 1: Building up */}
        {phase === 1 && (
          <div className="animate-fadeIn">
            <p className="text-blue-300 text-2xl md:text-3xl font-light mb-6 leading-relaxed" dir="rtl">
              تدرين ليش سويت هذا الكون يا غفران؟
            </p>
            <div className="text-6xl md:text-7xl animate-pulse">🌌</div>
          </div>
        )}

        {/* Phase 2: The message */}
        {phase >= 2 && (
          <div className="animate-fadeIn">
            <div className="mb-8">
              <div className="text-7xl md:text-8xl mb-8 drop-shadow-2xl">⭐</div>
              <h1
                className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-yellow-300 bg-clip-text text-transparent leading-relaxed"
                dir="rtl"
              >
                كل هذا الكون…
              </h1>
              <div className="h-4" />
              <h1
                className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-yellow-300 via-pink-300 to-blue-300 bg-clip-text text-transparent leading-relaxed"
                dir="rtl"
              >
                وما لكَيت غيرج صديقة حقيقية
              </h1>
              <div className="mt-8 text-5xl md:text-6xl">💙💫</div>
            </div>

            {/* Stars animation */}
            <div className="flex justify-center gap-4 mt-6">
              {["⭐", "🌟", "💫", "✨", "🔥"].map((star, i) => (
                <span
                  key={i}
                  className="text-3xl md:text-4xl animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  {star}
                </span>
              ))}
            </div>

            {/* Additional message */}
            {phase >= 3 && (
              <div className="mt-12 space-y-3 animate-fadeIn">
                <p
                  className="text-blue-200/80 text-xl md:text-2xl font-light"
                  dir="rtl"
                >
                  غفران… إنتي مو بس صديقتي
                </p>
                <p
                  className="text-blue-200/80 text-xl md:text-2xl font-light"
                  dir="rtl"
                >
                  إنتي عائلة اخترتها بنفسي 💙
                </p>
                <p
                  className="text-purple-200/60 text-lg md:text-xl font-light mt-4"
                  dir="rtl"
                >
                  — من صديقج بلال ⭐
                </p>
                <div className="pt-8">
                  <button
                    onClick={handleClose}
                    className="px-12 py-5 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 text-white font-bold text-xl hover:from-blue-600 hover:via-purple-600 hover:to-blue-600 transition-all duration-300 shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60 hover:scale-110 active:scale-95 animate-pulse"
                  >
                    صداقة للأبد ♾️⭐
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
