'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sparkles, ContactShadows } from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  DepthOfField,
  Vignette,
  Noise,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * The centerpiece blob — a glossy, slowly morphing form that reads as a warm,
 * abstract "dish under a spotlight". Reacts subtly to the pointer for life.
 */
function Centerpiece() {
  const ref = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.15;
    // ease toward pointer for a parallax tilt
    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      pointer.y * 0.3,
      0.05
    );
    ref.current.position.x = THREE.MathUtils.lerp(
      ref.current.position.x,
      pointer.x * 0.4,
      0.04
    );
  });

  return (
    <Float speed={1.4} rotationIntensity={0.5} floatIntensity={1.1}>
      <mesh ref={ref} castShadow>
        <icosahedronGeometry args={[1.35, 64]} />
        <MeshDistortMaterial
          color="#E8622C"
          emissive="#7A1F2B"
          emissiveIntensity={0.25}
          roughness={0.18}
          metalness={0.35}
          distort={0.32}
          speed={1.6}
        />
      </mesh>
    </Float>
  );
}

/** A satellite glossy sphere orbiting the centerpiece. */
function Orb({
  radius,
  speed,
  size,
  color,
  offset,
}: {
  radius: number;
  speed: number;
  size: number;
  color: string;
  offset: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed + offset;
    ref.current.position.set(Math.cos(t) * radius, Math.sin(t * 0.8) * 0.6, Math.sin(t) * radius);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial color={color} roughness={0.15} metalness={0.6} />
    </mesh>
  );
}

function Scene({ heavy }: { heavy: boolean }) {
  const orbs = useMemo(
    () => [
      { radius: 2.6, speed: 0.5, size: 0.22, color: '#F5D547', offset: 0 },
      { radius: 3.1, speed: 0.35, size: 0.16, color: '#F4EFE6', offset: 2 },
      { radius: 2.2, speed: 0.6, size: 0.13, color: '#7C3AED', offset: 4 },
      { radius: 3.4, speed: 0.28, size: 0.18, color: '#2D7FF9', offset: 1 },
    ],
    []
  );

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 6, 4]} intensity={2.2} castShadow color="#fff3df" />
      <pointLight position={[-4, -2, -3]} intensity={1.5} color="#E8622C" />
      <pointLight position={[4, 2, 3]} intensity={1.2} color="#F5D547" />

      <Centerpiece />
      {orbs.map((o, i) => (
        <Orb key={i} {...o} />
      ))}

      <Sparkles
        count={heavy ? 60 : 28}
        scale={9}
        size={2.4}
        speed={0.3}
        opacity={0.5}
        color="#F5D547"
      />

      <ContactShadows
        position={[0, -2.2, 0]}
        opacity={0.45}
        scale={12}
        blur={2.6}
        far={4}
        color="#000000"
      />

      {/* Cinematic grade — only on capable (non-mobile) devices to protect phone GPUs/battery */}
      {heavy && (
        <EffectComposer multisampling={4}>
          <DepthOfField focusDistance={0} focalLength={0.028} bokehScale={2.2} />
          <Bloom intensity={0.9} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
          <Vignette eskil={false} offset={0.25} darkness={0.75} />
          <Noise blendFunction={BlendFunction.OVERLAY} opacity={0.22} />
        </EffectComposer>
      )}
    </>
  );
}

export default function HeroScene() {
  // Heavy effects + higher DPR only on larger, fine-pointer (non-touch) devices.
  const [heavy, setHeavy] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px) and (pointer: fine)');
    const update = () => setHeavy(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return (
    <Canvas
      shadows={heavy}
      dpr={heavy ? [1, 1.8] : [1, 1.4]}
      camera={{ position: [0, 0, 6.5], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ touchAction: 'pan-y' }}
    >
      <Suspense fallback={null}>
        <Scene heavy={heavy} />
      </Suspense>
    </Canvas>
  );
}
