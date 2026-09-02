"use client";

import React from "react";
import { RAW_JSON_OUTPUT } from "../../run";
import { getReplayProgress } from "../utils/replayProgress";

interface RawStateViewProps {
  copiedId: string | null;
  copyToClipboard: (text: string, id: string) => Promise<void>;
  rawJson?: string;
  simulatedMaxStep?: number;
}

export function RawStateView({
  copiedId,
  copyToClipboard,
  rawJson = RAW_JSON_OUTPUT,
  simulatedMaxStep = 18,
}: RawStateViewProps) {
  const replayProgress = getReplayProgress(
    simulatedMaxStep,
    simulatedMaxStep > 0 && simulatedMaxStep < 18,
  );
  const isIdle = replayProgress.isIdle;
  const isRunning = !isIdle && !replayProgress.isComplete;
  const displayJson = isIdle
    ? JSON.stringify(
        {
          status: "IDLE",
          layersExecuted: 0,
          totalLayers: 18,
          activeScenario: null,
          memoryState: "CLEARED",
          message:
            "No active run in memory (Cache Cleared). Enter a prompt from Client View or trigger a run to serialize full execution state.",
        },
        null,
        2,
      )
    : isRunning
      ? JSON.stringify(
          {
            status: "EXECUTING_IN_PROGRESS",
            currentLayer: simulatedMaxStep,
            layersExecuted: replayProgress.completedCount,
            totalLayers: 18,
            progressPercentage: `${Math.round((replayProgress.completedCount / 18) * 100)}%`,
            message: `Pipeline is at Layer ${simulatedMaxStep}/18 with ${replayProgress.completedCount} completed layers.`,
            partialState: JSON.parse(rawJson),
          },
          null,
          2,
        )
      : rawJson;

  return (
    <div className="flex flex-col gap-4 text-xs">
      <div className="rounded-xl border border-[#151c33] bg-[#070a18] p-4">
        <div className="flex justify-between items-center pb-2 border-b border-[#12182d]">
          <h4 className="font-bold text-white text-sm">
            Full Safe Serialized Run State (JSON)
          </h4>
          <button
            onClick={() => copyToClipboard(displayJson, "raw_view")}
            className="rounded bg-indigo-600 px-3 py-1 font-bold text-white cursor-pointer hover:bg-indigo-500 transition"
          >
            {copiedId === "raw_view"
              ? "Copied! ✓"
              : copiedId === "raw_view:error"
                ? "Copy failed"
                : "Copy JSON"}
          </button>
        </div>
        <pre className="mt-3 max-h-[550px] overflow-auto rounded bg-[#03050c] p-3 font-mono text-[11px] text-indigo-300 border border-[#151c33]">
          <code>{displayJson}</code>
        </pre>
      </div>
    </div>
  );
}
