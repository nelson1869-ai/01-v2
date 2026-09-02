"use client";

import React from "react";
import type { PipelineStep } from "../../../../contracts";
import { getReplayProgress } from "../../../utils/replayProgress";

interface FlowVisualizerProps {
  pipelineSteps: readonly PipelineStep[];
  scenarioTitle: string;
  simulatedMaxStep: number;
  selectedLayerId: number;
  setSelectedLayerId: (id: number) => void;
  isPlayingReplay: boolean;
}

export function FlowVisualizer({
  pipelineSteps,
  scenarioTitle,
  simulatedMaxStep,
  selectedLayerId,
  setSelectedLayerId,
  isPlayingReplay,
}: FlowVisualizerProps) {
  const replayProgress = getReplayProgress(
    simulatedMaxStep,
    isPlayingReplay,
  );
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-xs text-slate-300 border-b border-[#12182d] pb-2 font-mono">
        <span>18-LAYER CANONICAL DATA FLOW — {scenarioTitle}</span>
        <span className="font-mono text-emerald-400 font-semibold">
          ● {replayProgress.completedCount}/18 Complete
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-6 font-mono text-xs">
        {pipelineSteps.map((step) => {
          const isRunning = isPlayingReplay && step.id === simulatedMaxStep;
          const isSelected = step.id === selectedLayerId;
          const isPassed = step.id <= replayProgress.completedThrough;

          return (
            <div
              key={step.id}
              onClick={() => setSelectedLayerId(step.id)}
              className={`p-2.5 rounded-lg border flex flex-col justify-between cursor-pointer transition ${
                isRunning
                  ? "border-cyan-400 bg-[#0d1738] text-white font-bold animate-pulse shadow-md"
                  : isSelected
                    ? "border-indigo-500 bg-[#10172e] text-white font-bold"
                    : isPassed
                      ? "border-[#151c33] bg-[#090d1f] text-slate-300 hover:border-slate-600"
                      : "border-[#0d1222] bg-[#04060f] text-slate-600 opacity-50"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-indigo-400 font-bold text-xs">
                  {step.id}
                </span>
                <span className="text-[10px] text-slate-400">
                  {step.durationMs}ms
                </span>
              </div>
              <div className="truncate my-1.5 text-slate-100 text-[11px] font-semibold">
                {step.name}
              </div>
              <div className="text-[9px] text-slate-400 truncate flex justify-between items-center">
                <span>{step.provenance}</span>
                {isRunning ? (
                  <span className="text-cyan-400 font-bold">●</span>
                ) : isPassed ? (
                  <span className="text-emerald-400">✔</span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
