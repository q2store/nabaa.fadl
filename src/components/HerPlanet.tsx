import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import {
  herPlanetVertexShader,
  herPlanetFragmentShader,
  atmosphereVertexShader,
  atmosphereFragmentShader,
} from "../shaders/planetShaders";

export function HerPlanet() {
  const groupRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const atmoRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Mesh>(null);
  const rings2Ref = useRef<THREE.Mesh>(null);
  const textRef = useRef<THREE.Group>(null);

  const planetUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  );

  const atmoUniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color("#ff69b4") },
      uIntensity: { value: 1.5 },
    }),
    []
  );

  // Create ring particle geometry
  const ringParticles = useMemo(() => {
    const count = 3000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const innerR = 3.8;
      const outerR = 5.8;
      const r = innerR + Math.random() * (outerR - innerR);
      // Concentrate particles in bands
      const bandNoise = Math.sin(r * 8.0) * 0.3;
      const finalR = r + bandNoise * 0.1;

      positions[i * 3] = Math.cos(angle) * finalR;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.15;
      positions[i * 3 + 2] = Math.sin(angle) * finalR;

      // Pinkish-golden colors
      const t = Math.random();
      colors[i * 3] = 0.9 + t * 0.1;
      colors[i * 3 + 1] = 0.6 + t * 0.3;
      colors[i * 3 + 2] = 0.7 + t * 0.2;

      sizes[i] = 0.02 + Math.random() * 0.05;
    }

    return { positions, colors, sizes };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    planetUniforms.uTime.value = t;

    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.3) * 0.2;
    }
    if (planetRef.current) {
      planetRef.current.rotation.y = t * 0.08;
      planetRef.current.rotation.x = 0.1;
    }
    if (cloudRef.current) {
      cloudRef.current.rotation.y = t * 0.04;
      cloudRef.current.rotation.x = 0.15;
    }
    if (ringsRef.current) {
      ringsRef.current.rotation.x = 1.2;
      ringsRef.current.rotation.z = t * 0.02;
    }
    if (rings2Ref.current) {
      rings2Ref.current.rotation.x = 1.2;
      rings2Ref.current.rotation.z = -t * 0.015;
    }
    if (textRef.current) {
      // Billboard text to always face camera
      textRef.current.quaternion.copy(state.camera.quaternion);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Main planet with shader */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[2.5, 128, 128]} />
        <shaderMaterial
          vertexShader={herPlanetVertexShader}
          fragmentShader={herPlanetFragmentShader}
          uniforms={planetUniforms}
        />
      </mesh>

      {/* Cloud layer */}
      <mesh ref={cloudRef}>
        <sphereGeometry args={[2.58, 64, 64]} />
        <meshStandardMaterial
          color="#ffc0cb"
          transparent
          opacity={0.12}
          roughness={1}
          depthWrite={false}
        />
      </mesh>

      {/* Atmosphere glow - inner */}
      <mesh ref={atmoRef}>
        <sphereGeometry args={[2.8, 64, 64]} />
        <shaderMaterial
          vertexShader={atmosphereVertexShader}
          fragmentShader={atmosphereFragmentShader}
          uniforms={atmoUniforms}
          transparent
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Atmosphere glow - outer */}
      <mesh>
        <sphereGeometry args={[3.5, 64, 64]} />
        <meshBasicMaterial
          color="#ff1493"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Particle rings */}
      <group ref={ringsRef}>
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[ringParticles.positions, 3]}
            />
            <bufferAttribute
              attach="attributes-color"
              args={[ringParticles.colors, 3]}
            />
            <bufferAttribute
              attach="attributes-size"
              args={[ringParticles.sizes, 1]}
            />
          </bufferGeometry>
          <pointsMaterial
            vertexColors
            size={0.06}
            sizeAttenuation
            transparent
            opacity={0.7}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      </group>

      {/* Thin solid ring for definition */}
      <mesh rotation={[1.2, 0, 0]}>
        <torusGeometry args={[4.5, 0.02, 8, 200]} />
        <meshBasicMaterial
          color="#ffb6c1"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Second thin ring */}
      <mesh rotation={[1.25, 0.05, 0]}>
        <torusGeometry args={[5.2, 0.015, 8, 200]} />
        <meshBasicMaterial
          color="#ffc0cb"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Name label - billboarded */}
      <group ref={textRef} position={[0, 4.2, 0]}>
        <Text
          fontSize={0.7}
          color="#ffd700"
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.04}
          outlineColor="#ff69b4"
          font={undefined}
        >
          ✨ غفران ✨
        </Text>
      </group>

      {/* Planet light */}
      <pointLight color="#ff69b4" intensity={6} distance={25} decay={2} />
      <pointLight color="#ff1493" intensity={2} distance={15} decay={2} />
    </group>
  );
}
