export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 animate-gradient"
        style={{
          background: 'radial-gradient(circle at 12% 18%, rgba(56,189,248,0.20), transparent 16%), radial-gradient(circle at 88% 14%, rgba(125,211,252,0.12), transparent 18%), linear-gradient(145deg, #020617 0%, #07101e 45%, #0b1220 100%)',
          backgroundBlendMode: 'screen',
        }}
      />

      {/* Floating shapes */}
      <div
        className="absolute top-16 left-8 w-80 h-80 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob"
        style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.32), transparent 40%)' }}
      />
      <div
        className="absolute top-32 right-6 w-80 h-80 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob delay-2000"
        style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.24), transparent 40%)' }}
      />
      <div
        className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full mix-blend-screen filter blur-3xl opacity-35 animate-blob delay-4000"
        style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.22), transparent 45%)' }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 10%, rgba(255,255,255,0.12), transparent 18%), radial-gradient(circle at 20% 80%, rgba(14,165,233,0.06), transparent 12%), radial-gradient(circle at 80% 70%, rgba(168,85,247,0.05), transparent 16%)',
          opacity: 0.8,
        }}
      />
    </div>
  );
}
