"use client";

import React from "react";
import { getReplayProgress } from "../../utils/replayProgress";

interface TerminalFinalResultCardProps {
  scenarioResponse: {
    status: string;
    summaryTitle: string;
    bulletPoints: readonly string[];
    assertionsPassed: number;
    assertionsTotal: number;
    terminalDigest: string;
    durationMs: number;
    costUsd: number;
  };
  scenarioMetadata: {
    runId: string;
    activeLease: string;
    traceId: string;
    duration: string;
  };
  simulatedMaxStep: number;
  isPlayingReplay: boolean;
}

export function TerminalFinalResultCard({
  scenarioResponse,
  scenarioMetadata,
  simulatedMaxStep,
  isPlayingReplay,
}: TerminalFinalResultCardProps) {
  const replayProgress = getReplayProgress(
    simulatedMaxStep,
    isPlayingReplay,
  );
  const isCompleted = replayProgress.isComplete;
  const isIdle = replayProgress.isIdle;
  const isRunning =
    isPlayingReplay || (simulatedMaxStep > 0 && simulatedMaxStep < 18);

  return (
    <div
      className={`rounded-xl border p-4 text-xs transition-all duration-300 ${
        isCompleted
          ? "border-emerald-700 bg-[#071714] shadow-xl shadow-emerald-950/50"
          : isRunning
            ? "border-cyan-800 bg-[#070e1f] shadow-lg shadow-cyan-950/30"
            : "border-slate-800 bg-[#070a18] opacity-60"
      }`}
    >
      <div className="flex items-center justify-between pb-3 border-b border-[#12182d]">
        <div className="flex items-center gap-2.5">
          <span className="text-emerald-400 font-bold text-sm sm:text-base">
            ★ FINAL RESULT — TERMINAL RUN OUTCOME
          </span>
          <span
            className={`rounded-md px-2.5 py-1 text-xs font-bold uppercase font-mono border ${
              isCompleted
                ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                : isRunning
                  ? "bg-cyan-950 text-cyan-300 border-cyan-800 animate-pulse"
                  : "bg-slate-900 text-slate-400 border-slate-800"
            }`}
          >
            {isCompleted
              ? scenarioResponse.status
              : isRunning
                ? `RUNNING (LAYER ${simulatedMaxStep}/18)`
                : "STANDBY"}
          </span>
        </div>
        <span className="font-mono text-emerald-400 font-bold text-xs sm:text-sm">
          {isIdle
            ? "STATUS: IDLE (AWAITING RUN EXECUTION)"
            : isRunning
              ? `PROGRESS: ${replayProgress.completedCount}/18 COMPLETE · LAYER ${simulatedMaxStep} ACTIVE`
              : `STATUS: ${scenarioResponse.assertionsPassed}/${scenarioResponse.assertionsTotal} ASSERTIONS PASSED`}
        </span>
      </div>

      {isIdle ? (
        <div className="mt-3.5 p-6 rounded-lg bg-[#090d1f] border border-dashed border-[#1e2a4a] text-center space-y-2">
          <span className="text-2xl">⏳</span>
          <h4 className="text-sm font-bold text-slate-200">
            No Active Run in Memory (Cache Cleared / 0 Layers Executed)
          </h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Enter a prompt above or trigger a request from{" "}
            <strong className="text-emerald-400">Client View</strong> to stream
            the live mock data through all 18 canonical brain layers.
          </p>
        </div>
      ) : isRunning ? (
        <div className="mt-3.5 p-6 rounded-lg bg-[#090d1f] border border-dashed border-cyan-800/80 text-center space-y-3 animate-pulse">
          <div className="flex items-center justify-center gap-2 text-cyan-300 font-bold text-sm">
            <span className="size-2.5 rounded-full bg-cyan-400 animate-ping"></span>
            Pipeline Execution In Progress (Layer {simulatedMaxStep}/18)
          </div>
          <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed font-sans">
            AutoDo is currently executing through the brain layers. The final
            terminal outcome, verified assertions proof, and durable memory will
            be produced once all 18 layers complete.
          </p>
          <div className="h-2 w-full max-w-md mx-auto bg-slate-900 rounded-full overflow-hidden border border-cyan-900">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-500"
              style={{
                width: `${(replayProgress.completedCount / 18) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      ) : (
        <div className="mt-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
          {/* Column 1: Digest & Key Bullets */}
          <div className="rounded-lg bg-[#090d1f] p-3.5 border border-[#151c33]">
            <span className="text-xs font-bold text-slate-300 uppercase block mb-1.5">
              {scenarioResponse.summaryTitle}
            </span>
            <ul className="list-disc pl-4 text-slate-200 space-y-1 text-xs sm:text-[13px] mt-1 leading-relaxed">
              {scenarioResponse.bulletPoints.map((bullet, idx) => (
                <li key={idx}>{bullet}</li>
              ))}
            </ul>
          </div>

          {/* Column 2: Execution & Governance */}
          <div className="rounded-lg bg-[#090d1f] p-3.5 border border-[#151c33] font-mono text-xs text-slate-300 space-y-1.5">
            <span className="font-bold text-slate-300 uppercase block mb-1.5">
              Execution &amp; Governance
            </span>
            <div className="flex justify-between">
              <span>Run ID:</span>
              <span className="text-white font-semibold">
                {scenarioMetadata.runId}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Lease Token:</span>
              <span className="text-indigo-300 font-semibold truncate max-w-32">
                {scenarioMetadata.activeLease}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Verification:</span>
              <span className="text-emerald-400 font-bold">
                {scenarioResponse.assertionsPassed} /{" "}
                {scenarioResponse.assertionsTotal} PASSED
              </span>
            </div>
            <div className="flex justify-between">
              <span>Total Latency:</span>
              <span className="text-slate-200">
                {scenarioResponse.durationMs}ms
              </span>
            </div>
            <div className="flex justify-between">
              <span>Total Cost:</span>
              <span className="text-slate-200">
                ${scenarioResponse.costUsd.toFixed(4)} USD
              </span>
            </div>
          </div>

          {/* Column 3: Terminal Summary */}
          <div className="rounded-lg bg-[#090d1f] p-3.5 border border-[#151c33] font-mono text-xs text-slate-300 space-y-2">
            <span className="font-bold text-slate-300 uppercase block mb-1.5">
              Terminal Outcome Digest
            </span>
            <p className="text-slate-100 font-sans leading-relaxed text-xs sm:text-[13px]">
              {scenarioResponse.terminalDigest}
            </p>
            <div className="pt-2 border-t border-[#12182d] flex justify-between text-slate-400 text-xs">
              <span>Trace Correlation:</span>
              <span className="text-indigo-300 font-semibold">
                {scenarioMetadata.traceId}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
