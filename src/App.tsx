import { useState, useCallback, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Universe } from "./components/Universe";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { MemoryModal } from "./components/MemoryModal";
import { SecretReveal } from "./components/SecretReveal";
import { DayCounter } from "./components/DayCounter";
import { HintOverlay } from "./components/HintOverlay";
import { MusicPlayer } from "./components/MusicPlayer";
import type { Memory } from "./data/memories";

function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="text-6xl animate-pulse mb-4">💫</div>
        <p className="text-pink-300/80 text-lg">جاري تحميل الكون...</p>
        <div className="mt-4 w-48 h-1 bg-pink-950 rounded-full overflow-hidden mx-auto">
          <div
            className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-shimmer"
            style={{ width: "60%" }}
          />
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial color="#ff69b4" wireframe />
    </mesh>
  );
}

export function App() {
  const [entered, setEntered] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [showSecret, setShowSecret] = useState(false);
  const [loading, setLoading] = useState(true);
  const [musicStarted, setMusicStarted] = useState(false);

  const handleSelectMemory = useCallback((memory: Memory) => {
    setSelectedMemory(memory);
  }, []);

  const handleActivateGateway = useCallback(() => {
    setShowSecret(true);
  }, []);

  const handleEnter = useCallback(() => {
    setEntered(true);
    setMusicStarted(true);
  }, []);

  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative">
      {/* Loading screen */}
      {loading && <LoadingScreen />}

      {/* Welcome screen */}
      {!entered && !loading && (
        <WelcomeScreen onEnter={handleEnter} />
      )}

      {/* 3D Canvas */}
      <Canvas
        camera={{
          position: [0, 5, 25],
          fov: 60,
          near: 0.1,
          far: 600,
        }}
        style={{ background: "#000005" }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
        }}
        dpr={[1, 2]}
        onCreated={() => {
          setTimeout(() => setLoading(false), 1500);
        }}
        eventSource={document.getElementById("root")!}
        eventPrefix="client"
      >
        <Suspense fallback={<LoadingFallback />}>
          {/* Our universe */}
          <Universe
            onSelectMemory={handleSelectMemory}
            onActivateGateway={handleActivateGateway}
          />

          {/* Camera controls */}
          <OrbitControls
            enablePan={false}
            minDistance={6}
            maxDistance={55}
            autoRotate
            autoRotateSpeed={0.2}
            enableDamping
            dampingFactor={0.08}
            maxPolarAngle={Math.PI * 0.85}
            minPolarAngle={Math.PI * 0.15}
            rotateSpeed={0.5}
            zoomSpeed={0.8}
          />

          {/* Fog for depth */}
          <fog attach="fog" args={["#000008", 80, 300]} />
        </Suspense>
      </Canvas>

      {/* UI Overlays */}
      {entered && !loading && (
        <>
          <DayCounter />
          <HintOverlay />
        </>
      )}

      {/* Music Player - starts when entering */}
      <MusicPlayer playing={musicStarted} />

      {/* Memory Modal */}
      {selectedMemory && (
        <MemoryModal
          memory={selectedMemory}
          onClose={() => setSelectedMemory(null)}
        />
      )}

      {/* Secret Reveal */}
      {showSecret && (
        <SecretReveal onClose={() => setShowSecret(false)} />
      )}
    </div>
  );
}
