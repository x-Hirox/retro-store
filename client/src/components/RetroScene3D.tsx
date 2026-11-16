import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import type { Group, PointLight, ShaderMaterial } from "three";
import { Color, DoubleSide } from "three";

const gridVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const gridFrag = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    vec2 uv = vUv * vec2(18.0, 28.0);
    uv.y += uTime * 0.35;
    vec2 g = abs(fract(uv) - 0.5);
    float line = min(g.x, g.y);
    float grid = smoothstep(0.08, 0.02, line);
    float fade = smoothstep(0.0, 0.22, vUv.y) * (1.0 - vUv.y);
    vec3 col = mix(vec3(1.0, 0.0, 0.5), vec3(0.0, 0.95, 1.0), vUv.x);
    gl_FragColor = vec4(col * grid * fade, grid * fade * 0.85);
  }
`;

function SynthGrid() {
  const mat = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 } }),
    [],
  );
  useFrame((_, dt) => {
    if (mat.current) mat.current.uniforms.uTime.value += dt;
  });
  return (
    <mesh rotation={[-Math.PI / 2.15, 0, 0]} position={[0, -1.15, 0]}>
      <planeGeometry args={[18, 18, 1, 1]} />
      <shaderMaterial
        ref={mat}
        vertexShader={gridVert}
        fragmentShader={gridFrag}
        uniforms={uniforms}
        transparent
        side={DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function HoloConsole({
  position,
  color,
  kind,
}: {
  position: [number, number, number];
  color: string;
  kind: "psp" | "pad" | "gb" | "xbox";
}) {
  const ref = useRef<Group>(null);
  const base = useRef(position);

  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const mx = pointer.x;
    const my = pointer.y;
    const [x, y, z] = base.current;
    g.position.x = x + mx * 0.4;
    g.position.y = y + Math.sin(t * 1.1 + x) * 0.12 + my * 0.18;
    g.position.z = z;
    g.rotation.y = mx * 0.45 + t * 0.12;
    g.rotation.x = -my * 0.22;
  });

  return (
    <group ref={ref} position={position}>
      {kind === "psp" && (
        <mesh>
          <boxGeometry args={[1.15, 0.28, 0.55]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.55}
            roughness={0.35}
            metalness={0.4}
            transparent
            opacity={0.78}
          />
        </mesh>
      )}
      {kind === "pad" && (
        <>
          <mesh>
            <boxGeometry args={[0.9, 0.18, 0.45]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.5}
              transparent
              opacity={0.8}
            />
          </mesh>
          <mesh position={[-0.42, 0, 0]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="#111" emissive={color} emissiveIntensity={0.3} />
          </mesh>
          <mesh position={[0.42, 0, 0]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="#111" emissive={color} emissiveIntensity={0.3} />
          </mesh>
        </>
      )}
      {kind === "gb" && (
        <mesh>
          <boxGeometry args={[0.45, 0.78, 0.16]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.45}
            transparent
            opacity={0.82}
          />
        </mesh>
      )}
      {kind === "xbox" && (
        <mesh>
          <icosahedronGeometry args={[0.32, 0]} />
          <meshStandardMaterial
            color={color}
            emissive={new Color("#52b043")}
            emissiveIntensity={0.7}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}
    </group>
  );
}

const pointer = { x: 0, y: 0 };

function Scene() {
  const light = useRef<PointLight>(null);
  useFrame(() => {
    if (!light.current) return;
    light.current.position.x = pointer.x * 2;
    light.current.position.y = 1.2 + pointer.y;
  });
  return (
    <>
      <color attach="background" args={["#05050c"]} />
      <fog attach="fog" args={["#05050c", 6, 14]} />
      <ambientLight intensity={0.35} />
      <pointLight ref={light} color="#00f3ff" intensity={8} distance={8} />
      <pointLight position={[-3, 2, 2]} color="#ff007f" intensity={6} distance={9} />
      <SynthGrid />
      <HoloConsole position={[-2.2, 0.4, -0.4]} color="#00f3ff" kind="psp" />
      <HoloConsole position={[2.1, 0.55, -0.2]} color="#ff007f" kind="pad" />
      <HoloConsole position={[-1.1, -0.15, 0.6]} color="#ffe600" kind="gb" />
      <HoloConsole position={[1.15, -0.05, 0.5]} color="#52b043" kind="xbox" />
    </>
  );
}

export default function RetroScene3D() {
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="retro-gl">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 1.15, 4.2], fov: 42 }}
        frameloop="always"
      >
        <Scene />
      </Canvas>
    </div>
  );
}
