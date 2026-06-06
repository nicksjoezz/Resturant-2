'use client';

import { Printer } from 'lucide-react';
import { haptic } from '@/lib/haptics';

export default function PrintButton({ label = 'Print cards' }: { label?: string }) {
  return (
    <button
      onClick={() => {
        haptic('light');
        window.print();
      }}
      className="btn-primary text-sm"
    >
      <Printer className="h-4 w-4" /> {label}
    </button>
  );
}
