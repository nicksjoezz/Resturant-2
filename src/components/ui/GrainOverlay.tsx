// A subtle paper-grain texture layer over the whole site so flat cream
// surfaces feel tactile rather than digital. Static + GPU-cheap.
export default function GrainOverlay() {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>`;
  return (
    <div
      aria-hidden
      // No mix-blend-mode: a blended full-screen layer forces the browser to
      // recomposite the whole page every scroll/paint. A plain low-opacity layer
      // gives the same paper texture for almost no cost.
      className="pointer-events-none fixed inset-0 z-[100] opacity-[0.035]"
      style={{
        backgroundImage: `url("data:image/svg+xml,${svg}")`,
        backgroundSize: '150px 150px',
      }}
    />
  );
}
