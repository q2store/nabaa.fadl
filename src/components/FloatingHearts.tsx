import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function FloatingHearts() {
  const ref = useRef<THREE.Points>(null);
  const ref2 = useRef<THREE.Points>(null);
  const count = 150;
  const count2 = 80;

  // Pink/rose particles
  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 70;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 70;
      spd[i] = 0.2 + Math.random() * 0.5;
    }
    return [pos, spd];
  }, []);

  // Gold dust particles
  const [positions2, speeds2] = useMemo(() => {
    const pos = new Float32Array(count2 * 3);
    const spd = new Float32Array(count2);
    for (let i = 0; i < count2; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
      spd[i] = 0.1 + Math.random() * 0.3;
    }
    return [pos, spd];
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (ref.current) {
      const posArray = ref.current.geometry.attributes.position
        .array as Float32Array;
      for (let i = 0; i < count; i++) {
        posArray[i * 3 + 1] +=
          Math.sin(t * speeds[i] + i * 0.5) * 0.003;
        posArray[i * 3] +=
          Math.cos(t * speeds[i] * 0.5 + i) * 0.002;
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
      ref.current.rotation.y = t * 0.015;
    }

    if (ref2.current) {
      const posArray = ref2.current.geometry.attributes.position
        .array as Float32Array;
      for (let i = 0; i < count2; i++) {
        posArray[i * 3 + 1] +=
          Math.sin(t * speeds2[i] + i * 0.7) * 0.002;
      }
      ref2.current.geometry.attributes.position.needsUpdate = true;
      ref2.current.rotation.y = -t * 0.01;
    }
  });

  return (
    <>
      {/* Rose particles */}
      <points ref={ref}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#ff69b4"
          size={0.2}
          sizeAttenuation
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Gold dust */}
      <points ref={ref2}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions2, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#ffd700"
          size={0.15}
          sizeAttenuation
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </>
  );
}
