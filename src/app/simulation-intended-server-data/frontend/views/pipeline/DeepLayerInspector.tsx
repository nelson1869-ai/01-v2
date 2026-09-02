"use client";

import React from "react";
import type { LayerInspectorTab, PipelineStep } from "../../../contracts";

interface DeepLayerInspectorProps {
  activeLayer: PipelineStep;
  layerInspectorTab: LayerInspectorTab;
  setLayerInspectorTab: (tab: LayerInspectorTab) => void;
  simulatedMaxStep: number;
}

export function DeepLayerInspector({
  activeLayer,
  layerInspectorTab,
  setLayerInspectorTab,
  simulatedMaxStep,
}: DeepLayerInspectorProps) {
  const isExecuted = activeLayer.id <= simulatedMaxStep;

  return (
    <div className="rounded-xl border border-[#151c33] bg-[#070a18] p-4 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#12182d] pb-3">
        <div className="flex items-center gap-3">
          <span className="flex size-7 items-center justify-center rounded-full bg-indigo-600 font-mono font-bold text-white text-xs">
            {activeLayer.id}
          </span>
          <div>
            <h4 className="font-bold text-white text-sm sm:text-base">
              {activeLayer.name}
            </h4>
            <p className="text-xs text-slate-400 font-mono">
              Span: {activeLayer.spanId} · {activeLayer.durationMs}ms ·{" "}
              {activeLayer.provenance}
            </p>
          </div>
        </div>

        {/* 8 Inspector Sub-Tabs */}
        <div className="flex flex-wrap rounded-lg bg-[#090d1f] p-1 border border-[#151c33] text-xs font-mono">
          {(
            [
              "overview",
              "input",
              "output",
              "diff",
              "lineage",
              "evidence",
              "metrics",
              "logs",
              "raw",
            ] as const
          ).map((tab) => (
            <button
              key={tab}
              onClick={() => setLayerInspectorTab(tab)}
              className={`px-3 py-1.5 rounded transition uppercase text-xs font-semibold cursor-pointer ${
                layerInspectorTab === tab
                  ? "bg-indigo-600 text-white font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-Tab Contents */}
      <div className="mt-3.5 min-h-48">
        {!isExecuted ? (
          <div className="p-8 rounded-lg bg-[#090d1f] border border-dashed border-[#1e2a4a] text-center space-y-2 font-sans">
            <span className="text-2xl font-mono">⏳</span>
            <h4 className="text-sm font-bold text-slate-200">
              Layer {activeLayer.id} ({activeLayer.name}) Not Yet Executed
            </h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              {simulatedMaxStep === 0
                ? "No active run in memory (Cache Cleared). Enter a prompt above or trigger a run from Client View to execute all 18 layers."
                : `The brain pipeline has currently only executed up to Layer ${simulatedMaxStep}/18. This layer's input, output, logs, and raw state will populate once reached.`}
            </p>
            <div className="pt-2">
              <span className="rounded bg-[#04060f] px-2.5 py-1 text-[11px] font-mono text-slate-400 border border-[#151c33]">
                Planned Contract: {activeLayer.inputContract} ➔{" "}
                {activeLayer.outputContract}
              </span>
            </div>
          </div>
        ) : (
          <>
            {layerInspectorTab === "overview" && (
              <div className="space-y-3.5 font-sans">
                <div className="bg-[#090d1f] p-3.5 rounded-lg border border-[#151c33]">
                  <span className="text-xs font-bold text-slate-300 uppercase font-mono block mb-1">
                    Responsibility
                  </span>
                  <p className="text-slate-100 text-xs sm:text-sm leading-relaxed">
                    {activeLayer.responsibility}
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <div className="rounded-lg bg-[#090d1f] p-3.5 border border-[#151c33]">
                    <span className="text-xs font-bold text-emerald-400 uppercase font-mono block mb-1.5">
                      ✔ Owns
                    </span>
                    <ul className="list-disc pl-4 text-slate-200 space-y-1 text-xs sm:text-[13px]">
                      {activeLayer.owns.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg bg-[#090d1f] p-3.5 border border-[#151c33]">
                    <span className="text-xs font-bold text-rose-400 uppercase font-mono block mb-1.5">
                      ✖ Does NOT Own
                    </span>
                    <ul className="list-disc pl-4 text-slate-200 space-y-1 text-xs sm:text-[13px]">
                      {activeLayer.doesNotOwn.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {layerInspectorTab === "input" && (
              <div className="space-y-2.5 font-mono text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>
                    Input Contract:{" "}
                    <strong className="text-indigo-300">
                      {activeLayer.inputContract}
                    </strong>
                  </span>
                  <span>Previous: {activeLayer.previousLayer}</span>
                </div>
                <pre className="bg-[#03050c] p-3.5 rounded-lg border border-[#151c33] text-emerald-300 overflow-x-auto text-xs leading-relaxed">
                  {JSON.stringify(activeLayer.inputData, null, 2)}
                </pre>
              </div>
            )}

            {layerInspectorTab === "output" && (
              <div className="space-y-2.5 font-mono text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>
                    Output Contract:{" "}
                    <strong className="text-indigo-300">
                      {activeLayer.outputContract}
                    </strong>
                  </span>
                  <span>Next: {activeLayer.nextLayer}</span>
                </div>
                <pre className="bg-[#03050c] p-3.5 rounded-lg border border-[#151c33] text-indigo-300 overflow-x-auto text-xs leading-relaxed">
                  {JSON.stringify(activeLayer.outputData, null, 2)}
                </pre>
              </div>
            )}

            {layerInspectorTab === "diff" && (
              <div className="space-y-2 font-mono text-xs">
                <div className="text-slate-300 font-semibold">
                  Input ➔ Output Mutation Diff:
                </div>
                <div className="space-y-2 bg-[#03050c] p-3.5 rounded-lg border border-[#151c33]">
                  {activeLayer.contractDiff.map((diff, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 text-emerald-400"
                    >
                      <span className="font-bold">+{diff.field}:</span>
                      <span className="text-slate-100">{diff.outputValue}</span>
                      <span className="text-slate-400 italic">
                        ({diff.note})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {layerInspectorTab === "lineage" && (
              <div className="space-y-2 font-mono text-xs">
                <div className="text-slate-300 font-semibold">
                  Origin ➔ Intermediate ➔ Destination Lineage:
                </div>
                <div className="space-y-2.5 bg-[#03050c] p-3.5 rounded-lg border border-[#151c33]">
                  {(activeLayer.dataLineage || []).map((item, i) => (
                    <div
                      key={i}
                      className="flex flex-col gap-1 p-2.5 rounded bg-[#090d1f] border border-[#12182d]"
                    >
                      <div className="flex items-center justify-between text-slate-200">
                        <span>
                          From: <strong>{item.from}</strong> ({item.fromType})
                        </span>
                        <span>
                          To: <strong>{item.to}</strong> ({item.toType})
                        </span>
                      </div>
                      <div className="text-xs text-indigo-300">
                        Transform: {item.transform} ➔ Dest: {item.destination}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {layerInspectorTab === "evidence" && (
              <div className="space-y-2 font-mono text-xs">
                <div className="text-slate-300 font-semibold">
                  Layer Verification &amp; Evidence Checks:
                </div>
                <div className="space-y-2 bg-[#03050c] p-3.5 rounded-lg border border-[#151c33]">
                  {(activeLayer.evidenceChecks || []).map((check, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded bg-[#090d1f]"
                    >
                      <div>
                        <span className="text-slate-100 font-bold text-xs">
                          {check.checkName}
                        </span>
                        <p className="text-xs text-slate-400 font-normal">
                          {check.description}
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {check.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {layerInspectorTab === "metrics" && (
              <div className="space-y-2 font-mono text-xs">
                <div className="text-slate-300 font-semibold">
                  Execution Waterfall &amp; Telemetry:
                </div>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  <div className="bg-[#03050c] p-3.5 rounded-lg border border-[#151c33] space-y-2">
                    <span className="text-slate-300 font-bold block pb-1 border-b border-[#12182d]">
                      Internal Operations
                    </span>
                    {activeLayer.timingWaterfall.map((op, i) => (
                      <div
                        key={i}
                        className="flex justify-between text-slate-200 text-xs"
                      >
                        <span>{op.operation}</span>
                        <span>
                          {op.durationMs}ms ({op.percentage}%)
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-[#03050c] p-3.5 rounded-lg border border-[#151c33] space-y-2 text-xs text-slate-200">
                    <span className="text-slate-300 font-bold block pb-1 border-b border-[#12182d]">
                      Mock Resources
                    </span>
                    <div className="flex justify-between">
                      <span>CPU User Time:</span>
                      <span>{activeLayer.mockTelemetry.cpuUserTimeMs}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Heap Delta:</span>
                      <span>+{activeLayer.mockTelemetry.heapDeltaKb}KB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Event Loop Lag:</span>
                      <span>{activeLayer.mockTelemetry.eventLoopLagMs}ms</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {layerInspectorTab === "logs" && (
              <div className="space-y-2 font-mono text-xs">
                <div className="text-slate-300 font-semibold">
                  Structured Layer Audit Logs:
                </div>
                <div className="bg-[#03050c] p-3.5 rounded-lg border border-[#151c33] space-y-2 max-h-48 overflow-y-auto">
                  {activeLayer.layerLogs.map((log, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs">
                      <span className="text-slate-400">{log.timestamp}</span>
                      <span className="text-indigo-400 font-bold">
                        [{log.level}]
                      </span>
                      <span className="text-slate-200">{log.event}:</span>
                      <span className="text-slate-400">{log.metadata}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {layerInspectorTab === "raw" && (
              <pre className="bg-[#03050c] p-3.5 rounded-lg border border-[#151c33] text-xs text-slate-300 font-mono overflow-x-auto max-h-60 leading-relaxed">
                {JSON.stringify(activeLayer, null, 2)}
              </pre>
            )}
          </>
        )}
      </div>
    </div>
  );
}
