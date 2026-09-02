"use client";

import { useState } from "react";

export default function Page() {
  const [prompt, setPrompt] = useState("");

  // Ito ang function na tatakbo kapag na-click ang Send button
  function handleSubmit() {
    if (!prompt.trim()) return; // Huwag mag-proceed kapag walang laman

    // console.log na may kulay! Makikita sa Chrome F12 → Console
    // %c = CSS styling, ang pangalawang argument ay ang CSS
    console.log(
      "%c[AutoDo] 🧠 Prompt received:",
      "color: #818cf8; font-weight: bold;",
      prompt,
    );

    setPrompt(""); // I-clear ang input pagkatapos mag-submit
  }

  return (
    <main className="min-h-screen bg-[#050711] text-white p-8 space-y-4">
      <h1 className="text-2xl font-bold text-indigo-400">AutoDo 01-v2</h1>

      <p className="text-xs text-gray-500 font-mono">
        Buksan ang Chrome F12 → Console para makita ang logs!
      </p>

      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="Subukan: 'summarize my emails'"
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
      />

      <button
        onClick={handleSubmit}
        disabled={!prompt.trim()}
        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed px-6 py-2.5 rounded-lg font-semibold transition"
      >
        Send →
      </button>
    </main>
  );
}
