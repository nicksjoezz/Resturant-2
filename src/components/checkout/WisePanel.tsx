'use client';

import { useState } from 'react';
import { Copy, Check, ArrowUpRight, Landmark } from 'lucide-react';
import { integrations } from '@/lib/config';
import { haptic } from '@/lib/haptics';
import { useI18n } from '@/i18n/LanguageProvider';

/** Shown on the success page for Wise bank-transfer orders. */
export default function WisePanel({ reference, amount }: { reference: string; amount: string }) {
  const { t } = useI18n();
  const w = t.success.wise;
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard?.writeText(reference);
    haptic('success');
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="mt-6 w-full rounded-[1.5rem] border border-azure/30 bg-azure/[0.06] p-6 text-left">
      <div className="flex items-center gap-2 text-azure">
        <Landmark className="h-5 w-5" />
        <h3 className="font-display text-lg font-bold">{w.title}</h3>
      </div>
      <p
        className="mt-2 text-sm text-fg/70"
        dangerouslySetInnerHTML={{
          __html: w.body.replace('{amount}', `<span class="font-semibold">${amount}</span>`),
        }}
      />

      <div className="mt-4 flex items-center justify-between rounded-xl bg-white px-4 py-3">
        <div>
          <div className="text-xs uppercase tracking-wider text-fg/40">{w.reference}</div>
          <div className="font-display text-lg font-bold tracking-wide">{reference}</div>
        </div>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-full bg-black/[0.06] px-3 py-2 text-xs font-medium transition hover:bg-black/[0.1]"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? w.copied : w.copy}
        </button>
      </div>

      {integrations.wiseLink && (
        <a
          href={integrations.wiseLink}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-azure px-6 py-3 font-semibold text-white transition hover:scale-[1.02] active:scale-95"
        >
          {w.pay} <ArrowUpRight className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}
