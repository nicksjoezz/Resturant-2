'use client';

import dynamic from 'next/dynamic';
import type { MenuItemDTO } from '@/lib/types';

const MenuGallery3D = dynamic(() => import('./MenuGallery3D'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-40 w-40 animate-pulse rounded-3xl bg-black/[0.04]" />
    </div>
  ),
});

export default function GalleryCanvas(props: {
  items: MenuItemDTO[];
  activeIndex: number;
  onActiveChange: (i: number) => void;
  onSelect?: (item: MenuItemDTO) => void;
}) {
  return <MenuGallery3D {...props} />;
}
