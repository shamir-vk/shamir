import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    vUv = uv;
    vec3 pos = position;

    float dist = distance(uv, uMouse);
    float mouseWave = exp(-dist * 4.0) * 0.6;

    float wave1 = sin(pos.x * 2.5 + uTime * 0.8) * 0.25;
    float wave2 = sin(pos.y * 3.0 + uTime * 1.1) * 0.2;
    float wave3 = sin((pos.x + pos.y) * 1.8 + uTime * 0.6) * 0.18;

    float elevation = wave1 + wave2 + wave3 + mouseWave;
    pos.z += elevation;
    vElevation = elevation;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;
  varying float vElevation;

  vec3 palette(float t) {
    vec3 a = vec3(0.5, 0.4, 0.6);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.30, 0.55, 0.85); // purple, cyan, pink mix
    return a + b * cos(6.28318 * (c * t + d));
  }

  void main() {
    float dist = distance(vUv, uMouse);
    float t = vElevation * 1.5 + uTime * 0.08 + vUv.x * 0.6 + vUv.y * 0.4;
    vec3 col = palette(t);
    col += vec3(0.4, 0.2, 0.6) * exp(-dist * 5.0) * 0.6;
    float alpha = 0.85 - dist * 0.2;
    gl_FragColor = vec4(col, alpha);
  }
`;

function WaveMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const mouseTarget = useRef(new THREE.Vector2(0.5, 0.5));
  const { size } = useThree();

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseTarget.current.set(e.clientX / size.width, 1 - e.clientY / size.height);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [size]);

  useFrame((state) => {
    if (!matRef.current) return;
    const u = matRef.current.uniforms;
    u.uTime.value = state.clock.elapsedTime;
    (u.uMouse.value as THREE.Vector2).lerp(mouseTarget.current, 0.06);
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 3.2, 0, 0]} position={[0, -0.2, 0]}>
      <planeGeometry args={[8, 8, 160, 160]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        wireframe={false}
        uniforms={{
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        }}
      />
    </mesh>
  );
}

export function WaveBackground() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <WaveMesh />
      </Canvas>
    </div>
  );
}
