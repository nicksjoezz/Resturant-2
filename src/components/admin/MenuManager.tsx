'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Star, X, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { usePolling } from '@/lib/usePolling';
import { formatPrice } from '@/lib/utils';
import { useI18n } from '@/i18n/LanguageProvider';
import type { CategoryDTO } from '@/lib/types';

type AdminItem = {
  id: string;
  name: string;
  description: string;
  nameFr: string;
  descriptionFr: string;
  price: number;
  image: string;
  tags: string;
  cuisine: string;
  spicy: number;
  featured: boolean;
  available: boolean;
  prepMinutes: number;
  calories: number;
  categoryId: string;
  category?: { name: string };
};

const empty = {
  name: '',
  description: '',
  nameFr: '',
  descriptionFr: '',
  price: 0,
  image: '',
  tags: '',
  cuisine: 'Signature',
  spicy: 0,
  featured: false,
  available: true,
  prepMinutes: 20,
  calories: 0,
  categoryId: '',
};

export default function MenuManager({ categories }: { categories: CategoryDTO[] }) {
  const { t } = useI18n();
  const M = t.admin.menu;
  const { data, loading, refresh } = usePolling<{ items: AdminItem[] }>('/api/admin/menu', 8000);
  const [editing, setEditing] = useState<Partial<AdminItem> | null>(null);
  const [saving, setSaving] = useState(false);

  const items = data?.items ?? [];

  function openNew() {
    setEditing({ ...empty, categoryId: categories[0]?.id ?? '' });
  }

  async function save() {
    if (!editing) return;
    if (!editing.name || !editing.categoryId || editing.price == null) {
      toast.error(M.tRequired);
      return;
    }
    setSaving(true);
    try {
      const isNew = !editing.id;
      const res = await fetch(isNew ? '/api/admin/menu' : `/api/admin/menu/${editing.id}`, {
        method: isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });
      if (!res.ok) throw new Error();
      toast.success(isNew ? M.tCreated : M.tUpdated);
      setEditing(null);
      await refresh();
    } catch {
      toast.error(M.tSaveErr);
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm(M.deleteConfirm)) return;
    try {
      const res = await fetch(`/api/admin/menu/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success(M.tDeleted);
      await refresh();
    } catch {
      toast.error(M.tDelErr);
    }
  }

  async function quickToggle(item: AdminItem, field: 'available' | 'featured') {
    try {
      await fetch(`/api/admin/menu/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: !item[field] }),
      });
      await refresh();
    } catch {
      toast.error(M.tUpdateErr);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">{M.title}</h1>
          <p className="mt-1 text-sm text-fg/50">
            {items.length} {M.items}
          </p>
        </div>
        <button onClick={openNew} className="btn-primary text-sm">
          <Plus className="h-4 w-4" /> {M.newItem}
        </button>
      </div>

      {loading && !data ? (
        <div className="py-20 text-center text-fg/50">{M.loading}</div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-black/10">
          <table className="w-full text-sm">
            <thead className="bg-card text-left text-xs uppercase tracking-wider text-fg/40">
              <tr>
                <th className="px-4 py-3">{M.thItem}</th>
                <th className="hidden px-4 py-3 md:table-cell">{M.thCategory}</th>
                <th className="px-4 py-3">{M.thPrice}</th>
                <th className="hidden px-4 py-3 sm:table-cell">{M.thStatus}</th>
                <th className="px-4 py-3 text-right">{M.thActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {items.map((item) => (
                <tr key={item.id} className="bg-card/40 transition hover:bg-card">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          item.image ||
                          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80'
                        }
                        alt={item.name}
                        className="h-11 w-11 rounded-lg object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-1.5 font-medium">
                          {item.name}
                          {item.featured && <Star className="h-3.5 w-3.5 fill-butter text-butter" />}
                        </div>
                        <div className="text-xs text-fg/40">{item.cuisine}</div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-fg/60 md:table-cell">
                    {item.category?.name}
                  </td>
                  <td className="px-4 py-3 font-semibold text-butter">{formatPrice(item.price)}</td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        item.available
                          ? 'bg-green-500/15 text-green-400'
                          : 'bg-ember/15 text-ember'
                      }`}
                    >
                      {item.available ? M.available : M.hidden}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <IconBtn title="Toggle featured" onClick={() => quickToggle(item, 'featured')}>
                        <Star
                          className={`h-4 w-4 ${item.featured ? 'fill-butter text-butter' : ''}`}
                        />
                      </IconBtn>
                      <IconBtn
                        title="Toggle availability"
                        onClick={() => quickToggle(item, 'available')}
                      >
                        {item.available ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </IconBtn>
                      <IconBtn title="Edit" onClick={() => setEditing(item)}>
                        <Pencil className="h-4 w-4" />
                      </IconBtn>
                      <IconBtn title="Delete" danger onClick={() => remove(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </IconBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Editor modal */}
      <AnimatePresence>
        {editing && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditing(null)}
              className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              className="fixed left-1/2 top-1/2 z-[90] max-h-[90vh] w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[1.75rem] border border-black/10 bg-card p-6 no-scrollbar"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-bold">
                  {editing.id ? M.editItem : M.newItemTitle}
                </h2>
                <button
                  onClick={() => setEditing(null)}
                  className="rounded-full p-2 hover:bg-black/[0.06]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {editing.image ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={editing.image}
                  alt="preview"
                  className="mt-4 h-40 w-full rounded-xl object-cover"
                />
              ) : null}

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <MField label={M.fName}>
                  <input className="m-input" value={editing.name ?? ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                </MField>
                <MField label={M.fNameFr}>
                  <input className="m-input" value={editing.nameFr ?? ''} onChange={(e) => setEditing({ ...editing, nameFr: e.target.value })} placeholder="—" />
                </MField>
                <MField label={M.fPrice}>
                  <input className="m-input" type="number" step="0.01" value={editing.price ?? 0} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} />
                </MField>
                <MField label={M.fCategory}>
                  <select className="m-input" value={editing.categoryId ?? ''} onChange={(e) => setEditing({ ...editing, categoryId: e.target.value })}>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </MField>
                <MField label={M.fCuisine}>
                  <input className="m-input" value={editing.cuisine ?? ''} onChange={(e) => setEditing({ ...editing, cuisine: e.target.value })} />
                </MField>
                <div className="sm:col-span-2">
                  <MField label={M.fDescription}>
                    <textarea className="m-input min-h-[70px] resize-none" value={editing.description ?? ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
                  </MField>
                </div>
                <div className="sm:col-span-2">
                  <MField label={M.fDescriptionFr}>
                    <textarea className="m-input min-h-[70px] resize-none" value={editing.descriptionFr ?? ''} onChange={(e) => setEditing({ ...editing, descriptionFr: e.target.value })} placeholder="—" />
                  </MField>
                </div>
                <div className="sm:col-span-2">
                  <MField label={M.fImage}>
                    <input className="m-input" value={editing.image ?? ''} onChange={(e) => setEditing({ ...editing, image: e.target.value })} placeholder="https://…" />
                  </MField>
                </div>
                <div className="sm:col-span-2">
                  <MField label={M.fTags}>
                    <input className="m-input" value={typeof editing.tags === 'string' ? editing.tags : ''} onChange={(e) => setEditing({ ...editing, tags: e.target.value })} placeholder="2min Craft,1lt Oil,30min Cook" />
                  </MField>
                </div>
                <MField label={M.fPrep}>
                  <input className="m-input" type="number" value={editing.prepMinutes ?? 20} onChange={(e) => setEditing({ ...editing, prepMinutes: Number(e.target.value) })} />
                </MField>
                <MField label={M.fCalories}>
                  <input className="m-input" type="number" value={editing.calories ?? 0} onChange={(e) => setEditing({ ...editing, calories: Number(e.target.value) })} />
                </MField>
                <MField label={M.fSpicy}>
                  <input className="m-input" type="number" min={0} max={3} value={editing.spicy ?? 0} onChange={(e) => setEditing({ ...editing, spicy: Number(e.target.value) })} />
                </MField>
                <div className="flex items-end gap-4">
                  <Toggle label={M.featured} checked={!!editing.featured} onChange={(v) => setEditing({ ...editing, featured: v })} />
                  <Toggle label={M.availableToggle} checked={editing.available ?? true} onChange={(v) => setEditing({ ...editing, available: v })} />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setEditing(null)} className="btn-ghost">
                  {t.admin.orders.cancel}
                </button>
                <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-60">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {editing.id ? M.saveChanges : M.createItem}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .m-input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgba(26, 22, 17, 0.12);
          background: rgba(26, 22, 17, 0.03);
          padding: 0.6rem 0.8rem;
          font-size: 0.875rem;
          color: #1a1611;
          outline: none;
        }
        .m-input:focus {
          border-color: rgba(245, 213, 71, 0.5);
        }
        .m-input option {
          background: #ffffff;
        }
      `}</style>
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  title,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  danger?: boolean;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`rounded-lg p-2 transition hover:bg-black/[0.06] ${
        danger ? 'text-fg/50 hover:text-ember' : 'text-fg/60'
      }`}
    >
      {children}
    </button>
  );
}

function MField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-fg/50">
        {label}
      </span>
      {children}
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2 text-sm"
    >
      <span
        className={`relative h-6 w-11 rounded-full transition ${
          checked ? 'bg-butter' : 'bg-black/[0.06]'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
            checked ? 'left-[22px]' : 'left-0.5'
          }`}
        />
      </span>
      {label}
    </button>
  );
}
