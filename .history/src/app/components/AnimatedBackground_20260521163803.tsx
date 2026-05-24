export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0 animate-gradient"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 15%, rgba(56, 189, 248, 0.18), transparent 18%),' +
            'radial-gradient(circle at 82% 12%, rgba(168, 85, 247, 0.14), transparent 16%),' +
            'linear-gradient(135deg, rgba(7, 13, 34, 1) 0%, rgba(14, 25, 55, 0.95) 60%, rgba(10, 16, 36, 1) 100%)',
          opacity: 0.96,
          backgroundSize: '180% 180%',
        }}
      />
      <div className="absolute -top-8 left-8 w-96 h-96 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-24 right-10 w-80 h-80 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute left-1/2 top-44 -translate-x-1/2 w-96 h-96 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
      <div className="absolute bottom-16 right-24 w-72 h-72 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-6000"></div>
    </div>
  );
}
