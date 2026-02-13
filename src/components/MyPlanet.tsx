import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Trail } from "@react-three/drei";
import * as THREE from "three";
import {
  herPlanetVertexShader,
  myPlanetFragmentShader,
  atmosphereVertexShader,
  atmosphereFragmentShader,
} from "../shaders/planetShaders";

export function MyPlanet() {
  const groupRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<THREE.Group>(null);

  const planetUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  );

  const atmoUniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color("#4488ff") },
      uIntensity: { value: 1.2 },
    }),
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    planetUniforms.uTime.value = t;

    if (groupRef.current) {
      const speed = 0.18;
      const radius = 10;
      groupRef.current.position.x = Math.cos(t * speed) * radius;
      groupRef.current.position.z = Math.sin(t * speed) * radius;
      groupRef.current.position.y = Math.sin(t * speed * 2) * 1.2;
    }
    if (planetRef.current) {
      planetRef.current.rotation.y = t * 0.3;
      planetRef.current.rotation.x = 0.2;
    }
    if (textRef.current) {
      textRef.current.quaternion.copy(state.camera.quaternion);
    }
  });

  return (
    <group ref={groupRef}>
      <Trail
        width={3}
        length={10}
        color="#4169e1"
        attenuation={(t) => t * t}
      >
        <group>
          {/* Main planet with shader */}
          <mesh ref={planetRef}>
            <sphereGeometry args={[1.2, 96, 96]} />
            <shaderMaterial
              vertexShader={herPlanetVertexShader}
              fragmentShader={myPlanetFragmentShader}
              uniforms={planetUniforms}
            />
          </mesh>

          {/* Atmosphere */}
          <mesh>
            <sphereGeometry args={[1.4, 64, 64]} />
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

          {/* Outer glow */}
          <mesh>
            <sphereGeometry args={[1.8, 32, 32]} />
            <meshBasicMaterial
              color="#1e90ff"
              transparent
              opacity={0.05}
              side={THREE.BackSide}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      </Trail>

      {/* Name - billboarded */}
      <group ref={textRef} position={[0, 2.4, 0]}>
        <Text
          fontSize={0.45}
          color="#87ceeb"
          anchorX="center"
          anchorY="bottom"
          font={undefined}
        >
          💙 بلال 💙
        </Text>
      </group>

      <pointLight color="#4169e1" intensity={4} distance={18} decay={2} />
    </group>
  );
}
