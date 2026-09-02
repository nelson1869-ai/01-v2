"use client";

import React from "react";
import type { ScenarioId } from "../../scenarios";
import { getReplayProgress } from "../utils/replayProgress";

interface ContextViewProps {
  activeScenarioId?: ScenarioId;
  simulatedMaxStep?: number;
  isPlayingReplay?: boolean;
}

export function ContextView({
  activeScenarioId = "ask-1",
  simulatedMaxStep = 18,
  isPlayingReplay = false,
}: ContextViewProps) {
  const isAsk2 = activeScenarioId === "ask-2";
  const replayProgress = getReplayProgress(simulatedMaxStep, isPlayingReplay);
  const isAssembled = replayProgress.completedThrough >= 3;
  const isCurrentlyAssembling = isPlayingReplay && simulatedMaxStep === 3;

  return (
    <div className="flex flex-col gap-4 text-xs">
      <div className="rounded-xl border border-[#151c33] bg-[#070a18] p-4">
        <div className="flex justify-between items-center pb-2 border-b border-[#12182d]">
          <div>
            <h4 className="font-bold text-white text-sm">
              Context Assembled Before AI Reasoning (Layer 3)
            </h4>
            <p className="text-[10px] text-slate-500">
              Selective context injection — only relevant tokens supplied to
              model
            </p>
          </div>
          <span
            className={`font-mono text-[10px] px-2 py-0.5 rounded border ${
              isCurrentlyAssembling
                ? "bg-cyan-950 text-cyan-300 border-cyan-700 animate-pulse"
                : "text-indigo-300 border-transparent"
            }`}
          >
            {isCurrentlyAssembling
              ? "⚡ ASSEMBLING CONTEXT BUNDLE (12s)..."
              : isAssembled
                ? `Total Context: ${isAsk2 ? "12.8 KB (8,420 Tokens)" : "14.2 KB (9,840 Tokens)"}`
                : "Context: 0 KB (0 Tokens)"}
          </span>
        </div>

        {/* Active Assembling Banner */}
        {isCurrentlyAssembling && (
          <div className="mt-3 rounded-lg border border-cyan-500/70 bg-cyan-950/30 p-3.5 space-y-2 animate-pulse font-mono text-xs">
            <div className="flex items-center justify-between text-cyan-300 font-bold">
              <span className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-cyan-400 animate-ping"></span>
                Layer 3: Assembling Execution Context Bundle (12s)
              </span>
              <span>Token Window Budget: 16,000</span>
            </div>
            <p className="text-slate-200 text-xs font-sans">
              Binding owner persona profile, active connected account
              credentials (Gmail / Google Calendar), and time bounds into
              immutable <code>RunContext</code>...
            </p>
          </div>
        )}

        {!isAssembled ? (
          <div className="mt-3 p-8 rounded-lg bg-[#090d1f] border border-dashed border-[#1e2a4a] text-center space-y-2 font-sans">
            <span className="text-2xl font-mono">⏳</span>
            <h4 className="text-sm font-bold text-slate-200">
              No Context Assembled in Memory (Layer 3 Not Yet Executed)
            </h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              {simulatedMaxStep === 0
                ? "No active run in memory (Cache Cleared). Enter a prompt from Client View or trigger a run to assemble context."
                : `Currently at Layer ${simulatedMaxStep}/18. Context will be assembled and bound when reaching Layer 3.`}
            </p>
          </div>
        ) : (
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3 font-mono text-[10px]">
            <div className="p-3 rounded bg-[#090d1f] border border-[#151c33]">
              <span className="text-slate-400 font-bold block uppercase">
                Owner Context
              </span>
              <span className="text-slate-200 block mt-1">
                User: Nelson (dev@autodo.ai)
              </span>
              <span className="text-slate-200 block">
                Timezone: Asia/Manila (UTC+8)
              </span>
              <span className="text-slate-200 block">
                Work Hours: 08:00 - 18:00
              </span>
              {isAsk2 && (
                <span className="text-emerald-400 block mt-1">
                  Calendar: Thu May 29 2:00 PM Free
                </span>
              )}
            </div>

            <div className="p-3 rounded bg-[#090d1f] border border-[#151c33]">
              <span className="text-slate-400 font-bold block uppercase">
                Available Tools &amp; MCP
              </span>
              <span className="text-slate-200 block mt-1">
                {isAsk2
                  ? "Gmail API (send/reply active)"
                  : "Gmail API (read_only active)"}
              </span>
              <span className="text-slate-200 block">
                Calendar API (create_hold active)
              </span>
              <span className="text-slate-200 block">
                2 MCP Servers (Filesystem, Fetch)
              </span>
            </div>

            <div className="p-3 rounded bg-[#090d1f] border border-[#151c33]">
              <span className="text-slate-400 font-bold block uppercase">
                Policy Constraints &amp; Limits
              </span>
              <span className="text-slate-200 block mt-1">Max Steps: 20</span>
              <span className="text-slate-200 block">Budget: $0.05 / run</span>
              <span className="text-emerald-400 block mt-1">
                {isAsk2
                  ? "Policy: TRUSTED_CONTACT_AUTO_REPLY"
                  : "Policy: READ_ONLY_AUTO_APPROVE"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
