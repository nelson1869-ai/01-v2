"use client";

import React from "react";
import type { PipelineStep } from "../../../../contracts";
import { getReplayProgress } from "../../../utils/replayProgress";

interface TraceTreeVisualizerProps {
  pipelineSteps: readonly PipelineStep[];
  traceId: string;
  simulatedMaxStep: number;
  selectedLayerId: number;
  setSelectedLayerId: (id: number) => void;
  isPlayingReplay: boolean;
}

export function TraceTreeVisualizer({
  pipelineSteps,
  traceId,
  simulatedMaxStep,
  selectedLayerId,
  setSelectedLayerId,
  isPlayingReplay,
}: TraceTreeVisualizerProps) {
  const replayProgress = getReplayProgress(
    simulatedMaxStep,
    isPlayingReplay,
  );
  return (
    <div className="flex flex-col gap-2 font-mono text-xs">
      <div className="flex justify-between items-center text-slate-300 pb-1.5 border-b border-[#12182d]">
        <div className="flex items-center gap-2">
          <span className="font-semibold">
            SIMULATED DISTRIBUTED TRACE TREE (18 SPANS)
          </span>
          {isPlayingReplay && (
            <span className="rounded bg-cyan-950 px-1.5 py-0.2 text-[8px] font-bold text-cyan-300 border border-cyan-800 animate-pulse">
              TRACING SPAN {simulatedMaxStep}/18
            </span>
          )}
        </div>
        <span className="text-indigo-300">Trace: {traceId}</span>
      </div>
      <div className="bg-[#03050c] p-3 rounded-lg border border-[#151c33] max-h-72 overflow-y-auto space-y-1.5">
        {pipelineSteps.map((step, idx) => {
          const isRunning = isPlayingReplay && step.id === simulatedMaxStep;
          const isCompleted = step.id <= replayProgress.completedThrough;

          return (
            <div
              key={step.id}
              onClick={() => setSelectedLayerId(step.id)}
              className={`flex justify-between pl-6 p-1.5 rounded cursor-pointer transition ${
                isRunning
                  ? "bg-[#0d1738] text-cyan-300 font-bold border border-cyan-500/60 animate-pulse"
                  : selectedLayerId === step.id
                    ? "bg-[#10172e] text-white font-bold"
                    : isCompleted
                      ? "text-slate-300 hover:bg-[#0e1428]"
                      : "text-slate-600 opacity-50"
              }`}
            >
              <span>
                {idx === 17 ? "└──" : "├──"} Layer {step.id}: {step.name} (
                {step.spanId})
              </span>
              <span>
                {isRunning ? (
                  <span className="text-cyan-400">RUNNING...</span>
                ) : isCompleted ? (
                  <span className="text-slate-400">{step.durationMs}ms</span>
                ) : (
                  <span className="text-slate-600">WAIT</span>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
