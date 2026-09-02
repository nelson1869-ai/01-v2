"use client";

import React from "react";
import type { ScenarioId } from "../../scenarios";
import { getReplayProgress } from "../utils/replayProgress";

interface MemoryViewProps {
  activeScenarioId?: ScenarioId;
  simulatedMaxStep?: number;
  isPlayingReplay?: boolean;
}

export function MemoryView({
  activeScenarioId = "ask-1",
  simulatedMaxStep = 18,
  isPlayingReplay = false,
}: MemoryViewProps) {
  const isAsk2 = activeScenarioId === "ask-2";
  const replayProgress = getReplayProgress(simulatedMaxStep, isPlayingReplay);
  const isWritten = replayProgress.completedThrough >= 18;
  const isCurrentlyWriting = isPlayingReplay && simulatedMaxStep === 18;

  return (
    <div className="flex flex-col gap-4 text-xs">
      <div className="rounded-xl border border-[#151c33] bg-[#070a18] p-4">
        <div className="flex justify-between items-center pb-2 border-b border-[#12182d]">
          <div>
            <h4 className="font-bold text-white text-sm">
              AutoDo 6-Type Memory System &amp; Write Decision Pipeline
            </h4>
            <p className="text-[10px] text-slate-500">
              Distinction: RAG = Retrieval Process | Memory = Persisted Durable
              Knowledge
            </p>
          </div>
          <span
            className={`font-mono text-[10px] px-2 py-0.5 rounded border ${
              isCurrentlyWriting
                ? "bg-purple-950 text-purple-300 border-purple-700 animate-pulse"
                : "text-purple-300 border-transparent"
            }`}
          >
            {isCurrentlyWriting
              ? "⚡ WRITING TO PGVECTOR (12s)..."
              : "VERIFIED MEMORY != AUTHORIZATION"}
          </span>
        </div>

        {/* Active Writing Banner */}
        {isCurrentlyWriting && (
          <div className="mt-3 rounded-lg border border-purple-500/70 bg-purple-950/30 p-3.5 space-y-2 animate-pulse font-mono text-xs">
            <div className="flex items-center justify-between text-purple-300 font-bold">
              <span className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-purple-400 animate-ping"></span>
                Layer 18: Quality-Checked Durable Memory Write in Progress (12s)
              </span>
              <span>Deduplication Gate: PASSED</span>
            </div>
            <p className="text-slate-200 text-xs font-sans">
              Generating embedding vector for verified interaction outcome
              &bull; Deduplicating against existing episodic records &bull;
              Committing chunk to <code>durable_memory</code> table...
            </p>
          </div>
        )}

        {/* 6 Memory Types Grid */}
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 font-mono text-[10px]">
          <div className="p-2.5 rounded bg-[#090d1f] border border-[#151c33]">
            <span className="text-indigo-400 font-bold block uppercase">
              1. Conversation Memory
            </span>
            <span className="text-slate-300 block mt-0.5">
              Short-term dialogue context in session
            </span>
          </div>
          <div className="p-2.5 rounded bg-[#090d1f] border border-[#151c33]">
            <span className="text-indigo-400 font-bold block uppercase">
              2. Working Memory
            </span>
            <span className="text-slate-300 block mt-0.5">
              Temporary scratchpad state during run
            </span>
          </div>
          <div className="p-2.5 rounded bg-[#090d1f] border border-[#151c33]">
            <span className="text-indigo-400 font-bold block uppercase">
              3. Personal Preferences
            </span>
            <span className="text-slate-300 block mt-0.5">
              Owner style rules, briefing times, habits
            </span>
          </div>
          <div className="p-2.5 rounded bg-[#090d1f] border border-[#151c33]">
            <span className="text-indigo-400 font-bold block uppercase">
              4. Episodic Memory
            </span>
            <span className="text-slate-300 block mt-0.5">
              Historical log of past run events and summaries
            </span>
          </div>
          <div className="p-2.5 rounded bg-[#090d1f] border border-[#151c33]">
            <span className="text-indigo-400 font-bold block uppercase">
              5. Workflow Memory
            </span>
            <span className="text-slate-300 block mt-0.5">
              Proven multi-step tool call sequences
            </span>
          </div>
          <div className="p-2.5 rounded bg-[#090d1f] border border-purple-800/60 bg-purple-950/20">
            <span className="text-purple-300 font-bold block uppercase">
              6. Verified Memory
            </span>
            <span className="text-slate-200 block mt-0.5">
              Post-verification filtered long-term knowledge
            </span>
          </div>
        </div>

        {/* Memory Write Decision Pipeline */}
        <div className="mt-4 p-3 rounded bg-[#090d1f] border border-[#151c33]">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Layer 18 Memory-Write Decision Pipeline (Candidate → Filter →
            Store/Reject)
          </span>

          {!isWritten ? (
            <div className="p-6 rounded-lg bg-[#050711] border border-dashed border-[#1e2a4a] text-center space-y-1.5 font-sans">
              <span className="text-xl font-mono">⏳</span>
              <h5 className="text-xs font-bold text-slate-200">
                No Verified Memory Chunk Written Yet (Layer 18 Not Reached)
              </h5>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                {simulatedMaxStep === 0
                  ? "No active run in memory (Cache Cleared). Episodic memories are persisted only after all 18 layers execute."
                  : `Currently at Layer ${simulatedMaxStep}/18. Memory writes occur after Layer 15 (Verification) and Layer 17 (Learning) complete.`}
              </p>
            </div>
          ) : (
            <div className="space-y-2 font-mono text-[10px]">
              {isAsk2 ? (
                <div className="p-2 rounded bg-[#050711] border border-emerald-900/60 flex justify-between items-center">
                  <div>
                    <span className="text-white font-bold block">
                      STORED: #MEM-00130 (Episodic &amp; Partner Sync)
                    </span>
                    <span className="text-slate-400">
                      &ldquo;Sent auto-reply to John Doe proposing Thu May 29
                      2:00 PM sync on Q3 Architecture (15m hold created)&rdquo;
                    </span>
                  </div>
                  <span className="text-emerald-400 font-bold">
                    STORED (Quality: 0.98)
                  </span>
                </div>
              ) : (
                <div className="p-2 rounded bg-[#050711] border border-emerald-900/60 flex justify-between items-center">
                  <div>
                    <span className="text-white font-bold block">
                      STORED: #MEM-00129 (Workflow Pattern)
                    </span>
                    <span className="text-slate-400">
                      &ldquo;gmail.list_messages successfully handled read-only
                      unread-important summarization ($7,172.50 net pay)&rdquo;
                    </span>
                  </div>
                  <span className="text-emerald-400 font-bold">
                    STORED (Quality: 0.94)
                  </span>
                </div>
              )}

              <div className="p-2 rounded bg-[#050711] border border-rose-900/60 flex justify-between items-center opacity-70">
                <div>
                  <span className="text-slate-300 font-bold block">
                    REJECTED: Candidate Memory (Ephemeral Raw Email Payload)
                  </span>
                  <span className="text-slate-500">
                    &ldquo;Raw body HTML exceeds token threshold and contains
                    transient data&rdquo;
                  </span>
                </div>
                <span className="text-rose-400 font-bold">
                  REJECTED (Filter: Ephemeral)
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
