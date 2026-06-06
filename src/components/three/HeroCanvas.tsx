'use client';

import dynamic from 'next/dynamic';

// Load the WebGL scene only on the client — never during SSR.
const HeroScene = dynamic(() => import('./HeroScene'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-32 w-32 animate-pulse rounded-full bg-ember/20 blur-2xl" />
    </div>
  ),
});

export default function HeroCanvas() {
  return <HeroScene />;
}
