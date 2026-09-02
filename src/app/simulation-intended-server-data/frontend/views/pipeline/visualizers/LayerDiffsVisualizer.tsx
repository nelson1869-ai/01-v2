"use client";

import React from "react";
import type { PipelineStep } from "../../../../contracts";
import { getReplayProgress } from "../../../utils/replayProgress";

interface LayerDiffsVisualizerProps {
  pipelineSteps: readonly PipelineStep[];
  simulatedMaxStep: number;
  selectedLayerId: number;
  setSelectedLayerId: (id: number) => void;
  isPlayingReplay: boolean;
}

export function LayerDiffsVisualizer({
  pipelineSteps,
  simulatedMaxStep,
  selectedLayerId,
  setSelectedLayerId,
  isPlayingReplay,
}: LayerDiffsVisualizerProps) {
  const replayProgress = getReplayProgress(
    simulatedMaxStep,
    isPlayingReplay,
  );
  return (
    <div className="flex flex-col gap-2 font-mono text-xs max-h-80 overflow-y-auto">
      {pipelineSteps.map((step) => {
        const isRunning = isPlayingReplay && step.id === simulatedMaxStep;
        const isCompleted = step.id <= replayProgress.completedThrough;

        return (
          <div
            key={step.id}
            onClick={() => setSelectedLayerId(step.id)}
            className={`p-3 rounded border cursor-pointer transition ${
              isRunning
                ? "border-cyan-400 bg-[#0d1738] shadow-md shadow-cyan-950/60 animate-pulse"
                : selectedLayerId === step.id
                  ? "border-indigo-500 bg-[#10172e]"
                  : isCompleted
                    ? "border-[#151c33] bg-[#090d1f]"
                    : "border-[#0d1222] bg-[#04060f] opacity-40"
            }`}
          >
            <div className="flex justify-between font-bold text-slate-100 pb-1.5 border-b border-[#12182d]">
              <span>
                Layer {step.id}: {step.name}
              </span>
              <span className="text-indigo-400 font-semibold">
                {step.inputContract} → {step.outputContract}
              </span>
            </div>
            <div className="mt-2 space-y-1">
              {isCompleted ? (
                step.contractDiff.map((diff, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-emerald-400 text-xs"
                  >
                    <span className="font-bold">
                      + [{diff.type}] {diff.field}:
                    </span>
                    <span className="text-slate-200">{diff.outputValue}</span>
                    <span className="text-slate-400 italic">({diff.note})</span>
                  </div>
                ))
              ) : (
                <span className="text-slate-600 text-xs italic">
                  Waiting for preceding layer transformations...
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
