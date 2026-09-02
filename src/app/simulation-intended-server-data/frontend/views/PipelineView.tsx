"use client";

import React from "react";
import type {
  LayerInspectorTab,
  PipelineStep,
  PipelineViewMode,
} from "../../contracts";
import type { ScenarioId } from "../../scenarios";

import { DirectPromptExecutionCard } from "./pipeline/DirectPromptExecutionCard";
import { PipelineStepList } from "./pipeline/PipelineStepList";
import { FlowVisualizer } from "./pipeline/visualizers/FlowVisualizer";
import { TimelineVisualizer } from "./pipeline/visualizers/TimelineVisualizer";
import { TraceTreeVisualizer } from "./pipeline/visualizers/TraceTreeVisualizer";
import { LayerDiffsVisualizer } from "./pipeline/visualizers/LayerDiffsVisualizer";
import { DeepLayerInspector } from "./pipeline/DeepLayerInspector";
import { TerminalFinalResultCard } from "./pipeline/TerminalFinalResultCard";

interface PipelineViewProps {
  pipelineSteps: readonly PipelineStep[];
  activeScenarioId: ScenarioId;
  setActiveScenarioId?: (id: ScenarioId) => void;
  scenarioTitle: string;
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
  selectedLayerId: number;
  setSelectedLayerId: (id: number) => void;
  expandedLayers: Record<number, boolean>;
  toggleLayerExpand: (id: number) => void;
  handleExpandAll: () => void;
  handleCollapseAll: () => void;
  layerInspectorTab: LayerInspectorTab;
  setLayerInspectorTab: (tab: LayerInspectorTab) => void;
  pipelineViewMode: PipelineViewMode;
  setPipelineViewMode: (mode: PipelineViewMode) => void;
  simulatedMaxStep: number;
  setSimulatedMaxStep: React.Dispatch<React.SetStateAction<number>>;
  isPlayingReplay?: boolean;
  setIsPlayingReplay: (playing: boolean) => void;
}

export function PipelineView({
  pipelineSteps,
  activeScenarioId,
  setActiveScenarioId,
  scenarioTitle,
  scenarioResponse,
  scenarioMetadata,
  selectedLayerId,
  setSelectedLayerId,
  expandedLayers,
  toggleLayerExpand,
  handleExpandAll,
  handleCollapseAll,
  layerInspectorTab,
  setLayerInspectorTab,
  pipelineViewMode,
  setPipelineViewMode,
  simulatedMaxStep,
  setSimulatedMaxStep,
  isPlayingReplay = false,
  setIsPlayingReplay,
}: PipelineViewProps) {
  const handleTriggerDirectRun = (promptText: string) => {
    const clean = promptText.trim();
    if (!clean) return;

    const lower = clean.toLowerCase();
    const isAsk2 =
      lower.includes("reply") ||
      lower.includes("john") ||
      lower.includes("acting as me") ||
      lower.includes("propose");

    if (setActiveScenarioId) {
      setActiveScenarioId(isAsk2 ? "ask-2" : "ask-1");
    }

    setSimulatedMaxStep(1);
    setSelectedLayerId(1);
    setIsPlayingReplay(true);
  };

  const activeLayer: PipelineStep =
    pipelineSteps.find((l) => l.id === selectedLayerId) || pipelineSteps[0];

  return (
    <div className="flex flex-col gap-4 text-xs">
      {/* 1. Interactive Direct Prompt Execution Bar */}
      <DirectPromptExecutionCard
        scenarioTitle={scenarioTitle}
        isPlayingReplay={isPlayingReplay}
        onTriggerDirectRun={handleTriggerDirectRun}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 text-xs">
        {/* 2. Left Column: 18-Layer Step List & Scrubber */}
        <PipelineStepList
          pipelineSteps={pipelineSteps}
          activeScenarioId={activeScenarioId}
          selectedLayerId={selectedLayerId}
          setSelectedLayerId={setSelectedLayerId}
          expandedLayers={expandedLayers}
          toggleLayerExpand={toggleLayerExpand}
          handleExpandAll={handleExpandAll}
          handleCollapseAll={handleCollapseAll}
          simulatedMaxStep={simulatedMaxStep}
          setSimulatedMaxStep={setSimulatedMaxStep}
          isPlayingReplay={isPlayingReplay}
          setIsPlayingReplay={setIsPlayingReplay}
        />

        {/* 3. Right Column: Visualizer Modes + Deep Layer Inspector + Terminal Result */}
        <div className="flex flex-col gap-4 lg:col-span-9">
          {/* Top Bar: Visualizer Mode Selector */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#151c33] bg-[#070a18] p-3">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider pl-2">
                Visualizer:
              </span>
              <div className="flex rounded-lg bg-[#090d1f] p-1 border border-[#151c33] text-xs font-medium">
                <button
                  onClick={() => setPipelineViewMode("flow")}
                  className={`px-3 py-1.5 rounded-md transition cursor-pointer text-xs font-semibold ${
                    pipelineViewMode === "flow"
                      ? "bg-indigo-600 text-white shadow"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  🔀 Flow
                </button>
                <button
                  onClick={() => setPipelineViewMode("timeline")}
                  className={`px-3 py-1.5 rounded-md transition cursor-pointer text-xs font-semibold ${
                    pipelineViewMode === "timeline"
                      ? "bg-indigo-600 text-white shadow"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  ⏱ Timeline
                </button>
                <button
                  onClick={() => setPipelineViewMode("trace")}
                  className={`px-3 py-1.5 rounded-md transition cursor-pointer text-xs font-semibold ${
                    pipelineViewMode === "trace"
                      ? "bg-indigo-600 text-white shadow"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  🌲 Trace Tree
                </button>
                <button
                  onClick={() => setPipelineViewMode("diff")}
                  className={`px-3 py-1.5 rounded-md transition cursor-pointer text-xs font-semibold ${
                    pipelineViewMode === "diff"
                      ? "bg-indigo-600 text-white shadow"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  📑 Layer Diffs
                </button>
              </div>
            </div>

            <span className="text-xs text-slate-300 font-mono pr-2">
              Selected:{" "}
              <strong className="text-indigo-300 font-semibold text-sm">
                Layer {activeLayer.id} ({activeLayer.name})
              </strong>
            </span>
          </div>

          {/* Dynamic Visualizer Body */}
          <div className="rounded-xl border border-[#151c33] bg-[#070a18] p-4">
            {pipelineViewMode === "flow" && (
              <FlowVisualizer
                pipelineSteps={pipelineSteps}
                scenarioTitle={scenarioTitle}
                simulatedMaxStep={simulatedMaxStep}
                selectedLayerId={selectedLayerId}
                setSelectedLayerId={setSelectedLayerId}
                isPlayingReplay={isPlayingReplay}
              />
            )}

            {pipelineViewMode === "timeline" && (
              <TimelineVisualizer
                pipelineSteps={pipelineSteps}
                scenarioTitle={scenarioTitle}
                simulatedMaxStep={simulatedMaxStep}
                selectedLayerId={selectedLayerId}
                setSelectedLayerId={setSelectedLayerId}
                isPlayingReplay={isPlayingReplay}
              />
            )}

            {pipelineViewMode === "trace" && (
              <TraceTreeVisualizer
                pipelineSteps={pipelineSteps}
                traceId={scenarioMetadata.traceId}
                simulatedMaxStep={simulatedMaxStep}
                selectedLayerId={selectedLayerId}
                setSelectedLayerId={setSelectedLayerId}
                isPlayingReplay={isPlayingReplay}
              />
            )}

            {pipelineViewMode === "diff" && (
              <LayerDiffsVisualizer
                pipelineSteps={pipelineSteps}
                simulatedMaxStep={simulatedMaxStep}
                selectedLayerId={selectedLayerId}
                setSelectedLayerId={setSelectedLayerId}
                isPlayingReplay={isPlayingReplay}
              />
            )}
          </div>

          {/* 4. Deep Layer Inspector (8 Tabs) */}
          <DeepLayerInspector
            activeLayer={activeLayer}
            layerInspectorTab={layerInspectorTab}
            setLayerInspectorTab={setLayerInspectorTab}
            simulatedMaxStep={simulatedMaxStep}
          />

          {/* 5. Terminal Final Result Outcome Card */}
          <TerminalFinalResultCard
            scenarioResponse={scenarioResponse}
            scenarioMetadata={scenarioMetadata}
            simulatedMaxStep={simulatedMaxStep}
            isPlayingReplay={isPlayingReplay}
          />
        </div>
      </div>
    </div>
  );
}
