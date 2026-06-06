'use client';

import { Plus, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useCart } from '@/lib/store/cart';
import { haptic } from '@/lib/haptics';
import { useI18n } from '@/i18n/LanguageProvider';
import type { MenuItemDTO } from '@/lib/types';
import { cn, localize } from '@/lib/utils';

export default function AddToCartButton({
  item,
  className,
  label,
}: {
  item: MenuItemDTO;
  className?: string;
  label?: string;
}) {
  const { t, locale } = useI18n();
  const add = useCart((s) => s.add);
  const open = useCart((s) => s.open);
  const [added, setAdded] = useState(false);
  const addLabel = label ?? t.addToCart.add;
  const displayName = localize(item.name, item.nameFr, locale);

  function handle() {
    haptic('success');
    add({ id: item.id, name: displayName, price: item.price, image: item.image });
    setAdded(true);
    toast.success(`${displayName} ${t.addToCart.addedToast}`, {
      action: { label: t.addToCart.viewCart, onClick: () => open() },
    });
    setTimeout(() => setAdded(false), 1300);
  }

  return (
    <button
      onClick={handle}
      disabled={!item.available}
      className={cn(
        'group inline-flex items-center justify-center gap-1.5 rounded-full bg-butter px-4 py-2 text-sm font-semibold text-ink transition-all duration-300 ease-spring hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40',
        className
      )}
    >
      {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
      {item.available ? (added ? t.addToCart.added : addLabel) : t.addToCart.soldOut}
    </button>
  );
}
