export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      
      {/* Faster animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50 animate-gradient-fast"></div>

      {/* Faster floating blobs */}
      <div className="absolute top-20 left-10 h-72 w-72 animate-blob-fast rounded-full bg-blue-200 opacity-30 mix-blend-multiply blur-xl filter"></div>

      <div className="animation-delay-1 absolute top-40 right-10 h-72 w-72 animate-blob-fast rounded-full bg-cyan-200 opacity-30 mix-blend-multiply blur-xl filter"></div>

      <div className="animation-delay-2 absolute -bottom-8 left-1/2 h-72 w-72 animate-blob-fast rounded-full bg-sky-200 opacity-30 mix-blend-multiply blur-xl filter"></div>
    </div>
  );
}