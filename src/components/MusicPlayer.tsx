import { useState } from "react";

interface MusicPlayerProps {
  playing: boolean;
}

export function MusicPlayer({ playing }: MusicPlayerProps) {
  const [muted, setMuted] = useState(false);

  if (!playing) return null;

  return (
    <>
      {/* Hidden YouTube iframe for audio - autoplay */}
      {!muted && (
        <iframe
          className="hidden"
          width="0"
          height="0"
          src="https://www.youtube.com/embed/Zkm2_E1mfZQ?autoplay=1&loop=1&playlist=Zkm2_E1mfZQ&controls=0&showinfo=0&autohide=1&mute=0&enablejsapi=1"
          title="Background Music"
          allow="autoplay; encrypted-media"
          allowFullScreen={false}
          style={{ position: "absolute", top: -9999, left: -9999 }}
        />
      )}

      {/* Music control button */}
      <button
        onClick={() => setMuted(!muted)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-black/60 backdrop-blur-xl border border-purple-500/20 flex items-center justify-center text-xl hover:scale-110 active:scale-95 transition-all duration-300 shadow-lg shadow-purple-500/20"
        title={muted ? "تشغيل الموسيقى" : "إيقاف الموسيقى"}
      >
        {muted ? "🔇" : "🎵"}
      </button>
    </>
  );
}
