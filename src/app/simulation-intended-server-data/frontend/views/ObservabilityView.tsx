"use client";

import React from "react";
import type { PipelineStep } from "../../contracts";
import { PIPELINE_STEPS } from "../../pipeline";

interface ObservabilityViewProps {
  pipelineSteps?: readonly PipelineStep[];
  traceId?: string;
  simulatedMaxStep?: number;
  isPlayingReplay?: boolean;
}

export function ObservabilityView({
  pipelineSteps = PIPELINE_STEPS,
  traceId = "trc_autodo_20260527_98a",
  simulatedMaxStep = 18,
  isPlayingReplay = false,
}: ObservabilityViewProps) {
  const isTraced = simulatedMaxStep > 0;
  const visibleSpans = pipelineSteps.filter((s) => s.id <= simulatedMaxStep);
  const isStillTracing =
    isPlayingReplay || (simulatedMaxStep > 0 && simulatedMaxStep < 18);

  return (
    <div className="flex flex-col gap-4 text-xs">
      <div className="rounded-xl border border-[#151c33] bg-[#070a18] p-4">
        <div className="flex justify-between items-center pb-2 border-b border-[#12182d]">
          <h4 className="font-bold text-white text-sm">
            Whole-Run Distributed Trace &amp; Structured Logs
          </h4>
          <span
            className={`font-mono text-[10px] px-2 py-0.5 rounded border ${
              isStillTracing
                ? "bg-cyan-950 text-cyan-300 border-cyan-700 animate-pulse"
                : isTraced
                  ? "bg-indigo-950 text-indigo-300 border-indigo-800"
                  : "bg-slate-900 text-slate-400 border-slate-800"
            }`}
          >
            {isStillTracing
              ? `⚡ TRACING: ${visibleSpans.length}/18 SPANS ACTIVE`
              : isTraced
                ? `Trace: ${traceId}`
                : "Trace: None (Idle)"}
          </span>
        </div>

        {!isTraced ? (
          <div className="mt-3 p-8 rounded-lg bg-[#090d1f] border border-dashed border-[#1e2a4a] text-center space-y-2 font-sans">
            <span className="text-2xl font-mono">⏳</span>
            <h4 className="text-sm font-bold text-slate-200">
              No Distributed Trace Spans in Active Memory (Cache Cleared)
            </h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              When a pipeline run starts, OpenTelemetry trace spans, latencies,
              and execution metadata stream live into this view.
            </p>
          </div>
        ) : (
          <div className="mt-3 max-h-96 overflow-y-auto space-y-1 font-mono text-[10px] bg-[#03050c] p-3 rounded border border-[#151c33]">
            {visibleSpans.map((s) => (
              <div
                key={s.id}
                className="flex justify-between p-1 hover:bg-[#0e1428] rounded"
              >
                <span className="text-slate-300">
                  [{s.startedAt}] [Layer {s.id}: {s.name}] ({s.spanId}){" "}
                  {s.responsibility}
                </span>
                <span className="text-indigo-400">{s.durationMs}ms</span>
              </div>
            ))}

            {isStillTracing && visibleSpans.length < 18 && (
              <div className="p-2 rounded bg-cyan-950/20 border border-dashed border-cyan-800/60 flex items-center justify-between text-cyan-300 animate-pulse text-[10px]">
                <span className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-cyan-400 animate-ping"></span>
                  OpenTelemetry Span for Layer {visibleSpans.length + 1}{" "}
                  actively recording...
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
