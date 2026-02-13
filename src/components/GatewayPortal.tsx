import { useRef, useState, useMemo, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface GatewayPortalProps {
  onActivate: () => void;
}

export function GatewayPortal({ onActivate }: GatewayPortalProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const textRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Portal particles
  const portalParticles = useMemo(() => {
    const count = 600;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 0.5 + Math.random() * 2.8;

      positions[i * 3] = Math.cos(angle) * r;
      positions[i * 3 + 1] = Math.sin(angle) * r;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1.5;

      const t = Math.random();
      colors[i * 3] = 1.0;
      colors[i * 3 + 1] = 0.7 + t * 0.3;
      colors[i * 3 + 2] = 0.3 + t * 0.5;
    }

    return { positions, colors };
  }, []);

  const handleClick = useCallback(
    (e: THREE.Event) => {
      (e as { stopPropagation?: () => void }).stopPropagation?.();
      onActivate();
    },
    [onActivate]
  );

  const handlePointerOver = useCallback((e: THREE.Event) => {
    (e as { stopPropagation?: () => void }).stopPropagation?.();
    setHovered(true);
    document.body.style.cursor = "pointer";
  }, []);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    document.body.style.cursor = "default";
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.4) * 0.5 + 8;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * 0.4;
      ring1Ref.current.rotation.x = t * 0.2;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 0.35;
      ring2Ref.current.rotation.y = t * 0.15;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = t * 0.5;
      ring3Ref.current.rotation.z = t * 0.1;
    }
    if (coreRef.current) {
      const scale = 1 + Math.sin(t * 2) * 0.15;
      coreRef.current.scale.setScalar(scale * (hovered ? 1.3 : 1));
      const mat = coreRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.15 + Math.sin(t * 3) * 0.08 + (hovered ? 0.15 : 0);
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.z = t * 0.3;
      const posArray = particlesRef.current.geometry.attributes.position
        .array as Float32Array;
      const count = posArray.length / 3;
      for (let i = 0; i < count; i++) {
        const angle = t * 0.5 + (i / count) * Math.PI * 2;
        const origR = Math.sqrt(
          posArray[i * 3] ** 2 + posArray[i * 3 + 1] ** 2
        );
        const r = origR + Math.sin(t + i * 0.1) * 0.1;
        posArray[i * 3] = Math.cos(angle + i * 0.02) * r;
        posArray[i * 3 + 1] = Math.sin(angle + i * 0.02) * r;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
    if (textRef.current) {
      textRef.current.quaternion.copy(state.camera.quaternion);
    }
  });

  return (
    <group ref={groupRef} position={[0, 8, -15]}>
      {/* Large invisible touch target */}
      <mesh
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[4, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Outer ring */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[3, 0.08, 32, 128]} />
        <meshStandardMaterial
          color="#ffd700"
          emissive="#ffd700"
          emissiveIntensity={hovered ? 3 : 1.5}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Middle ring */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.3, 0.06, 32, 128]} />
        <meshStandardMaterial
          color="#ff69b4"
          emissive="#ff69b4"
          emissiveIntensity={hovered ? 3 : 1.5}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Inner ring */}
      <mesh ref={ring3Ref}>
        <torusGeometry args={[1.6, 0.05, 32, 128]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={hovered ? 3 : 1.5}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Central glow core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[1.3, 32, 32]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Portal particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[portalParticles.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[portalParticles.colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          size={0.08}
          sizeAttenuation
          transparent
          opacity={hovered ? 0.8 : 0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Text - billboarded */}
      <group ref={textRef} position={[0, -4.5, 0]}>
        <Text
          fontSize={0.5}
          color="#ffd700"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#000000"
          font={undefined}
          maxWidth={12}
        >
          {"✨ اضغطي حتى تعرفين سر الكون ✨"}
        </Text>
      </group>

      <pointLight
        color="#ffd700"
        intensity={hovered ? 12 : 5}
        distance={30}
        decay={2}
      />
      <pointLight
        color="#ff69b4"
        intensity={hovered ? 6 : 3}
        distance={20}
        decay={2}
      />
    </group>
  );
}
