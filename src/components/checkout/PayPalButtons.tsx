'use client';

import { useEffect, useRef, useState } from 'react';
import { integrations } from '@/lib/config';

/**
 * Renders PayPal Smart Buttons. The SDK loads only when a client id is set, so
 * this component renders nothing in the demo (no keys) — gracefully hidden.
 * On approval it captures the order client-side and reports the PayPal order id.
 */
export default function PayPalButtons({
  amount,
  onApproved,
  onError,
}: {
  amount: number;
  onApproved: (paypalOrderId: string) => void;
  onError?: (msg: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const clientId = integrations.paypalClientId;

  // Load the SDK once.
  useEffect(() => {
    if (!clientId) return;
    const id = 'paypal-sdk';
    if (document.getElementById(id)) {
      setReady(true);
      return;
    }
    const s = document.createElement('script');
    s.id = id;
    s.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=USD`;
    s.onload = () => setReady(true);
    s.onerror = () => onError?.('Could not load PayPal.');
    document.body.appendChild(s);
  }, [clientId, onError]);

  // Render the buttons when ready / when amount changes.
  useEffect(() => {
    const paypal = (window as unknown as { paypal?: any }).paypal;
    if (!ready || !paypal || !containerRef.current) return;
    containerRef.current.innerHTML = '';
    paypal
      .Buttons({
        style: { shape: 'pill', color: 'gold', layout: 'horizontal', height: 48 },
        createOrder: (_data: unknown, actions: any) =>
          actions.order.create({
            purchase_units: [{ amount: { value: amount.toFixed(2) } }],
          }),
        onApprove: async (_data: unknown, actions: any) => {
          const details = await actions.order.capture();
          onApproved(details.id);
        },
        onError: () => onError?.('PayPal payment failed.'),
      })
      .render(containerRef.current);
  }, [ready, amount, onApproved, onError]);

  if (!clientId) return null;
  return <div ref={containerRef} className="min-h-[48px]" />;
}
