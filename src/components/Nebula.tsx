import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Nebula() {
  const nebula1Ref = useRef<THREE.Points>(null);
  const nebula2Ref = useRef<THREE.Points>(null);
  const nebula3Ref = useRef<THREE.Points>(null);

  // Layer 1 - Purple/pink nebula
  const layer1 = useMemo(() => {
    const count = 3000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 15 + Math.random() * 45;
      const height = (Math.random() - 0.5) * 12;
      // Spiral arm structure
      const spiralOffset = Math.sin(angle * 2 + radius * 0.1) * 8;

      pos[i * 3] =
        Math.cos(angle) * radius + (Math.random() - 0.5) * 8 + spiralOffset;
      pos[i * 3 + 1] = height + (Math.random() - 0.5) * 4;
      pos[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 8;

      const t = Math.random();
      col[i * 3] = 0.35 + t * 0.3; // R
      col[i * 3 + 1] = 0.05 + t * 0.15; // G
      col[i * 3 + 2] = 0.6 + t * 0.35; // B

      siz[i] = 0.5 + Math.random() * 2;
    }
    return { pos, col, siz, count };
  }, []);

  // Layer 2 - Blue/cyan nebula
  const layer2 = useMemo(() => {
    const count = 2000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2 + 1.5;
      const radius = 20 + Math.random() * 50;
      const height = (Math.random() - 0.5) * 6;

      pos[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = height + (Math.random() - 0.5) * 3;
      pos[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 12;

      const t = Math.random();
      col[i * 3] = 0.05 + t * 0.15;
      col[i * 3 + 1] = 0.15 + t * 0.3;
      col[i * 3 + 2] = 0.5 + t * 0.4;

      siz[i] = 0.3 + Math.random() * 1.5;
    }
    return { pos, col, siz, count };
  }, []);

  // Layer 3 - Rose/gold dust
  const layer3 = useMemo(() => {
    const count = 1500;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 10 + Math.random() * 35;
      const height = (Math.random() - 0.5) * 20;

      pos[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = height;
      pos[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 15;

      const t = Math.random();
      col[i * 3] = 0.7 + t * 0.3;
      col[i * 3 + 1] = 0.3 + t * 0.3;
      col[i * 3 + 2] = 0.4 + t * 0.2;

      siz[i] = 0.2 + Math.random() * 1.0;
    }
    return { pos, col, siz, count };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (nebula1Ref.current) {
      nebula1Ref.current.rotation.y = t * 0.008;
    }
    if (nebula2Ref.current) {
      nebula2Ref.current.rotation.y = -t * 0.006;
      nebula2Ref.current.rotation.x = Math.sin(t * 0.005) * 0.02;
    }
    if (nebula3Ref.current) {
      nebula3Ref.current.rotation.y = t * 0.004;
    }
  });

  return (
    <>
      <points ref={nebula1Ref}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[layer1.pos, 3]}
          />
          <bufferAttribute attach="attributes-color" args={[layer1.col, 3]} />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          size={1.2}
          sizeAttenuation
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <points ref={nebula2Ref}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[layer2.pos, 3]}
          />
          <bufferAttribute attach="attributes-color" args={[layer2.col, 3]} />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          size={1.0}
          sizeAttenuation
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <points ref={nebula3Ref}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[layer3.pos, 3]}
          />
          <bufferAttribute attach="attributes-color" args={[layer3.col, 3]} />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          size={0.8}
          sizeAttenuation
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </>
  );
}
