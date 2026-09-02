"use client";

import React from "react";
import Link from "next/link";
import type { LayerInspectorTab, PrimaryNav } from "../../contracts";
import type { ScenarioId } from "../../scenarios";
import { RAW_JSON_OUTPUT } from "../../run";
import { broadcastRunState } from "../utils/runSync";
import { getReplayProgress } from "../utils/replayProgress";

export type ExecutionSpeedMode =
  | "instant"
  | "fast"
  | "balanced"
  | "realtime"
  | "custom";

interface HeaderProps {
  setPrimaryNav: (nav: PrimaryNav) => void;
  developerMode: boolean;
  setDeveloperMode: React.Dispatch<React.SetStateAction<boolean>>;
  setLayerInspectorTab: (tab: LayerInspectorTab) => void;
  simulatedMaxStep: number;
  setSimulatedMaxStep: React.Dispatch<React.SetStateAction<number>>;
  setSelectedLayerId: (id: number) => void;
  isPlayingReplay: boolean;
  setIsPlayingReplay: (playing: boolean) => void;
  executionSpeed?: ExecutionSpeedMode;
  setExecutionSpeed?: React.Dispatch<React.SetStateAction<ExecutionSpeedMode>>;
  customDelaySeconds?: number;
  setCustomDelaySeconds?: React.Dispatch<React.SetStateAction<number>>;
  copiedId: string | null;
  copyToClipboard: (text: string, id: string) => Promise<void>;
  activeScenarioId: ScenarioId;
  setActiveScenarioId: (id: ScenarioId) => void;
  runMetadata: {
    runId: string;
    goal: string;
    status: string;
    traceId: string;
    duration: string;
    mode: string;
    estimatedCostUsd: number;
    tokenUsage: { total: number };
  };
}

export function Header({
  setPrimaryNav,
  developerMode,
  setDeveloperMode,
  setLayerInspectorTab,
  simulatedMaxStep,
  setSimulatedMaxStep,
  setSelectedLayerId,
  isPlayingReplay,
  setIsPlayingReplay,
  executionSpeed = "realtime",
  setExecutionSpeed,
  customDelaySeconds = 5,
  setCustomDelaySeconds,
  copiedId,
  copyToClipboard,
  runMetadata,
}: HeaderProps) {
  const replayProgress = getReplayProgress(simulatedMaxStep, isPlayingReplay);

  return (
    <header className="flex flex-col gap-3 border-b border-[#151c33] bg-[#070a18]/90 px-4 py-3 sm:px-6 sm:py-3.5 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>AutoDo Personal Lab &gt; Simulated Replay /</span>
            <span className="text-slate-200 font-semibold">
              {runMetadata.runId}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2.5">
            <h2 className="text-lg font-bold text-white sm:text-xl flex items-center gap-2">
              {runMetadata.runId}
              <button
                onClick={() => copyToClipboard(runMetadata.runId, "hdr_runId")}
                title="Copy Run ID"
                className="text-sm text-slate-400 hover:text-white cursor-pointer transition"
              >
                {copiedId === "hdr_runId"
                  ? "✓"
                  : copiedId === "hdr_runId:error"
                    ? "!"
                    : "📋"}
              </button>
            </h2>
            <span
              className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-bold font-mono ${
                replayProgress.isIdle
                  ? "border-slate-800 bg-slate-900 text-slate-400"
                  : replayProgress.isComplete
                    ? "border-emerald-800/80 bg-emerald-950/80 text-emerald-400"
                    : replayProgress.isPaused
                      ? "border-amber-800 bg-amber-950 text-amber-300"
                      : "border-cyan-800 bg-cyan-950 text-cyan-300 animate-pulse"
              }`}
            >
              {replayProgress.isIdle
                ? "⏳ IDLE (0/18 LAYERS)"
                : replayProgress.isComplete
                  ? `✔ ${runMetadata.status.toUpperCase()} (18/18)`
                  : replayProgress.isPaused
                    ? `⏸ PAUSED (L${simulatedMaxStep}/18)`
                    : `⚡ RUNNING (L${simulatedMaxStep}/18 · ${replayProgress.completedCount} COMPLETE)`}
            </span>
            <span className="rounded-md bg-indigo-950/90 px-2.5 py-1 text-xs font-bold text-indigo-300 border border-indigo-800/50 font-mono">
              Trace: {runMetadata.traceId}
            </span>
            <span className="rounded-md bg-slate-800 px-2.5 py-1 text-xs font-mono text-slate-300">
              Mode: {runMetadata.mode}
            </span>
          </div>
        </div>

        {/* Live AI Engine Controls & Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Live AI Engine Badge */}
          <div className="flex items-center gap-2 rounded-lg border border-indigo-900/60 bg-[#090d1f] px-3 py-1.5 text-xs font-semibold text-indigo-300">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>⚡ Live AI Engine</span>
          </div>

          {/* Simulated replay speed selector */}
          {setExecutionSpeed && (
            <div className="flex flex-wrap items-center rounded-lg border border-[#202c52] bg-[#090d1f] p-0.5 text-xs font-semibold gap-0.5">
              <button
                onClick={() => setExecutionSpeed("fast")}
                title="Fast execution (1 second per layer)"
                className={`flex items-center gap-1 rounded-md px-2 py-1 transition cursor-pointer text-[11px] font-semibold ${
                  executionSpeed === "fast"
                    ? "bg-indigo-600 text-white shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>⚡</span> Replay 1s/layer
              </button>
              <button
                onClick={() => setExecutionSpeed("balanced")}
                title="Balanced execution (3 seconds per layer)"
                className={`flex items-center gap-1 rounded-md px-2 py-1 transition cursor-pointer text-[11px] font-semibold ${
                  executionSpeed === "balanced"
                    ? "bg-indigo-600 text-white shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>⏱️</span> Replay 3s/layer
              </button>
              <button
                onClick={() => setExecutionSpeed("realtime")}
                title="Simulated replay delay of 10 to 20 seconds per layer"
                className={`flex items-center gap-1 rounded-md px-2 py-1 transition cursor-pointer text-[11px] font-semibold ${
                  executionSpeed === "realtime"
                    ? "bg-indigo-600 text-white shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>⏳</span> Replay 10-20s/layer
              </button>
              <button
                onClick={() => setExecutionSpeed("custom")}
                title="Custom simulated replay delay per layer"
                className={`flex items-center gap-1 rounded-md px-2 py-1 transition cursor-pointer text-[11px] font-semibold ${
                  executionSpeed === "custom"
                    ? "bg-indigo-600 text-white shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>⚙️</span> Custom replay
              </button>
            </div>
          )}

          {/* Custom Waiting Delay Slider */}
          {executionSpeed === "custom" && setCustomDelaySeconds && (
            <div className="flex items-center gap-2 rounded-lg border border-indigo-500/60 bg-[#090d1f] px-2.5 py-1 text-xs text-indigo-200 font-mono">
              <span className="text-[10px] text-slate-400">Delay:</span>
              <input
                type="range"
                min="0.5"
                max="30"
                step="0.5"
                value={customDelaySeconds}
                onChange={(e) =>
                  setCustomDelaySeconds(parseFloat(e.target.value))
                }
                className="w-20 accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <span className="text-[11px] font-bold text-white min-w-9">
                {customDelaySeconds}s
              </span>
            </div>
          )}

          {/* Pause / Resume Control */}
          <button
            onClick={() => {
              if (simulatedMaxStep === 0) {
                setSimulatedMaxStep(1);
                setSelectedLayerId(1);
                setIsPlayingReplay(true);
                setPrimaryNav("pipeline");
                return;
              }
              setIsPlayingReplay(!isPlayingReplay);
            }}
            disabled={replayProgress.isComplete}
            title={
              isPlayingReplay
                ? "Pause layer execution timer"
                : "Resume layer execution timer"
            }
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition cursor-pointer border disabled:cursor-not-allowed disabled:opacity-40 ${
              isPlayingReplay
                ? "border-amber-700/60 bg-amber-950/40 text-amber-300 hover:bg-amber-900/50"
                : "border-emerald-700/60 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/50"
            }`}
          >
            <span>{isPlayingReplay ? "⏸ Pause" : "▶ Resume"}</span>
          </button>

          {/* Step Forward (Next Layer) Button */}
          <button
            onClick={() => {
              if (simulatedMaxStep < 18) {
                const next = simulatedMaxStep + 1;
                setSimulatedMaxStep(next);
                setSelectedLayerId(next);
                setPrimaryNav("pipeline");
              }
            }}
            disabled={simulatedMaxStep >= 18}
            title="Immediately advance to next layer"
            className="flex items-center gap-1 rounded-lg border border-[#202c52] bg-[#090d1f] px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-[#111730] transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>⏭</span> Next
          </button>

          <button
            onClick={() => {
              setSimulatedMaxStep(1);
              setSelectedLayerId(1);
              setIsPlayingReplay(true);
              setPrimaryNav("pipeline");
            }}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 transition cursor-pointer"
          >
            <span>🔄</span> Replay
          </button>
          <Link
            href="/client"
            className="flex items-center gap-1.5 rounded-lg border border-emerald-800/60 bg-emerald-950/40 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/50 transition cursor-pointer"
          >
            <span>💬</span> Client View
          </Link>
          <button
            onClick={() => {
              try {
                if (typeof window !== "undefined") {
                  window.localStorage.clear();
                  window.sessionStorage.clear();
                }
              } catch {
                // ignore
              }
              setSimulatedMaxStep(0);
              setSelectedLayerId(1);
              setIsPlayingReplay(false);
              copyToClipboard("ALL_CACHE_CLEARED", "hdr_cache_cleared");
              broadcastRunState({
                type: "CLEAR_CACHE",
                simulatedMaxStep: 0,
                isPlayingReplay: false,
              });
            }}
            title="Purge localStorage, sessionStorage, and reset pipeline state to zero"
            className="flex items-center gap-1.5 rounded-lg border border-rose-900/60 bg-rose-950/30 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-900/50 transition cursor-pointer"
          >
            <span>🧹</span>{" "}
            {copiedId === "hdr_cache_cleared"
              ? "Cache Cleared! (0/18) ✓"
              : "Clear Cache"}
          </button>
          <button
            onClick={() => setPrimaryNav("raw")}
            className="flex items-center gap-1.5 rounded-lg border border-[#151c33] bg-[#090d1f] px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-[#111730] transition cursor-pointer"
          >
            <span>💻</span> JSON
          </button>
          <button
            onClick={() => copyToClipboard(RAW_JSON_OUTPUT, "share_json")}
            className="flex items-center gap-1.5 rounded-lg border border-[#151c33] bg-[#090d1f] px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-[#111730] transition cursor-pointer"
          >
            <span>🔗</span>{" "}
            {copiedId === "share_json"
              ? "Copied! ✓"
              : copiedId === "share_json:error"
                ? "Failed"
                : "Copy State"}
          </button>

          <div className="flex items-center gap-2 border-l border-[#151c33] pl-2.5">
            <span className="text-xs font-medium text-slate-300">Dev</span>
            <button
              type="button"
              role="switch"
              aria-label="Developer Mode"
              aria-checked={developerMode}
              onClick={() => {
                setDeveloperMode((enabled) => !enabled);
                setLayerInspectorTab("overview");
                setIsPlayingReplay(false);
              }}
              className={`relative inline-flex h-5 w-8 items-center rounded-full transition-colors cursor-pointer ${
                developerMode ? "bg-indigo-600" : "bg-slate-700"
              } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400`}
            >
              <span
                className={`inline-block size-3.5 transform rounded-full bg-white transition-transform ${
                  developerMode ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Subtitle & Cue Goal */}
      <div className="flex flex-wrap items-center justify-between gap-y-1.5 text-xs text-slate-300 border-t border-[#10162a] pt-2.5 font-mono">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 uppercase text-xs font-bold">
            Active Goal:
          </span>
          <strong className="text-white font-medium text-xs sm:text-sm">
            {simulatedMaxStep === 0
              ? "Awaiting Input / Cue (No Active Run in Memory — Cache Cleared)"
              : runMetadata.goal}
          </strong>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
          <div>
            Duration:{" "}
            <span className="text-slate-200 font-semibold">
              {simulatedMaxStep === 0 ? "0.000s" : runMetadata.duration}
            </span>
          </div>
          <div>
            Tokens:{" "}
            <span className="text-slate-200 font-semibold">
              {simulatedMaxStep === 0 ? "0" : runMetadata.tokenUsage.total}
            </span>
          </div>
          <div>
            Cost:{" "}
            <span className="text-slate-200 font-semibold">
              $
              {simulatedMaxStep === 0
                ? "0.0000"
                : runMetadata.estimatedCostUsd.toFixed(4)}
            </span>
          </div>
          <div>
            Owner:{" "}
            <span className="text-slate-200 font-semibold">
              Nelson (Single-User V1)
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
