import Stripe from 'stripe';

const key = process.env.STRIPE_SECRET_KEY;

/**
 * Stripe is optional. When no secret key is configured we run in "simulated"
 * mode — the checkout API creates the order directly and marks it paid so the
 * full ordering flow works end-to-end without real credentials.
 */
export const stripeEnabled = Boolean(key && key.startsWith('sk_'));

// Omit apiVersion so we always use the SDK's pinned default — avoids tight
// coupling to a specific Stripe API version string.
export const stripe = stripeEnabled ? new Stripe(key as string) : null;
