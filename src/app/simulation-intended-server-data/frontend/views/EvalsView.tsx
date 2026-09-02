"use client";

import React from "react";
import { EVAL_SCENARIOS } from "../../evaluations";
import { getReplayProgress } from "../utils/replayProgress";

interface EvalsViewProps {
  simulatedMaxStep?: number;
  isPlayingReplay?: boolean;
}

export function EvalsView({
  simulatedMaxStep = 18,
  isPlayingReplay = false,
}: EvalsViewProps) {
  const replayProgress = getReplayProgress(simulatedMaxStep, isPlayingReplay);
  const isVerified = replayProgress.completedThrough >= 15;
  const isCurrentlyVerifying = isPlayingReplay && simulatedMaxStep === 15;

  return (
    <div className="flex flex-col gap-4 text-xs">
      <div className="rounded-xl border border-[#151c33] bg-[#070a18] p-4">
        <div className="flex justify-between items-center pb-2 border-b border-[#12182d]">
          <h4 className="font-bold text-white text-sm">
            AutoDo Personal Evaluation &amp; Benchmark Lab (Layer 15)
          </h4>
          <span
            className={`font-mono text-[10px] px-2 py-0.5 rounded border ${
              isCurrentlyVerifying
                ? "bg-cyan-950 text-cyan-300 border-cyan-700 animate-pulse"
                : "text-emerald-400 border-transparent"
            }`}
          >
            {isCurrentlyVerifying
              ? "⚡ VERIFYING 6/6 ASSERTIONS (12s)..."
              : isVerified
                ? "BENCHMARKS: VERIFIED (100%)"
                : "BENCHMARKS: STANDBY"}
          </span>
        </div>

        {/* Live Verifying Banner */}
        {isCurrentlyVerifying && (
          <div className="mt-3 rounded-lg border border-cyan-500/70 bg-cyan-950/30 p-3.5 space-y-2 animate-pulse font-mono text-xs">
            <div className="flex items-center justify-between text-cyan-300 font-bold">
              <span className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-cyan-400 animate-ping"></span>
                Layer 15: Ground Truth &amp; Safety Assertions Verification
                (12s)
              </span>
              <span>6 Invariants Tested</span>
            </div>
            <p className="text-slate-200 text-xs font-sans">
              Comparing expected outcome vs observed Gmail/Calendar tool
              responses &bull; Checking recipient whitelist integrity &bull;
              Validating calendar hold range...
            </p>
          </div>
        )}

        {!isVerified ? (
          <div className="mt-3 p-8 rounded-lg bg-[#090d1f] border border-dashed border-[#1e2a4a] text-center space-y-2 font-sans">
            <span className="text-2xl font-mono">⏳</span>
            <h4 className="text-sm font-bold text-slate-200">
              No Verification Assertions Evaluated Yet (Layer 15 Not Reached)
            </h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              {simulatedMaxStep === 0
                ? "No active run in memory (Cache Cleared). Verification assertions run and check invariant benchmarks after Layer 15 executes."
                : `Currently at Layer ${simulatedMaxStep}/18. Verification benchmarks execute once reaching Layer 15.`}
            </p>
          </div>
        ) : (
          <div className="mt-3 space-y-3 font-mono text-[10px]">
            {EVAL_SCENARIOS.map((scen) => (
              <div
                key={scen.id}
                className="p-3.5 rounded bg-[#090d1f] border border-[#151c33] flex flex-col gap-1.5"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-xs">
                    {scen.name}
                  </span>
                  <span className="text-emerald-400 font-bold">
                    {scen.status}
                  </span>
                </div>
                <div className="text-slate-400">Dataset: {scen.dataset}</div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 pt-2 border-t border-[#12182d] text-slate-300">
                  <div>
                    Success Rate:{" "}
                    <strong className="text-emerald-400">
                      {scen.taskSuccessRate * 100}%
                    </strong>
                  </div>
                  <div>
                    Grounding:{" "}
                    <strong className="text-indigo-300">
                      {scen.groundingQuality * 100}%
                    </strong>
                  </div>
                  <div>
                    Verification:{" "}
                    <strong className="text-emerald-400">
                      {scen.verificationRate * 100}%
                    </strong>
                  </div>
                  <div>
                    Hallucination:{" "}
                    <strong className="text-slate-200">
                      {scen.hallucinationRate * 100}%
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
