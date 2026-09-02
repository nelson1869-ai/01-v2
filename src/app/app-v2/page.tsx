"use client";

import { useState } from "react";

export default function Page() {
  // useState = nagtatago ng value na pwedeng magbago
  // false = default na value (hindi pa na-click)
  const [clicked, setClicked] = useState(false);

  return (
    <main className="min-h-screen bg-[#050711] text-white p-8">
      <h1 className="text-2xl font-bold text-indigo-400 mb-4">AutoDo 01-v2</h1>

      <button
        onClick={() => setClicked(true)}
        className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded font-semibold"
      >
        Subukan
      </button>

      {/* Lalabas lang kapag clicked ay true */}
      {clicked && <p className="mt-4 text-emerald-400">Na-click mo! 🎉</p>}
    </main>
  );
}
