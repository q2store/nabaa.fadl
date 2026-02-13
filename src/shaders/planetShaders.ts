export const herPlanetVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vNoise;

  // Simple noise function
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise3d(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z
    );
  }

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    
    float n = noise3d(position * 2.0) * 0.15;
    vNoise = n;
    vec3 newPos = position + normal * n;
    vPosition = (modelViewMatrix * vec4(newPos, 1.0)).xyz;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
  }
`;

export const herPlanetFragmentShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vNoise;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise3d(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z
    );
  }

  void main() {
    vec3 lightDir = normalize(vec3(1.0, 1.0, 0.5));
    float diffuse = max(dot(vNormal, lightDir), 0.0);
    float fresnel = pow(1.0 - max(dot(vNormal, normalize(-vPosition)), 0.0), 3.0);
    
    // Base planet colors - warm pink/rose
    vec3 color1 = vec3(0.95, 0.3, 0.5);   // Deep rose
    vec3 color2 = vec3(1.0, 0.55, 0.7);   // Soft pink
    vec3 color3 = vec3(0.85, 0.2, 0.4);   // Darker rose
    vec3 color4 = vec3(1.0, 0.75, 0.85);  // Light blush
    
    // Create surface detail with layered noise
    float n1 = noise3d(vUv.xyx * 8.0 + uTime * 0.05);
    float n2 = noise3d(vUv.xyx * 16.0 - uTime * 0.03);
    float n3 = noise3d(vUv.xyx * 32.0 + uTime * 0.02);
    float detail = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
    
    // Mix colors based on noise
    vec3 baseColor = mix(color1, color2, detail);
    baseColor = mix(baseColor, color3, smoothstep(0.3, 0.7, n1));
    baseColor = mix(baseColor, color4, smoothstep(0.6, 0.9, n2) * 0.5);
    
    // Cloud-like swirls
    float swirl = noise3d(vec3(vUv * 6.0, uTime * 0.08));
    vec3 cloudColor = vec3(1.0, 0.85, 0.9);
    baseColor = mix(baseColor, cloudColor, swirl * 0.25);
    
    // Lighting
    vec3 ambient = baseColor * 0.2;
    vec3 diff = baseColor * diffuse * 0.8;
    vec3 fresnelColor = vec3(1.0, 0.5, 0.7) * fresnel * 0.6;
    
    // Emissive glow from surface features
    vec3 emissive = color2 * smoothstep(0.5, 0.8, detail) * 0.15;
    
    vec3 finalColor = ambient + diff + fresnelColor + emissive;
    
    // Slight HDR bloom effect
    finalColor += fresnel * vec3(1.0, 0.4, 0.6) * 0.3;
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export const atmosphereVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const atmosphereFragmentShader = `
  uniform vec3 uColor;
  uniform float uIntensity;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    float fresnel = pow(1.0 - max(dot(vNormal, normalize(-vPosition)), 0.0), 2.5);
    vec3 color = uColor * fresnel * uIntensity;
    gl_FragColor = vec4(color, fresnel * 0.7);
  }
`;

export const myPlanetFragmentShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vNoise;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise3d(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z
    );
  }

  void main() {
    vec3 lightDir = normalize(vec3(1.0, 1.0, 0.5));
    float diffuse = max(dot(vNormal, lightDir), 0.0);
    float fresnel = pow(1.0 - max(dot(vNormal, normalize(-vPosition)), 0.0), 3.0);
    
    // Blue planet colors
    vec3 color1 = vec3(0.1, 0.2, 0.8);   // Deep blue
    vec3 color2 = vec3(0.2, 0.4, 0.95);  // Royal blue
    vec3 color3 = vec3(0.05, 0.15, 0.6); // Dark blue
    vec3 color4 = vec3(0.3, 0.5, 1.0);   // Light blue
    
    float n1 = noise3d(vUv.xyx * 6.0 + uTime * 0.06);
    float n2 = noise3d(vUv.xyx * 12.0 - uTime * 0.04);
    float n3 = noise3d(vUv.xyx * 24.0 + uTime * 0.03);
    float detail = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
    
    vec3 baseColor = mix(color1, color2, detail);
    baseColor = mix(baseColor, color3, smoothstep(0.3, 0.7, n1));
    baseColor = mix(baseColor, color4, smoothstep(0.6, 0.9, n2) * 0.4);
    
    // Ice caps
    float polar = abs(vUv.y - 0.5) * 2.0;
    vec3 iceColor = vec3(0.7, 0.85, 1.0);
    baseColor = mix(baseColor, iceColor, smoothstep(0.75, 0.95, polar) * 0.6);
    
    vec3 ambient = baseColor * 0.2;
    vec3 diff = baseColor * diffuse * 0.8;
    vec3 fresnelColor = vec3(0.3, 0.5, 1.0) * fresnel * 0.5;
    vec3 emissive = color2 * smoothstep(0.5, 0.8, detail) * 0.1;
    
    vec3 finalColor = ambient + diff + fresnelColor + emissive;
    finalColor += fresnel * vec3(0.2, 0.4, 1.0) * 0.3;
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export const starGlowVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const starGlowFragmentShader = `
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uHovered;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise3d(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z
    );
  }
  
  void main() {
    float fresnel = pow(1.0 - max(dot(vNormal, normalize(-vPosition)), 0.0), 2.0);
    
    // Surface turbulence for star-like effect
    float turb = noise3d(vPosition * 3.0 + uTime * 0.5) * 0.3 +
                 noise3d(vPosition * 6.0 - uTime * 0.3) * 0.15;
    
    vec3 hotColor = uColor * 1.5 + vec3(0.3, 0.2, 0.1);
    vec3 coolColor = uColor * 0.7;
    vec3 surfaceColor = mix(coolColor, hotColor, turb + 0.5);
    
    float glow = fresnel * (0.8 + uHovered * 0.5);
    vec3 glowColor = uColor * glow * 1.5;
    
    float intensity = 0.8 + turb * 0.4 + uHovered * 0.3;
    vec3 finalColor = surfaceColor * intensity + glowColor;
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;
