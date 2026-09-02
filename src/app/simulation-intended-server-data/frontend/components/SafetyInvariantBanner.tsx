"use client";

import React from "react";

export function SafetyInvariantBanner() {
  return (
    <>
      <div className="px-4 pt-3 sm:px-6" role="note">
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-800/60 bg-amber-950/20 px-3.5 py-2 font-mono text-xs text-amber-200">
          <strong>SIMULATED PERSONAL DEV-LAB SCENARIO</strong>
          <span className="text-amber-300/90 text-xs">
            All runs, accounts, tool calls, traces, decisions, verification, and
            secrets shown below are UI-only mock data. Provenance badges
            demonstrate the future runtime contract.
          </span>
        </div>
      </div>

      {/* PERMANENT CONTROL INVARIANTS PANEL */}
      <div className="px-4 pt-3 sm:px-6">
        <div className="rounded-xl border border-indigo-900/60 bg-gradient-to-r from-[#0c1228] to-[#070a18] p-3.5 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-indigo-900/40">
            <span className="font-bold text-indigo-300 uppercase tracking-wider text-xs flex items-center gap-2">
              <span>🛡️</span> AUTODO NON-NEGOTIABLE CONTROL INVARIANTS (ENFORCED
              ACROSS ALL 18 LAYERS)
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              SAFETY BOUNDARY RIGID
            </span>
          </div>
          <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7 font-mono text-xs">
            <div className="p-1.5 rounded bg-[#050711] border border-[#151c33] text-slate-300 truncate">
              <strong className="text-amber-300">AI Choice</strong> ≠ Permission
            </div>
            <div className="p-1.5 rounded bg-[#050711] border border-[#151c33] text-slate-300 truncate">
              <strong className="text-amber-300">Score</strong> ≠ Permission
            </div>
            <div className="p-1.5 rounded bg-[#050711] border border-[#151c33] text-slate-300 truncate">
              <strong className="text-amber-300">Memory</strong> ≠ Permission
            </div>
            <div className="p-1.5 rounded bg-[#050711] border border-[#151c33] text-slate-300 truncate">
              <strong className="text-amber-300">Grounding</strong> ≠ Permission
            </div>
            <div className="p-1.5 rounded bg-[#050711] border border-[#151c33] text-slate-300 truncate">
              <strong className="text-amber-300">Plan</strong> ≠ Permission
            </div>
            <div className="p-1.5 rounded bg-[#050711] border border-[#151c33] text-slate-300 truncate">
              <strong className="text-amber-300">Learn</strong> ≠ Authority
            </div>
            <div className="p-1.5 rounded bg-[#050711] border border-[#151c33] text-slate-300 truncate">
              <strong className="text-emerald-300">Policy+Auth</strong> = Gate
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
