"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import * as THREE from "three";

function Knot() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.x = s.clock.elapsedTime * 0.12;
    ref.current.rotation.y = s.clock.elapsedTime * 0.18;
  });
  return (
    <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh ref={ref} position={[0, 0.2, 0]}>
        <torusKnotGeometry args={[1.05, 0.28, 180, 36]} />
        <meshStandardMaterial color="#C9A227" metalness={0.85} roughness={0.22} emissive="#3a2c05" emissiveIntensity={0.35} />
      </mesh>
    </Float>
  );
}

function Pillars() {
  const g = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (g.current) g.current.rotation.y = s.clock.elapsedTime * 0.06;
  });
  const items = Array.from({ length: 10 });
  return (
    <group ref={g}>
      {items.map((_, i) => {
        const a = (i / items.length) * Math.PI * 2;
        const x = Math.cos(a) * 3.4;
        const z = Math.sin(a) * 3.4;
        return (
          <mesh key={i} position={[x, -0.6 + Math.sin(i * 1.7) * 0.25, z]}>
            <cylinderGeometry args={[0.09, 0.13, 2.6 + (i % 3) * 0.5, 12]} />
            <meshStandardMaterial color={i % 2 ? "#0E4D4A" : "#1c2f5e"} metalness={0.6} roughness={0.35} />
          </mesh>
        );
      })}
    </group>
  );
}

function Rig() {
  useFrame((s) => {
    const { x, y } = s.pointer;
    s.camera.position.x += (x * 1.2 - s.camera.position.x) * 0.04;
    s.camera.position.y += (1.6 + y * 0.8 - s.camera.position.y) * 0.04;
    s.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function Scene3D() {
  return (
    <div className="absolute inset-0" aria-hidden>
      <Canvas dpr={[1, 1.75]} camera={{ position: [0, 1.6, 7.2], fov: 42 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 6, 4]} intensity={1.6} color="#fff4d6" />
        <pointLight position={[-5, -2, -3]} intensity={1.2} color="#2dd4bf" />
        <Stars radius={60} depth={30} count={2200} factor={3.2} saturation={0} fade speed={0.6} />
        <Knot />
        <Pillars />
        <Rig />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(6,10,24,0.72)_100%)]" />
    </div>
  );
}
