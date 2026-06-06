'use client';

import { Canvas, useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import { Image as DreiImage } from '@react-three/drei';
import { Suspense, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import type { MenuItemDTO } from '@/lib/types';

type Props = {
  items: MenuItemDTO[];
  activeIndex: number;
  onActiveChange: (i: number) => void;
  onSelect?: (item: MenuItemDTO) => void;
};

const RADIUS = 3.6;

function Card({
  url,
  index,
  total,
  rotation,
  onClick,
}: {
  url: string;
  index: number;
  total: number;
  rotation: React.MutableRefObject<number>;
  onClick: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  const imgRef = useRef<any>(null);
  const [hovered, setHovered] = useState(false);
  const baseAngle = (index / total) * Math.PI * 2;

  useFrame(() => {
    if (!group.current) return;
    const angle = baseAngle + rotation.current;
    group.current.position.set(Math.sin(angle) * RADIUS, 0, Math.cos(angle) * RADIUS);
    group.current.rotation.y = angle;
    // Cards near the front (z highest) scale up for a coverflow focus effect.
    const focus = (group.current.position.z / RADIUS + 1) / 2; // 0..1
    const scale = 0.85 + focus * 0.6 + (hovered ? 0.06 : 0);
    group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x, scale, 0.12));
    if (imgRef.current?.material) {
      imgRef.current.material.opacity = THREE.MathUtils.lerp(
        imgRef.current.material.opacity ?? 1,
        0.45 + focus * 0.55,
        0.12
      );
      imgRef.current.material.grayscale = THREE.MathUtils.lerp(
        imgRef.current.material.grayscale ?? 0,
        (1 - focus) * 0.7,
        0.12
      );
    }
  });

  return (
    <group ref={group}>
      <DreiImage
        ref={imgRef}
        url={url}
        transparent
        scale={[1.7, 2.2] as any}
        radius={0.12}
        toneMapped={false}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onClick();
        }}
      />
    </group>
  );
}

function Carousel({ items, activeIndex, onActiveChange, onSelect }: Props) {
  const rotation = useRef(0);
  const target = useRef(0);
  const dragging = useRef(false);
  const last = useRef(0);
  const { gl } = useThree();

  // Snap target rotation to bring the requested active card to the front.
  useEffect(() => {
    const step = (Math.PI * 2) / items.length;
    target.current = -activeIndex * step;
  }, [activeIndex, items.length]);

  useFrame(() => {
    rotation.current = THREE.MathUtils.lerp(rotation.current, target.current, 0.08);
  });

  useEffect(() => {
    const el = gl.domElement;
    const step = (Math.PI * 2) / items.length;

    const down = (x: number) => {
      dragging.current = true;
      last.current = x;
    };
    const move = (x: number) => {
      if (!dragging.current) return;
      const dx = x - last.current;
      last.current = x;
      target.current += dx * 0.006;
    };
    const up = () => {
      if (!dragging.current) return;
      dragging.current = false;
      // snap to nearest card and report the active index
      const snapped = Math.round(target.current / step) * step;
      target.current = snapped;
      let idx = ((Math.round(-snapped / step) % items.length) + items.length) % items.length;
      onActiveChange(idx);
    };

    const onPointerDown = (e: PointerEvent) => down(e.clientX);
    const onPointerMove = (e: PointerEvent) => move(e.clientX);
    const onWheel = (e: WheelEvent) => {
      target.current += (e.deltaY || e.deltaX) * 0.0015;
    };

    el.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', up);
    el.addEventListener('wheel', onWheel, { passive: true });
    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', up);
      el.removeEventListener('wheel', onWheel);
    };
  }, [gl, items.length, onActiveChange]);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 4, 5]} intensity={1.4} />
      {items.map((item, i) => (
        <Card
          key={item.id}
          url={item.image}
          index={i}
          total={items.length}
          rotation={rotation}
          onClick={() => {
            if (i === activeIndex) onSelect?.(item);
            else onActiveChange(i);
          }}
        />
      ))}
    </>
  );
}

export default function MenuGallery3D(props: Props) {
  // Pause the gallery's render loop when it scrolls out of view.
  const [visible, setVisible] = useState(true);
  const wrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      rootMargin: '120px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!props.items.length) return null;
  return (
    <div ref={wrapRef} className="h-full w-full">
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.3, 6.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ touchAction: 'pan-y' }}
      >
        <Suspense fallback={null}>
          <Carousel {...props} />
        </Suspense>
      </Canvas>
    </div>
  );
}
