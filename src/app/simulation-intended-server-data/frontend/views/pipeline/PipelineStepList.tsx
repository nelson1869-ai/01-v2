"use client";

import React from "react";
import type { PipelineStep } from "../../../contracts";
import type { ScenarioId } from "../../../scenarios";
import { getReplayProgress } from "../../utils/replayProgress";

interface PipelineStepListProps {
  pipelineSteps: readonly PipelineStep[];
  activeScenarioId: ScenarioId;
  selectedLayerId: number;
  setSelectedLayerId: (id: number) => void;
  expandedLayers: Record<number, boolean>;
  toggleLayerExpand: (id: number) => void;
  handleExpandAll: () => void;
  handleCollapseAll: () => void;
  simulatedMaxStep: number;
  setSimulatedMaxStep: React.Dispatch<React.SetStateAction<number>>;
  isPlayingReplay: boolean;
  setIsPlayingReplay: (playing: boolean) => void;
}

export function PipelineStepList({
  pipelineSteps,
  activeScenarioId,
  selectedLayerId,
  setSelectedLayerId,
  expandedLayers,
  toggleLayerExpand,
  handleExpandAll,
  handleCollapseAll,
  simulatedMaxStep,
  setSimulatedMaxStep,
  isPlayingReplay,
  setIsPlayingReplay,
}: PipelineStepListProps) {
  const replayProgress = getReplayProgress(
    simulatedMaxStep,
    isPlayingReplay,
  );
  return (
    <div className="flex flex-col rounded-xl border border-[#151c33] bg-[#070a18] p-4 lg:col-span-3">
      <div className="flex items-center justify-between pb-3 border-b border-[#12182d]">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
          PIPELINE (18-LAYER BRAIN)
        </h3>
        <span className="text-xs font-bold font-mono text-indigo-300">
          {activeScenarioId === "ask-2" ? "✉️ Auto-Reply" : "📥 Digest"}
        </span>
      </div>

      {/* Step-through Scrubber (0 to 18) */}
      <div className="mt-3 flex flex-col gap-2 bg-[#090d1f] p-3 rounded-lg border border-[#151c33]">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300 font-semibold">Step Scrubber</span>
          <span
            className={
              simulatedMaxStep === 0
                ? "text-slate-400 font-bold"
                : "text-indigo-400 font-bold"
            }
          >
            {simulatedMaxStep === 0
              ? "0 / 18 (Idle / Cleared)"
              : replayProgress.isComplete
                ? "18 / 18 complete"
                : `L${simulatedMaxStep} current · ${replayProgress.completedCount} complete`}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={18}
          value={simulatedMaxStep}
          onChange={(e) => {
            const val = Number(e.target.value);
            setSimulatedMaxStep(val);
            if (val > 0) {
              setSelectedLayerId(val);
            }
            setIsPlayingReplay(false);
          }}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
      </div>

      {/* Expand / Collapse All */}
      <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400 pb-1.5 border-b border-[#12182d]">
        <span>Layers (1 to 18)</span>
        <div className="flex gap-2">
          <button
            onClick={handleExpandAll}
            className="text-indigo-400 font-medium hover:underline cursor-pointer"
          >
            Expand All
          </button>
          <span>•</span>
          <button
            onClick={handleCollapseAll}
            className="text-slate-400 hover:underline cursor-pointer"
          >
            Collapse
          </button>
        </div>
      </div>

      {/* 18 Steps Scroll List with Realistic Step Status */}
      <div className="mt-2.5 flex flex-col gap-1.5 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
        {pipelineSteps.map((step) => {
          const isCurrentlyRunning =
            isPlayingReplay && step.id === simulatedMaxStep;
          const isCompleted = step.id <= replayProgress.completedThrough;
          const isSelected = step.id === selectedLayerId;
          const isExpanded = expandedLayers[step.id];

          return (
            <div
              key={step.id}
              className={`rounded-lg border transition-all ${
                isCurrentlyRunning
                  ? "border-cyan-400 bg-[#0d1738] shadow-lg shadow-cyan-950/60 animate-pulse"
                  : isSelected
                    ? "border-indigo-500 bg-[#0e1428] shadow-md shadow-indigo-950/40"
                    : isCompleted
                      ? "border-[#151c33] bg-[#090d1f] hover:border-slate-700"
                      : "border-[#0d1222] bg-[#04060f] opacity-40"
              }`}
            >
              <div
                onClick={() => {
                  setSelectedLayerId(step.id);
                  if (step.id > simulatedMaxStep) {
                    setSimulatedMaxStep(step.id);
                  }
                }}
                className="flex items-center justify-between p-2.5 cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold font-mono ${
                      isCurrentlyRunning
                        ? "bg-cyan-500 text-slate-950 font-black animate-spin"
                        : isSelected
                          ? "bg-indigo-600 text-white"
                          : isCompleted
                            ? "bg-slate-800 text-slate-200"
                            : "bg-slate-900 text-slate-600"
                    }`}
                  >
                    {isCurrentlyRunning ? "✦" : step.id}
                  </span>
                  <div className="truncate">
                    <div className="text-xs sm:text-[13px] font-semibold text-slate-100 truncate flex items-center gap-1.5">
                      <span>{step.name}</span>
                      {isCurrentlyRunning && (
                        <span className="rounded bg-cyan-950 px-1 py-0.2 text-[8px] font-bold text-cyan-300 border border-cyan-800">
                          RUNNING
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono truncate">
                      {step.durationMs}ms · {step.provenance}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {isCurrentlyRunning ? (
                    <span className="size-2 rounded-full bg-cyan-400 animate-ping"></span>
                  ) : isCompleted ? (
                    <span className="text-emerald-400 font-bold text-xs">
                      ✔
                    </span>
                  ) : (
                    <span className="text-slate-600 text-[10px] font-mono">
                      WAIT
                    </span>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLayerExpand(step.id);
                    }}
                    className="text-xs text-slate-400 hover:text-slate-200 p-1 cursor-pointer"
                  >
                    {isExpanded ? "▼" : "▶"}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="px-3 pb-2.5 text-xs text-slate-300 border-t border-[#12182d] pt-2 space-y-1">
                  <p className="line-clamp-2 leading-relaxed">
                    {step.responsibility}
                  </p>
                  <div className="flex justify-between font-mono text-[10px] text-slate-400 pt-1">
                    <span>
                      Status: {isCurrentlyRunning ? "RUNNING" : step.status}
                    </span>
                    <span>Span: {step.spanId}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
