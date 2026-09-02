"use client";

import React, { useState } from "react";

interface DirectPromptExecutionCardProps {
  scenarioTitle: string;
  isPlayingReplay: boolean;
  onTriggerDirectRun: (promptText: string) => void;
}

export function DirectPromptExecutionCard({
  scenarioTitle,
  isPlayingReplay,
  onTriggerDirectRun,
}: DirectPromptExecutionCardProps) {
  const [directPrompt, setDirectPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directPrompt.trim() || isPlayingReplay) return;
    onTriggerDirectRun(directPrompt);
    setDirectPrompt("");
  };

  return (
    <div className="rounded-xl border border-indigo-900/60 bg-gradient-to-r from-[#0c1228] to-[#070a18] p-3.5 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-[#151c33]">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white text-xs shadow-md">
            ⚡
          </span>
          <span className="font-bold text-white text-xs sm:text-sm">
            Direct Prompt Execution (Trigger Live 18-Layer Brain Run)
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Active Scenario:{" "}
          <strong className="text-indigo-300">{scenarioTitle}</strong>
        </span>
      </div>

      {/* Form and Prompt Presets */}
      <div className="mt-2.5 flex flex-col gap-2">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={directPrompt}
            onChange={(e) => setDirectPrompt(e.target.value)}
            placeholder="Type any command to execute directly through all 18 layers (e.g. 'Summarize unread emails', 'Reply to John Doe')..."
            className="flex-1 rounded-lg border border-[#202c52] bg-[#050711] px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!directPrompt.trim() || isPlayingReplay}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-indigo-500 transition disabled:opacity-40 cursor-pointer"
          >
            <span>
              {isPlayingReplay ? "⏳ Running..." : "▶ Run (18 Layers)"}
            </span>
          </button>
        </form>

        {/* Quick Trigger Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] font-mono">
          <span className="text-slate-500 font-semibold uppercase">
            Try Live Prompts:
          </span>
          <button
            disabled={isPlayingReplay}
            onClick={() =>
              onTriggerDirectRun(
                "Summarize unread important emails from today from Gmail.",
              )
            }
            className="px-2.5 py-0.5 rounded-md bg-[#090d1f] border border-[#1b2545] text-slate-300 hover:border-indigo-500 hover:text-white transition disabled:opacity-50 cursor-pointer"
          >
            📬 Summarize morning emails
          </button>
          <button
            disabled={isPlayingReplay}
            onClick={() =>
              onTriggerDirectRun(
                "Auto-reply to John Doe's proposal follow-up on Gmail proposing Thursday 2:00 PM sync (acting as me).",
              )
            }
            className="px-2.5 py-0.5 rounded-md bg-[#090d1f] border border-[#1b2545] text-slate-300 hover:border-emerald-500 hover:text-white transition disabled:opacity-50 cursor-pointer"
          >
            ✉️ Auto-reply to John Doe (Acting as Me)
          </button>
          <button
            disabled={isPlayingReplay}
            onClick={() =>
              onTriggerDirectRun(
                "Check my calendar availability and schedule sync for this week.",
              )
            }
            className="px-2.5 py-0.5 rounded-md bg-[#090d1f] border border-[#1b2545] text-slate-300 hover:border-indigo-500 hover:text-white transition disabled:opacity-50 cursor-pointer"
          >
            📅 Check calendar availability
          </button>
        </div>
      </div>
    </div>
  );
}
