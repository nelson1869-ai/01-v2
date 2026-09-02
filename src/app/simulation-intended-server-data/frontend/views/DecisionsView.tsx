"use client";

import React from "react";
import type { CandidateAction, ModelProviderId } from "../../contracts";
import { CANDIDATES, MODEL_OPTIONS_BY_PROVIDER } from "../../ai";
import { getReplayProgress } from "../utils/replayProgress";

interface DecisionsViewProps {
  selectedProvider: ModelProviderId;
  setSelectedProvider: (provider: ModelProviderId) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  customTemp: number;
  setCustomTemp: (temp: number) => void;
  customTopP: number;
  setCustomTopP: (topP: number) => void;
  customMaxTokens: number;
  setCustomMaxTokens: (maxTokens: number) => void;
  candidates?: readonly CandidateAction[];
  simulatedMaxStep?: number;
  isPlayingReplay?: boolean;
}

export function DecisionsView({
  selectedProvider,
  setSelectedProvider,
  selectedModel,
  setSelectedModel,
  customTemp,
  setCustomTemp,
  customTopP,
  setCustomTopP,
  customMaxTokens,
  setCustomMaxTokens,
  candidates = CANDIDATES,
  simulatedMaxStep = 18,
  isPlayingReplay = false,
}: DecisionsViewProps) {
  const replayProgress = getReplayProgress(simulatedMaxStep, isPlayingReplay);
  const isEvaluated = replayProgress.completedThrough >= 7;
  const isReasoningActive =
    isPlayingReplay &&
    (simulatedMaxStep === 5 ||
      simulatedMaxStep === 6 ||
      simulatedMaxStep === 7);

  return (
    <div className="flex flex-col gap-4 text-xs">
      {/* Model Router */}
      <div className="rounded-xl border border-[#151c33] bg-[#070a18] p-4">
        <div className="flex justify-between items-center pb-2 border-b border-[#12182d]">
          <div>
            <h4 className="font-bold text-white text-sm">
              V1 Model Router &amp; Fallbacks (Provider-Neutral)
            </h4>
            <p className="text-[10px] text-slate-500">
              Intelligent selection based on task complexity, cost, and privacy
              preferences
            </p>
          </div>
          <span
            className={`rounded px-2 py-0.5 font-mono text-[9px] font-bold border ${
              isReasoningActive
                ? "bg-cyan-950 text-cyan-300 border-cyan-700 animate-pulse"
                : simulatedMaxStep === 0
                  ? "bg-slate-900 text-slate-400 border-slate-800"
                  : "bg-indigo-950 text-indigo-300 border-indigo-800"
            }`}
          >
            {isReasoningActive
              ? "⚡ GEMINI 2.5 PRO: REASONING (20s)..."
              : simulatedMaxStep === 0
                ? "ROUTER: STANDBY (0/18)"
                : "ROUTER: ACTIVE (SIMULATED)"}
          </span>
        </div>

        {/* Live Active Reasoning Banner when Layer 5-7 is executing */}
        {isReasoningActive && (
          <div className="mt-3 rounded-lg border border-cyan-500/70 bg-cyan-950/30 p-3.5 space-y-2 animate-pulse font-mono text-xs">
            <div className="flex items-center justify-between text-cyan-300 font-bold">
              <span className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-cyan-400 animate-ping"></span>
                Layer 5–7: Gemini 2.5 Pro Deep Reasoning &amp; Candidate Scoring
                (20s)
              </span>
              <span>
                Temp: {customTemp} &bull; Top_P: {customTopP}
              </span>
            </div>
            <p className="text-slate-200 text-xs font-sans">
              Model evaluating prompt constraints against retrieved RAG
              guideline #MEM-019 &bull; Synthesizing structured JSON candidate
              actions &bull; Ranking candidate #1 (gmail.send_reply + calendar
              hold)...
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-cyan-900/60 text-[10px] text-cyan-200">
              <div>
                Output Format: <strong>Structured JSON</strong>
              </div>
              <div>
                Reasoning Depth: <strong>High</strong>
              </div>
              <div>
                Action Candidates: <strong>3 Generated</strong>
              </div>
              <div>
                Top Score: <strong>0.94 Confidence</strong>
              </div>
            </div>
          </div>
        )}

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3 font-mono text-[10px]">
          <div className="p-3 rounded bg-[#090d1f] border border-indigo-500/60 flex flex-col justify-between">
            <div>
              <span className="text-indigo-300 font-bold block uppercase">
                1. Selected Primary Model
              </span>
              <span className="text-white font-bold text-xs block mt-1">
                {MODEL_OPTIONS_BY_PROVIDER[selectedProvider].find(
                  (model) => model.id === selectedModel,
                )?.label ?? selectedModel}
              </span>
              <span className="text-slate-400 block mt-0.5">
                Reason: Complex structured planning &amp; JSON contract output
              </span>
              <span className="text-emerald-400 block mt-1">
                Status: HEALTHY
              </span>
            </div>
            <div className="mt-2 pt-2 border-t border-[#12182d] flex items-center justify-between">
              <span className="text-slate-500">Provider:</span>
              <select
                value={selectedProvider}
                onChange={(e) => {
                  const provider = e.target.value as ModelProviderId;
                  setSelectedProvider(provider);
                  setSelectedModel(MODEL_OPTIONS_BY_PROVIDER[provider][0].id);
                }}
                className="rounded bg-[#050711] px-1.5 py-0.5 text-[9px] text-indigo-300 border border-[#151c33]"
              >
                <option value="nvidia">
                  NVIDIA NIM (DeepSeek / Llama Guard)
                </option>
                <option value="gemini">Google Gemini</option>
                <option value="openai">OpenAI</option>
                <option value="ollama">Ollama (Local)</option>
              </select>
            </div>
          </div>

          <div className="p-3 rounded bg-[#090d1f] border border-[#151c33] flex flex-col justify-between">
            <div>
              <span className="text-slate-400 font-bold block uppercase">
                2. Primary Model Configuration
              </span>
              <span className="text-slate-200 font-bold text-xs block mt-1">
                {MODEL_OPTIONS_BY_PROVIDER[selectedProvider].find(
                  (model) => model.id === selectedModel,
                )?.label ?? selectedModel}
              </span>
              <span className="text-slate-500 block mt-0.5">
                UI-only selection for the simulated model router
              </span>
            </div>
            <div className="mt-2 pt-2 border-t border-[#12182d] flex items-center justify-between">
              <span className="text-slate-500">Model:</span>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="rounded bg-[#050711] px-1.5 py-0.5 text-[9px] text-slate-200 border border-[#151c33]"
              >
                {MODEL_OPTIONS_BY_PROVIDER[selectedProvider].map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-3 rounded bg-[#090d1f] border border-[#151c33] flex flex-col justify-between">
            <div>
              <span className="text-slate-400 font-bold block uppercase">
                3. Local Private Fallback
              </span>
              <span className="text-slate-200 font-bold text-xs block mt-1">
                Ollama (Llama 3.3 70B Local)
              </span>
              <span className="text-slate-500 block mt-0.5">
                For offline / high-privacy sensitive personal context
              </span>
            </div>
            <div className="mt-2 pt-2 border-t border-[#12182d] flex items-center gap-2 font-mono text-[9px]">
              <span>Temp:</span>
              <input
                type="number"
                step="0.05"
                min="0"
                max="1"
                value={customTemp}
                onChange={(e) =>
                  setCustomTemp(parseFloat(e.target.value) || 0.2)
                }
                className="w-12 rounded bg-[#050711] px-1 py-0.5 text-center text-slate-200 border border-[#151c33]"
              />
              <span>TopP:</span>
              <input
                type="number"
                step="0.05"
                min="0.1"
                max="1"
                value={customTopP}
                onChange={(e) =>
                  setCustomTopP(parseFloat(e.target.value) || 1.0)
                }
                className="w-12 rounded bg-[#050711] px-1 py-0.5 text-center text-slate-200 border border-[#151c33]"
              />
              <span>MaxTok:</span>
              <input
                type="number"
                value={customMaxTokens}
                onChange={(e) =>
                  setCustomMaxTokens(parseInt(e.target.value, 10) || 2048)
                }
                className="w-14 rounded bg-[#050711] px-1 py-0.5 text-center text-slate-200 border border-[#151c33]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Candidate Generation & Heuristic Scoring Matrix */}
      <div className="rounded-xl border border-[#151c33] bg-[#070a18] p-4">
        <h4 className="font-bold uppercase tracking-wider text-slate-300 pb-2 border-b border-[#12182d]">
          Candidate Action Evaluation Matrix (Layer 6 &amp; 7)
        </h4>

        {!isEvaluated ? (
          <div className="mt-3 p-8 rounded-lg bg-[#090d1f] border border-dashed border-[#1e2a4a] text-center space-y-2 font-sans">
            <span className="text-2xl font-mono">⏳</span>
            <h4 className="text-sm font-bold text-slate-200">
              No Candidate Actions Evaluated Yet (Awaiting Layer 5 &amp; 6
              Execution)
            </h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              {simulatedMaxStep === 0
                ? "No active run in memory (Cache Cleared). Enter a prompt from Client View or trigger a run to evaluate candidate actions live."
                : `Currently at Layer ${simulatedMaxStep}/18. Gemini 2.5 Pro candidate actions and confidence scoring will appear when reaching Layer 5–7.`}
            </p>
          </div>
        ) : (
          <div className="mt-3 flex flex-col gap-2">
            {candidates.map((c) => (
              <div
                key={c.id}
                className={`p-3 rounded-lg border ${
                  c.status === "chosen"
                    ? "bg-[#10172e] border-indigo-500/70 shadow-sm"
                    : "bg-[#090d1f] border-[#151c33] opacity-75"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-bold ${
                        c.status === "chosen"
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                          : "bg-rose-950 text-rose-400 border border-rose-800"
                      }`}
                    >
                      {c.status.toUpperCase()}
                    </span>
                    <span className="font-mono text-xs font-bold text-white">
                      {c.action}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      via {c.tool}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-[10px]">
                    <span className="text-indigo-300">Score: {c.score}</span>
                    <span className="text-slate-400">
                      {c.latencyEstimateMs}ms
                    </span>
                    <span className="text-slate-400">
                      ${c.costEstimateUsd.toFixed(4)}
                    </span>
                  </div>
                </div>
                <p className="mt-1.5 text-[11px] text-slate-300">{c.reason}</p>
                <div className="mt-2 flex items-center justify-between border-t border-[#12182d] pt-1.5 font-mono text-[9px] text-slate-500">
                  <span>Required Scope: {c.requiredScope}</span>
                  <span>Risk: {c.risk}</span>
                  <span>Confidence: {c.confidence}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
