import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { getBaseUrl } from '@/lib/config';

export const dynamic = 'force-dynamic';

/**
 * Generates a QR code that links to the public menu.
 *   /api/qr                 -> PNG (inline, for <img>)
 *   /api/qr?format=svg      -> SVG (scalable, best for print)
 *   /api/qr?download=1      -> forces a file download
 *   /api/qr?target=/x       -> override the linked path
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const format = searchParams.get('format') === 'svg' ? 'svg' : 'png';
  const download = searchParams.get('download') === '1';
  const target = searchParams.get('target') || '/menu';
  const url = `${getBaseUrl()}${target.startsWith('/') ? target : `/${target}`}`;

  const opts = {
    margin: 1,
    width: 800,
    color: { dark: '#14110C', light: '#FFFFFF' },
  } as const;

  try {
    if (format === 'svg') {
      const svg = await QRCode.toString(url, { type: 'svg', ...opts });
      return new NextResponse(svg, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=3600',
          ...(download
            ? { 'Content-Disposition': 'attachment; filename="foddo-menu-qr.svg"' }
            : {}),
        },
      });
    }

    const buffer = await QRCode.toBuffer(url, { type: 'png', ...opts });
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600',
        ...(download
          ? { 'Content-Disposition': 'attachment; filename="foddo-menu-qr.png"' }
          : {}),
      },
    });
  } catch (err) {
    console.error('[qr]', err);
    return NextResponse.json({ error: 'Could not generate QR code.' }, { status: 500 });
  }
}
