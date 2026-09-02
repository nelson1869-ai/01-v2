"use client";

import React from "react";
import type { PipelineStep } from "../../../../contracts";
import { getReplayProgress } from "../../../utils/replayProgress";

interface TimelineVisualizerProps {
  pipelineSteps: readonly PipelineStep[];
  scenarioTitle: string;
  simulatedMaxStep: number;
  selectedLayerId: number;
  setSelectedLayerId: (id: number) => void;
  isPlayingReplay: boolean;
}

export function TimelineVisualizer({
  pipelineSteps,
  scenarioTitle,
  simulatedMaxStep,
  selectedLayerId,
  setSelectedLayerId,
  isPlayingReplay,
}: TimelineVisualizerProps) {
  const replayProgress = getReplayProgress(
    simulatedMaxStep,
    isPlayingReplay,
  );
  const total = pipelineSteps.reduce((acc, s) => acc + s.durationMs, 0);
  const elapsed = pipelineSteps
    .filter((s) => s.id <= replayProgress.completedThrough)
    .reduce((acc, s) => acc + s.durationMs, 0);

  return (
    <div className="flex flex-col gap-2 font-mono text-xs">
      <div className="flex justify-between items-center text-slate-300 pb-2 border-b border-[#12182d] font-semibold">
        <div className="flex items-center gap-2">
          <span>LAYER DURATION WATERFALL ({scenarioTitle})</span>
          {isPlayingReplay && (
            <span className="flex items-center gap-1 text-cyan-400 text-[10px] animate-pulse">
              <span className="size-1.5 rounded-full bg-cyan-400"></span>
              LIVE MEASURING
            </span>
          )}
        </div>
        <span className="text-indigo-300">
          Elapsed: {elapsed}ms / {total}ms
        </span>
      </div>
      {pipelineSteps.map((step) => {
        const isRunning = isPlayingReplay && step.id === simulatedMaxStep;
        const isCompleted = step.id <= replayProgress.completedThrough;
        const widthPct = Math.max(
          4,
          Math.round((step.durationMs / total) * 100),
        );

        return (
          <div
            key={step.id}
            onClick={() => setSelectedLayerId(step.id)}
            className={`flex items-center justify-between p-1.5 rounded cursor-pointer transition ${
              isRunning
                ? "bg-[#0d1738] border border-cyan-500/70"
                : selectedLayerId === step.id
                  ? "bg-[#10172e] border border-indigo-500/50"
                  : "hover:bg-[#090d1f]"
            }`}
          >
            <span
              className={`w-56 truncate text-xs flex items-center gap-1.5 ${
                isRunning
                  ? "text-cyan-300 font-bold"
                  : isCompleted
                    ? "text-slate-200"
                    : "text-slate-600"
              }`}
            >
              <span>
                {isRunning ? "✦" : isCompleted ? "✔" : "⏳"} Layer {step.id}:{" "}
                {step.name}
              </span>
            </span>

            <div className="flex-1 px-4">
              <div className="h-4 rounded bg-[#03050c] overflow-hidden flex items-center border border-[#12182d]">
                {isCompleted || isRunning ? (
                  <div
                    className={`h-full rounded text-[8px] font-bold text-white flex items-center justify-end pr-1.5 transition-all duration-300 ${
                      isRunning
                        ? "bg-gradient-to-r from-cyan-500 to-indigo-500 animate-pulse shadow-md shadow-cyan-500"
                        : step.isCriticalPath
                          ? "bg-amber-600"
                          : "bg-indigo-600"
                    }`}
                    style={{ width: `${widthPct}%` }}
                  >
                    {step.durationMs > 25 && `${step.durationMs}ms`}
                  </div>
                ) : (
                  <div className="h-full w-full bg-[#050711] text-[8px] font-mono text-slate-600 flex items-center px-2 italic">
                    waiting in pipeline queue...
                  </div>
                )}
              </div>
            </div>

            <span
              className={`w-20 text-right font-mono text-xs ${
                isRunning
                  ? "text-cyan-400 font-bold"
                  : isCompleted
                    ? "text-slate-300"
                    : "text-slate-600"
              }`}
            >
              {isRunning
                ? "Running"
                : isCompleted
                  ? `${step.durationMs}ms`
                  : "Queued"}
            </span>
          </div>
        );
      })}
    </div>
  );
}
