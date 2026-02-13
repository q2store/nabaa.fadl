// Simple star shaders — renders stars as tiny crisp circular dots

export const realisticStarVertexShader = `
  attribute float size;
  attribute float brightness;
  attribute float twinkleSpeed;
  attribute float twinklePhase;
  
  varying vec3 vColor;
  varying float vBrightness;
  varying float vSize;
  
  uniform float uTime;
  uniform float uPixelRatio;
  
  void main() {
    vColor = color;
    
    // Subtle twinkling ±15%
    float twinkle = 0.85 + 0.15 * sin(uTime * twinkleSpeed + twinklePhase);
    vBrightness = brightness * twinkle;
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    float dist = -mvPosition.z;
    
    float attenuation = 150.0 / max(dist, 1.0);
    float pointSize = size * attenuation * uPixelRatio;
    
    gl_PointSize = clamp(pointSize, 0.8, 4.5);
    vSize = gl_PointSize;
    
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const realisticStarFragmentShader = `
  varying vec3 vColor;
  varying float vBrightness;
  varying float vSize;
  
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv) * 2.0;
    
    // Hard-edged tiny circle with slight soft edge
    float alpha = 1.0 - smoothstep(0.2, 0.5, dist);
    
    if (alpha < 0.01) discard;
    
    // Slightly whiter at center
    vec3 col = mix(vColor, vec3(1.0), (1.0 - dist) * 0.3);
    
    gl_FragColor = vec4(col * vBrightness, alpha * vBrightness);
  }
`;

// Bright stars — slightly larger dots with a very subtle thin glow ring
export const brightStarVertexShader = `
  attribute float size;
  attribute float brightness;
  attribute float twinkleSpeed;
  attribute float twinklePhase;
  attribute float spikeRotation;
  
  varying vec3 vColor;
  varying float vBrightness;
  varying float vSize;
  
  uniform float uTime;
  uniform float uPixelRatio;
  
  void main() {
    vColor = color;
    
    float twinkle = 0.88 + 0.12 * sin(uTime * twinkleSpeed + twinklePhase);
    vBrightness = brightness * twinkle;
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    float dist = -mvPosition.z;
    float attenuation = 180.0 / max(dist, 1.0);
    float pointSize = size * attenuation * uPixelRatio;
    
    gl_PointSize = clamp(pointSize, 1.5, 7.0);
    vSize = gl_PointSize;
    
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const brightStarFragmentShader = `
  varying vec3 vColor;
  varying float vBrightness;
  varying float vSize;
  
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv) * 2.0;
    
    // Crisp dot core
    float core = 1.0 - smoothstep(0.15, 0.45, dist);
    
    // Very subtle thin glow ring
    float glow = exp(-dist * dist * 18.0) * 0.3;
    
    float alpha = core + glow;
    
    if (alpha < 0.01) discard;
    
    vec3 col = mix(vColor, vec3(1.0), (1.0 - dist) * 0.4);
    
    gl_FragColor = vec4(col * vBrightness, alpha * vBrightness);
  }
`;
