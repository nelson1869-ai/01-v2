function StatusBadge() {
  // inline-flex = parang flex pero inline
  // items-center = align sa gitna
  // gap-1.5 = espasyo sa pagitan
  // text-sm = maliit na text
  // text-emerald-400 = berdeng kulay
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-emerald-400">
      <span className="size-2 rounded-full bg-emerald-400"></span>
      Live
    </span>
  );
}

export default function Page() {
  // min-h-screen = buong taas ng screen
  // bg-[#050711] = custom dark na kulay (hex color)
  // text-white = puting text
  // p-8 = padding sa lahat ng sides
  return (
    <main className="min-h-screen bg-[#050711] text-white p-8">
      {/* mt-0 mb-2 = walang margin sa itaas, maliit sa baba */}
      <h1 className="text-2xl font-bold text-indigo-400">AutoDo 01-v2</h1>

      <p className="text-gray-400 text-sm mb-4">Personal AI OS — Phase 0</p>

      <StatusBadge />
    </main>
  );
}
