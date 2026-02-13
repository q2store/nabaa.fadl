import { useMemo } from "react";
import { StarField } from "./StarField";
import { Nebula } from "./Nebula";
import { HerPlanet } from "./HerPlanet";
import { MyPlanet } from "./MyPlanet";
import { OrbitPath } from "./OrbitPath";
import { MemoryStar } from "./MemoryStar";
import { GatewayPortal } from "./GatewayPortal";
import { FloatingHearts } from "./FloatingHearts";
import { memories, type Memory } from "../data/memories";

interface UniverseProps {
  onSelectMemory: (memory: Memory) => void;
  onActivateGateway: () => void;
}

export function Universe({ onSelectMemory, onActivateGateway }: UniverseProps) {
  const starPositions = useMemo(() => {
    return memories.map((_, i) => {
      const angle = (i / memories.length) * Math.PI * 2;
      const radius = 16 + (i % 3) * 5;
      const height = Math.sin(i * 1.5) * 4;
      return [
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius,
      ] as [number, number, number];
    });
  }, []);

  return (
    <>
      {/* Lighting - subtle and atmospheric */}
      <ambientLight intensity={0.08} />
      <directionalLight
        position={[15, 10, 5]}
        intensity={0.25}
        color="#ffeedd"
      />
      <pointLight
        position={[0, 0, 0]}
        intensity={3}
        color="#ff69b4"
        distance={40}
        decay={2}
      />
      {/* Rim light for depth */}
      <pointLight
        position={[-20, 10, -20]}
        intensity={1}
        color="#4444ff"
        distance={60}
        decay={2}
      />
      <pointLight
        position={[20, -10, 15]}
        intensity={0.5}
        color="#ff4488"
        distance={50}
        decay={2}
      />

      {/* Background elements */}
      <StarField />
      <Nebula />
      <FloatingHearts />

      {/* Central planet - Her planet */}
      <HerPlanet />

      {/* Orbiting planet - My planet */}
      <MyPlanet />

      {/* Orbit path */}
      <OrbitPath />

      {/* Memory stars */}
      {memories.map((memory, i) => (
        <MemoryStar
          key={memory.id}
          memory={memory}
          position={starPositions[i]}
          onSelect={onSelectMemory}
        />
      ))}

      {/* Gateway Portal */}
      <GatewayPortal onActivate={onActivateGateway} />
    </>
  );
}
