"use client";

import React, { useState } from "react";
import type { ScenarioId } from "../../scenarios";
import { getReplayProgress } from "../utils/replayProgress";

interface RagViewProps {
  activeScenarioId?: ScenarioId;
  simulatedMaxStep?: number;
  isPlayingReplay?: boolean;
}

export function RagView({
  activeScenarioId = "ask-1",
  simulatedMaxStep = 18,
  isPlayingReplay = false,
}: RagViewProps) {
  const isAsk2 = activeScenarioId === "ask-2";
  const [showGuidelineDoc, setShowGuidelineDoc] = useState<boolean>(true);
  const replayProgress = getReplayProgress(simulatedMaxStep, isPlayingReplay);
  const isRetrieved = replayProgress.completedThrough >= 4;
  const isCurrentlySearching = isPlayingReplay && simulatedMaxStep === 4;
  const [searchingSubstep, setSearchingSubstep] = useState<number>(1);

  // Progressive sub-step timer during the 14-second Layer 4 search
  React.useEffect(() => {
    if (!isCurrentlySearching) return;

    const intervals = [
      setTimeout(() => setSearchingSubstep(2), 1600),
      setTimeout(() => setSearchingSubstep(3), 3200),
      setTimeout(() => setSearchingSubstep(4), 5000),
      setTimeout(() => setSearchingSubstep(5), 7000),
      setTimeout(() => setSearchingSubstep(6), 9200),
      setTimeout(() => setSearchingSubstep(7), 11000),
      setTimeout(() => setSearchingSubstep(8), 12600),
      setTimeout(() => setSearchingSubstep(9), 13800),
    ];

    return () => {
      intervals.forEach((t) => clearTimeout(t));
    };
  }, [isCurrentlySearching]);

  const activeRagSubstep = isCurrentlySearching
    ? searchingSubstep
    : simulatedMaxStep >= 4
      ? 9
      : 0;

  return (
    <div className="flex flex-col gap-4 text-xs">
      <div className="rounded-xl border border-[#151c33] bg-[#070a18] p-4">
        <div className="flex justify-between items-center pb-2.5 border-b border-[#12182d]">
          <div>
            <h4 className="font-bold text-white text-sm sm:text-base">
              RAG &amp; Retrieval Engine (Layer 4)
            </h4>
            <p className="text-xs text-slate-400">
              Selective retrieval: RAG runs dynamically based on command intent
              &amp; owner guidelines
            </p>
          </div>
          <span
            className={`rounded-md px-2.5 py-1 font-mono text-xs font-bold border ${
              isCurrentlySearching
                ? "bg-cyan-950 text-cyan-300 border-cyan-700 animate-pulse"
                : simulatedMaxStep === 0
                  ? "bg-slate-900 text-slate-400 border-slate-800"
                  : "bg-emerald-950 text-emerald-400 border-emerald-800"
            }`}
          >
            {isCurrentlySearching
              ? "⚡ PGVECTOR: SEARCHING (14s)..."
              : simulatedMaxStep === 0
                ? "RAG: STANDBY (0/18)"
                : "RAG REQUIRED: YES (Strategy: HYBRID_VECTOR)"}
          </span>
        </div>

        {/* Live Active Querying Banner when Layer 4 is Executing */}
        {isCurrentlySearching && (
          <div className="mt-3.5 rounded-lg border border-cyan-500/70 bg-cyan-950/30 p-3.5 space-y-2 animate-pulse font-mono text-xs">
            <div className="flex items-center justify-between text-cyan-300 font-bold">
              <span className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-cyan-400 animate-ping"></span>
                Layer 4: pgvector Vector Distance Search in Progress (14s)
              </span>
              <span>NVIDIA Nemotron-3-Embed-1B (2048-dim)</span>
            </div>
            <p className="text-slate-200 text-xs font-sans">
              Querying PostgreSQL <code>knowledge_base</code> table using HNSW
              index cosine similarity with 2048-dim Nemotron embeddings for
              prompt intent:{" "}
              <strong className="text-white">
                {isAsk2
                  ? '"John Doe proposal sync Nelson persona guidelines"'
                  : '"May 2026 payroll statement net pay guidelines"'}
              </strong>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-cyan-900/60 text-[10px] text-cyan-200">
              <div>
                Model: <strong>nemotron-3-embed-1b</strong>
              </div>
              <div>
                Dimensions: <strong>2048 Dense Floats</strong>
              </div>
              <div>
                Top-K: <strong>5 Chunks</strong>
              </div>
              <div>
                Threshold: <strong>&gt;= 0.85</strong>
              </div>
            </div>
          </div>
        )}

        {/* RAG Pipeline Flow */}
        <div className="mt-3.5 p-3.5 rounded-lg bg-[#090d1f] border border-[#151c33]">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2 font-mono">
            Visual RAG Pipeline (Target Stack: TypeScript + Node.js + pgvector)
          </span>
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
            {[
              { id: 1, name: "1. Ingestion" },
              { id: 2, name: "2. Chunking" },
              { id: 3, name: "3. Embeddings" },
              { id: 4, name: "4. pgvector Index" },
              { id: 5, name: "5. Hybrid Search" },
              { id: 6, name: "6. Rerank" },
              { id: 7, name: "7. Deduplicate" },
              { id: 8, name: "8. AI Context" },
            ].map((stage, idx) => {
              const isPassed = activeRagSubstep > stage.id;
              const isActive =
                isCurrentlySearching && activeRagSubstep === stage.id;
              const isUpcoming =
                isCurrentlySearching && activeRagSubstep < stage.id;

              return (
                <React.Fragment key={stage.id}>
                  {idx > 0 && (
                    <span
                      className={
                        isPassed
                          ? "text-emerald-500 font-bold"
                          : isActive
                            ? "text-cyan-400 font-bold animate-pulse"
                            : "text-slate-600"
                      }
                    >
                      →
                    </span>
                  )}
                  <span
                    className={`px-2.5 py-1 rounded text-xs transition-all duration-300 border flex items-center gap-1.5 ${
                      isActive
                        ? "bg-cyan-950/90 text-cyan-200 border-cyan-400 font-bold animate-pulse shadow-lg shadow-cyan-950"
                        : isPassed
                          ? "bg-[#061c16] text-emerald-300 border-emerald-800 font-semibold"
                          : isUpcoming
                            ? "bg-[#050711] text-slate-400 border-[#1b2545]"
                            : "bg-[#04060f] text-slate-600 border-[#10162a]"
                    }`}
                  >
                    {isActive && (
                      <span className="size-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                    )}
                    <span>{stage.name}</span>
                    <span className="font-mono text-[10px]">
                      {isPassed
                        ? "✔"
                        : isActive
                          ? "⚡ Loading..."
                          : isUpcoming
                            ? "⏳"
                            : "○"}
                    </span>
                  </span>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Retrieved Results Table */}
        <div className="mt-4">
          <h5 className="font-bold text-slate-200 uppercase tracking-wider text-xs pb-2 border-b border-[#12182d]">
            Retrieved Knowledge Fragments (Simulated for{" "}
            {isAsk2 ? "Ask 2: Auto-Reply" : "Ask 1: Summarize"})
          </h5>

          {!isRetrieved ? (
            <div className="mt-2.5 p-8 rounded-lg bg-[#090d1f] border border-dashed border-[#1e2a4a] text-center space-y-2 font-sans">
              <span className="text-2xl font-mono">⏳</span>
              <h4 className="text-sm font-bold text-slate-200">
                No RAG Fragments Retrieved Yet (Layer 4 Not Yet Executed)
              </h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                {simulatedMaxStep === 0
                  ? "No active run in memory (Cache Cleared). Enter a prompt from Client View or trigger a run to query pgvector RAG."
                  : `Currently at Layer ${simulatedMaxStep}/18. RAG vector similarity search will execute once reaching Layer 4.`}
              </p>
            </div>
          ) : (
            <div className="mt-2.5 space-y-2 font-mono text-xs">
              {isAsk2 ? (
                <>
                  <div className="p-3 rounded-lg bg-[#090d1f] border border-indigo-500/70 flex flex-col gap-2 shadow-sm">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-bold text-white text-sm block">
                          #MEM-019: Nelson Persona &amp; Partner Auto-Reply
                          Guidelines
                        </span>
                        <span className="text-slate-300 text-xs mt-0.5 block">
                          &ldquo;Client John Doe is a trusted partner;
                          auto-replies permitted; Tone: Professional, direct;
                          Signoff: &apos;Best, Nelson&apos;&rdquo;
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-indigo-300 font-bold text-xs block">
                          Similarity: 0.972
                        </span>
                        <span className="text-emerald-400 font-bold text-xs">
                          SELECTED
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#12182d] flex justify-between items-center">
                      <span className="text-slate-400 text-xs">
                        Document Source:{" "}
                        <code className="text-indigo-300">
                          knowledge_base/owner_guidelines/DOC-GUIDELINE-019.md
                        </code>
                      </span>
                      <button
                        onClick={() => setShowGuidelineDoc(!showGuidelineDoc)}
                        className="px-2.5 py-1 rounded bg-indigo-600/80 hover:bg-indigo-600 text-white font-semibold text-xs cursor-pointer transition"
                      >
                        {showGuidelineDoc
                          ? "Hide Guideline Playbook ▲"
                          : "View Guideline Playbook ▼"}
                      </button>
                    </div>
                  </div>

                  {/* Interactive Guideline Document Viewer */}
                  {showGuidelineDoc && (
                    <div className="p-4 rounded-lg bg-[#050711] border border-[#151c33] space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-[#12182d]">
                        <span className="font-bold text-indigo-300 text-xs uppercase">
                          📄 Playbook: DOC-GUIDELINE-019.md
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Verified Persona Rulebook
                        </span>
                      </div>
                      <div className="space-y-2 text-slate-300 text-xs font-sans leading-relaxed">
                        <p>
                          <strong className="text-white">
                            Rule 1 (Trusted Contacts):
                          </strong>{" "}
                          Auto-replies are authorized only for allowlisted
                          partners (e.g. John Doe &lt;john.doe@partner.org&gt;).
                        </p>
                        <p>
                          <strong className="text-white">
                            Rule 2 (Meeting Scheduling):
                          </strong>{" "}
                          Propose only calendar slots that are strictly verified
                          free. If free, automatically create a tentative
                          calendar hold.
                        </p>
                        <p>
                          <strong className="text-white">
                            Rule 3 (Tone &amp; Sign-off):
                          </strong>{" "}
                          Keep replies concise, polite, and professional. Always
                          close with &ldquo;Best, Nelson&rdquo;.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="p-3 rounded bg-[#090d1f] border border-[#151c33] flex justify-between items-center opacity-60">
                    <div>
                      <span className="font-bold text-slate-300 block">
                        #MEM-002: General Email Etiquette &amp; Formatting
                      </span>
                      <span className="text-slate-500 text-xs">
                        &ldquo;Default greeting styles, signature
                        standards...&rdquo; (Source: Owner Config)
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block text-xs">
                        Similarity: 0.618
                      </span>
                      <span className="text-slate-500 font-bold text-xs">
                        IGNORED
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3 rounded-lg bg-[#090d1f] border border-indigo-500/70 flex justify-between items-center shadow-sm">
                    <div>
                      <span className="font-bold text-white text-sm block">
                        #DOC-012: Morning Inbox Triage Preferences
                      </span>
                      <span className="text-slate-300 text-xs mt-0.5 block">
                        &ldquo;Prioritize HR, Finance &amp; high-urgency unread
                        messages; summarize top 3...&rdquo;
                      </span>
                      <span className="text-slate-500 text-[10px] block mt-1">
                        Source:{" "}
                        <code className="text-indigo-300">
                          knowledge_base/triage_rules.md
                        </code>
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-indigo-300 font-bold text-xs block">
                        Similarity: 0.941
                      </span>
                      <span className="text-emerald-400 font-bold text-xs">
                        SELECTED
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded bg-[#090d1f] border border-[#151c33] flex justify-between items-center opacity-60">
                    <div>
                      <span className="font-bold text-slate-300 block">
                        #DOC-084: Old Q1 Marketing Plan
                      </span>
                      <span className="text-slate-500 text-xs">
                        &ldquo;Q1 Roadmap marketing review...&rdquo; (Source:
                        Filesystem)
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block text-xs">
                        Similarity: 0.42
                      </span>
                      <span className="text-rose-400 font-bold text-xs">
                        REJECTED (Low relevance)
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
