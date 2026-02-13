import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  realisticStarVertexShader,
  realisticStarFragmentShader,
  brightStarVertexShader,
  brightStarFragmentShader,
} from "../shaders/starShaders";

// Spectral colors — desaturated natural star colors
function getStarColor(rand: number): [number, number, number] {
  if (rand < 0.01) return [0.65, 0.75, 1.0];    // O — blue
  if (rand < 0.05) return [0.75, 0.85, 1.0];     // B — blue-white
  if (rand < 0.12) return [0.92, 0.94, 1.0];     // A — white-blue
  if (rand < 0.25) return [0.98, 0.97, 0.93];    // F — warm white
  if (rand < 0.42) return [1.0, 0.96, 0.84];     // G — yellowish
  if (rand < 0.65) return [1.0, 0.88, 0.70];     // K — orange
  return [1.0, 0.80, 0.58];                       // M — reddish
}

export function StarField() {
  const { viewport } = useThree();
  const pixelRatio = viewport.dpr;

  // LAYER 1: Dust — 14000 tiny faint specks
  const dustRef = useRef<THREE.Points>(null);
  const dustCount = 14000;

  const dustData = useMemo(() => {
    const positions = new Float32Array(dustCount * 3);
    const colors = new Float32Array(dustCount * 3);
    const sizes = new Float32Array(dustCount);
    const brightnesses = new Float32Array(dustCount);
    const twinkleSpeeds = new Float32Array(dustCount);
    const twinklePhases = new Float32Array(dustCount);

    for (let i = 0; i < dustCount; i++) {
      const r = 80 + Math.random() * 350;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const w = Math.random();
      colors[i * 3] = 0.85 + w * 0.15;
      colors[i * 3 + 1] = 0.83 + w * 0.12;
      colors[i * 3 + 2] = 0.80 + w * 0.20;

      sizes[i] = 0.3 + Math.random() * 0.5;
      brightnesses[i] = 0.05 + Math.random() * 0.15;
      twinkleSpeeds[i] = 2.0 + Math.random() * 5.0;
      twinklePhases[i] = Math.random() * Math.PI * 2;
    }

    return { positions, colors, sizes, brightnesses, twinkleSpeeds, twinklePhases };
  }, []);

  // LAYER 2: Background — 6000 small dots
  const bgRef = useRef<THREE.Points>(null);
  const bgCount = 6000;

  const bgData = useMemo(() => {
    const positions = new Float32Array(bgCount * 3);
    const colors = new Float32Array(bgCount * 3);
    const sizes = new Float32Array(bgCount);
    const brightnesses = new Float32Array(bgCount);
    const twinkleSpeeds = new Float32Array(bgCount);
    const twinklePhases = new Float32Array(bgCount);

    for (let i = 0; i < bgCount; i++) {
      const r = 50 + Math.random() * 250;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const [cr, cg, cb] = getStarColor(Math.random());
      colors[i * 3] = cr;
      colors[i * 3 + 1] = cg;
      colors[i * 3 + 2] = cb;

      const mag = Math.pow(Math.random(), 2.5);
      sizes[i] = 0.5 + mag * 1.8;
      brightnesses[i] = 0.15 + mag * 0.5;
      twinkleSpeeds[i] = 1.0 + Math.random() * 3.5;
      twinklePhases[i] = Math.random() * Math.PI * 2;
    }

    return { positions, colors, sizes, brightnesses, twinkleSpeeds, twinklePhases };
  }, []);

  // LAYER 3: Mid-range — 2000 visible dots
  const midRef = useRef<THREE.Points>(null);
  const midCount = 2000;

  const midData = useMemo(() => {
    const positions = new Float32Array(midCount * 3);
    const colors = new Float32Array(midCount * 3);
    const sizes = new Float32Array(midCount);
    const brightnesses = new Float32Array(midCount);
    const twinkleSpeeds = new Float32Array(midCount);
    const twinklePhases = new Float32Array(midCount);

    for (let i = 0; i < midCount; i++) {
      const r = 30 + Math.random() * 180;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const [cr, cg, cb] = getStarColor(Math.random());
      colors[i * 3] = cr;
      colors[i * 3 + 1] = cg;
      colors[i * 3 + 2] = cb;

      sizes[i] = 1.2 + Math.random() * 1.5;
      brightnesses[i] = 0.35 + Math.random() * 0.45;
      twinkleSpeeds[i] = 0.6 + Math.random() * 2.5;
      twinklePhases[i] = Math.random() * Math.PI * 2;
    }

    return { positions, colors, sizes, brightnesses, twinkleSpeeds, twinklePhases };
  }, []);

  // LAYER 4: Bright stars — 150 prominent dots
  const brightRef = useRef<THREE.Points>(null);
  const brightCount = 150;

  const brightData = useMemo(() => {
    const positions = new Float32Array(brightCount * 3);
    const colors = new Float32Array(brightCount * 3);
    const sizes = new Float32Array(brightCount);
    const brightnesses = new Float32Array(brightCount);
    const twinkleSpeeds = new Float32Array(brightCount);
    const twinklePhases = new Float32Array(brightCount);
    const spikeRotations = new Float32Array(brightCount);

    for (let i = 0; i < brightCount; i++) {
      const r = 20 + Math.random() * 200;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const sp = Math.random();
      let cr: number, cg: number, cb: number;
      if (sp < 0.2)       { cr = 0.78; cg = 0.87; cb = 1.0; }
      else if (sp < 0.45) { cr = 0.95; cg = 0.96; cb = 1.0; }
      else if (sp < 0.65) { cr = 1.0;  cg = 0.96; cb = 0.88; }
      else if (sp < 0.80) { cr = 1.0;  cg = 0.90; cb = 0.72; }
      else                { cr = 1.0;  cg = 0.78; cb = 0.55; }

      colors[i * 3] = cr;
      colors[i * 3 + 1] = cg;
      colors[i * 3 + 2] = cb;

      sizes[i] = 2.5 + Math.random() * 3.0;
      brightnesses[i] = 0.65 + Math.random() * 0.35;
      twinkleSpeeds[i] = 0.3 + Math.random() * 1.0;
      twinklePhases[i] = Math.random() * Math.PI * 2;
      spikeRotations[i] = Math.random() * Math.PI * 0.5;
    }

    return { positions, colors, sizes, brightnesses, twinkleSpeeds, twinklePhases, spikeRotations };
  }, []);

  // Uniforms
  const dustUniforms = useMemo(() => ({ uTime: { value: 0 }, uPixelRatio: { value: pixelRatio } }), [pixelRatio]);
  const bgUniforms = useMemo(() => ({ uTime: { value: 0 }, uPixelRatio: { value: pixelRatio } }), [pixelRatio]);
  const midUniforms = useMemo(() => ({ uTime: { value: 0 }, uPixelRatio: { value: pixelRatio } }), [pixelRatio]);
  const brightUniforms = useMemo(() => ({ uTime: { value: 0 }, uPixelRatio: { value: pixelRatio } }), [pixelRatio]);

  // Materials
  const makeStdMat = (uniforms: Record<string, { value: number }>) =>
    new THREE.ShaderMaterial({
      vertexShader: realisticStarVertexShader,
      fragmentShader: realisticStarFragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });

  const dustMat = useMemo(() => makeStdMat(dustUniforms), [dustUniforms]);
  const bgMat = useMemo(() => makeStdMat(bgUniforms), [bgUniforms]);
  const midMat = useMemo(() => makeStdMat(midUniforms), [midUniforms]);

  const brightMat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: brightStarVertexShader,
    fragmentShader: brightStarFragmentShader,
    uniforms: brightUniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  }), [brightUniforms]);

  // Animation
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    dustUniforms.uTime.value = t;
    bgUniforms.uTime.value = t;
    midUniforms.uTime.value = t;
    brightUniforms.uTime.value = t;

    if (dustRef.current) dustRef.current.rotation.y = t * 0.0003;
    if (bgRef.current) bgRef.current.rotation.y = t * 0.0007;
    if (midRef.current) midRef.current.rotation.y = t * 0.001;
    if (brightRef.current) brightRef.current.rotation.y = t * 0.0012;
  });

  // Build geometry helper
  const buildGeo = (data: {
    positions: Float32Array;
    colors: Float32Array;
    sizes: Float32Array;
    brightnesses: Float32Array;
    twinkleSpeeds: Float32Array;
    twinklePhases: Float32Array;
    spikeRotations?: Float32Array;
  }) => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(data.positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(data.colors, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(data.sizes, 1));
    geo.setAttribute("brightness", new THREE.BufferAttribute(data.brightnesses, 1));
    geo.setAttribute("twinkleSpeed", new THREE.BufferAttribute(data.twinkleSpeeds, 1));
    geo.setAttribute("twinklePhase", new THREE.BufferAttribute(data.twinklePhases, 1));
    if (data.spikeRotations) {
      geo.setAttribute("spikeRotation", new THREE.BufferAttribute(data.spikeRotations, 1));
    }
    return geo;
  };

  const dustGeo = useMemo(() => buildGeo(dustData), [dustData]);
  const bgGeo = useMemo(() => buildGeo(bgData), [bgData]);
  const midGeo = useMemo(() => buildGeo(midData), [midData]);
  const brightGeo = useMemo(() => buildGeo(brightData), [brightData]);

  return (
    <>
      <points ref={dustRef} geometry={dustGeo} material={dustMat} frustumCulled={false} />
      <points ref={bgRef} geometry={bgGeo} material={bgMat} frustumCulled={false} />
      <points ref={midRef} geometry={midGeo} material={midMat} frustumCulled={false} />
      <points ref={brightRef} geometry={brightGeo} material={brightMat} frustumCulled={false} />
    </>
  );
}
