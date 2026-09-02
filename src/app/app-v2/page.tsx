"use client";

import { useState } from "react";

export default function Page() {
  // prompt = ang text na tine-type ng user
  const [prompt, setPrompt] = useState("");

  return (
    <main className="min-h-screen bg-[#050711] text-white p-8 space-y-4">
      <h1 className="text-2xl font-bold text-indigo-400">AutoDo 01-v2</h1>

      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ano ang gusto mong gawin?"
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
      />

      {/* Real-time na lumalabas ang tine-type mo */}
      {prompt && (
        <p className="text-sm text-gray-400">
          Sinulat mo: <span className="text-white font-medium">{prompt}</span>
        </p>
      )}
    </main>
  );
}
