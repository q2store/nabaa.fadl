import { useRef, useState, useMemo, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import type { Memory } from "../data/memories";
import {
  starGlowVertexShader,
  starGlowFragmentShader,
} from "../shaders/planetShaders";

interface MemoryStarProps {
  memory: Memory;
  position: [number, number, number];
  onSelect: (memory: Memory) => void;
}

export function MemoryStar({ memory, position, onSelect }: MemoryStarProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const outerGlowRef = useRef<THREE.Mesh>(null);
  const raysRef = useRef<THREE.Group>(null);
  const labelRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const colors = [
    "#ffd700", "#ff6b6b", "#00ffcc", "#ff69b4",
    "#7b68ee", "#ff8c00", "#00ff7f", "#ff4500",
    "#da70d6", "#20b2aa", "#f0e68c", "#dda0dd",
  ];
  const color = colors[memory.id % colors.length];

  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(color) },
      uTime: { value: 0 },
      uHovered: { value: 0 },
    }),
    [color]
  );

  // Create lens flare rays geometry
  const raysCount = 6;
  const raysData = useMemo(() => {
    return Array.from({ length: raysCount }, (_, i) => ({
      rotation: (i / raysCount) * Math.PI,
      length: 0.8 + Math.random() * 0.5,
    }));
  }, []);

  const handleClick = useCallback(
    (e: THREE.Event) => {
      (e as { stopPropagation?: () => void }).stopPropagation?.();
      onSelect(memory);
    },
    [memory, onSelect]
  );

  const handlePointerOver = useCallback(
    (e: THREE.Event) => {
      (e as { stopPropagation?: () => void }).stopPropagation?.();
      setHovered(true);
      document.body.style.cursor = "pointer";
    },
    []
  );

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    setPressed(false);
    document.body.style.cursor = "default";
  }, []);

  const handlePointerDown = useCallback((e: THREE.Event) => {
    (e as { stopPropagation?: () => void }).stopPropagation?.();
    setPressed(true);
  }, []);

  const handlePointerUp = useCallback(() => {
    setPressed(false);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    uniforms.uTime.value = t;

    // Smooth hover transition
    const targetHover = hovered ? 1 : 0;
    uniforms.uHovered.value += (targetHover - uniforms.uHovered.value) * 0.1;

    if (meshRef.current) {
      const basePulse = 1 + Math.sin(t * 2 + memory.id * 1.7) * 0.08;
      const hoverScale = hovered ? (pressed ? 1.5 : 1.8) : 1;
      const targetScale = basePulse * hoverScale;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.12
      );
      meshRef.current.rotation.y = t * 0.3;
    }

    if (glowRef.current) {
      const glowPulse =
        1.2 + Math.sin(t * 1.5 + memory.id * 0.8) * 0.15;
      const hoverGlow = hovered ? 2.5 : 1.5;
      glowRef.current.scale.setScalar(glowPulse * hoverGlow);
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = hovered ? 0.25 : 0.12;
    }

    if (outerGlowRef.current) {
      const s = hovered ? 4 : 2.5;
      outerGlowRef.current.scale.setScalar(
        s + Math.sin(t * 1.2 + memory.id) * 0.3
      );
      const mat = outerGlowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = hovered ? 0.12 : 0.04;
    }

    if (raysRef.current) {
      raysRef.current.rotation.z = t * 0.2 + memory.id;
      const rayScale = hovered ? 1.5 : 0.6;
      raysRef.current.scale.lerp(
        new THREE.Vector3(rayScale, rayScale, rayScale),
        0.08
      );
      raysRef.current.visible = true;
    }

    if (labelRef.current) {
      labelRef.current.quaternion.copy(state.camera.quaternion);
      const labelOpacity = hovered ? 1 : 0;
      labelRef.current.children.forEach((child) => {
        if ((child as THREE.Mesh).material) {
          const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
          if (mat.opacity !== undefined) {
            mat.opacity += (labelOpacity - mat.opacity) * 0.1;
          }
        }
      });
    }

    // Gentle float
    if (groupRef.current) {
      groupRef.current.position.y =
        position[1] + Math.sin(t * 0.5 + memory.id * 2) * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Larger invisible touch target for mobile */}
      <mesh
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Star core with shader */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.45, 2]} />
        <shaderMaterial
          vertexShader={starGlowVertexShader}
          fragmentShader={starGlowFragmentShader}
          uniforms={uniforms}
        />
      </mesh>

      {/* Inner glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.5, 24, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.12}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Outer volumetric glow */}
      <mesh ref={outerGlowRef}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.04}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Lens flare rays */}
      <group ref={raysRef}>
        {raysData.map((ray, i) => (
          <mesh key={i} rotation={[0, 0, ray.rotation]}>
            <planeGeometry args={[0.06, ray.length]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.3}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>

      {/* Hover label */}
      <group ref={labelRef} position={[0, 1.8, 0]}>
        <Text
          fontSize={0.35}
          color={color}
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.02}
          outlineColor="#000000"
          font={undefined}
          material-transparent
          material-opacity={0}
        >
          {memory.emoji} {memory.title}
        </Text>
      </group>

      {/* Point light */}
      <pointLight
        color={color}
        intensity={hovered ? 5 : 1.5}
        distance={hovered ? 12 : 6}
        decay={2}
      />
    </group>
  );
}
