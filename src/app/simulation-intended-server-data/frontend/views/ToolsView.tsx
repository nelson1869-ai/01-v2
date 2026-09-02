"use client";

import React from "react";
import { TOOL_REGISTRY } from "../../tools";
import {
  AUTODO_INGRESS_CUES,
  GMAIL_ORIGIN_MESSAGES,
  GMAIL_ORIGIN_TRANSFORMATION_FLOW,
} from "../../gmail-data";

import { InboundGmailSimulator } from "./tools/InboundGmailSimulator";
import type { PrimaryNav } from "../../contracts";
import type { ScenarioId } from "../../scenarios";

interface ToolsViewProps {
  selectedOriginMessageId: string;
  setSelectedOriginMessageId: (id: string) => void;
  simulatedMaxStep?: number;
  onTriggerInboundRun?: (
    scenarioId: ScenarioId,
    autoNavigateToPipeline?: boolean,
  ) => void;
  isPlayingReplay?: boolean;
  setPrimaryNav?: (nav: PrimaryNav) => void;
}

export function ToolsView({
  selectedOriginMessageId,
  setSelectedOriginMessageId,
  simulatedMaxStep = 18,
  onTriggerInboundRun,
  isPlayingReplay = false,
  setPrimaryNav,
}: ToolsViewProps) {
  const isIdle = simulatedMaxStep === 0;
  return (
    <div className="flex flex-col gap-4 text-xs">
      {/* Interactive Inbound Gmail Webhook Simulator */}
      <InboundGmailSimulator
        onTriggerInboundRun={onTriggerInboundRun}
        simulatedMaxStep={simulatedMaxStep}
        isPlayingReplay={isPlayingReplay}
        setPrimaryNav={setPrimaryNav}
      />

      <div className="rounded-xl border border-[#151c33] bg-[#070a18] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#12182d] pb-2">
          <div>
            <h4 className="text-sm font-bold text-white">
              Unified Tool Gateway
            </h4>
            <p className="text-[10px] text-slate-500">
              Registry visibility does not grant execution permission.
            </p>
          </div>
          <span className="rounded border border-amber-800 bg-amber-950/40 px-2 py-0.5 font-mono text-[9px] font-bold text-amber-300">
            SIMULATED / PLANNED REGISTRY
          </span>
        </div>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[900px] text-left font-mono text-[10px]">
            <thead>
              <tr className="border-b border-[#151c33] text-[9px] uppercase text-slate-500">
                <th className="pb-2">Tool</th>
                <th className="pb-2">Provider / Type</th>
                <th className="pb-2">Risk</th>
                <th className="pb-2">Required Capability</th>
                <th className="pb-2">Timeout</th>
                <th className="pb-2">State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#151c33]/70 text-slate-300">
              {TOOL_REGISTRY.map((tool) => (
                <tr key={tool.id} className="align-top hover:bg-[#090d1f]">
                  <td className="py-2 pr-4">
                    <strong className="block text-indigo-300">{tool.id}</strong>
                    <span className="text-slate-500">{tool.description}</span>
                  </td>
                  <td className="py-2 pr-4">
                    <span className="block text-slate-200">
                      {tool.provider}
                    </span>
                    <span className="text-slate-500">
                      {tool.implementationType}
                    </span>
                  </td>
                  <td className="py-2 pr-4">{tool.risk}</td>
                  <td className="py-2 pr-4 text-sky-300">
                    {tool.requiredCapability}
                  </td>
                  <td className="py-2 pr-4">{tool.timeoutMs}ms</td>
                  <td className="py-2">
                    <span
                      className={
                        tool.enabled ? "text-emerald-400" : "text-slate-500"
                      }
                    >
                      {tool.health}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-[#151c33] bg-[#070a18] p-4">
          <h4 className="border-b border-[#12182d] pb-2 text-sm font-bold text-white">
            Selected Tool Contract
          </h4>
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 font-mono text-[10px]">
            <dt className="text-slate-500">Tool ID</dt>
            <dd className="text-indigo-300">gmail.list_messages</dd>
            <dt className="text-slate-500">Input</dt>
            <dd className="text-sky-300">{TOOL_REGISTRY[0].inputSchema}</dd>
            <dt className="text-slate-500">Output</dt>
            <dd className="text-sky-300">{TOOL_REGISTRY[0].outputSchema}</dd>
            <dt className="text-slate-500">Retry</dt>
            <dd className="text-slate-300">{TOOL_REGISTRY[0].retryPolicy}</dd>
            <dt className="text-slate-500">Execution gate</dt>
            <dd className="font-bold text-amber-300">
              Policy ALLOW + Authorization AUTHORIZED
            </dd>
          </dl>
        </div>

        <div className="rounded-xl border border-[#151c33] bg-[#070a18] p-4">
          <div className="flex items-center justify-between border-b border-[#12182d] pb-2">
            <h4 className="text-sm font-bold text-white">
              Simulated Gmail Call Lifecycle
            </h4>
            <span className="font-mono text-[9px] font-bold text-amber-300">
              NO REAL CALL
            </span>
          </div>
          <ol className="mt-3 grid grid-cols-1 gap-1.5 font-mono text-[10px] sm:grid-cols-2">
            {[
              "REQUESTED",
              "POLICY CHECKED",
              "AUTHORIZED",
              "PLANNED",
              "EXECUTION CLAIMED",
              "EXECUTED",
              "RESPONSE RECEIVED",
              "OBSERVED",
              "VERIFIED",
            ].map((state, index) => (
              <li
                key={state}
                className="flex items-center gap-2 rounded border border-[#151c33] bg-[#090d1f] p-2 text-slate-300"
              >
                <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-indigo-950 text-[8px] font-bold text-indigo-300">
                  {index + 1}
                </span>
                {state}
              </li>
            ))}
          </ol>
          <p className="mt-3 rounded border border-indigo-900/60 bg-indigo-950/20 p-2 font-mono text-[10px] text-indigo-200">
            Tool availability ≠ permission. The mock lifecycle exists to
            visualize the future control boundary.
          </p>
        </div>
      </div>

      {/* Source / Origin & Normalization Inspector */}
      <div className="rounded-xl border border-[#151c33] bg-[#070a18] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#12182d] pb-2">
          <div>
            <h4 className="text-sm font-bold text-white">
              Source / Origin &amp; Transformation Inspector
            </h4>
            <p className="text-[10px] text-slate-500">
              Inspect simulated external provider origin vs. normalized AutoDo
              ingress boundary.
            </p>
          </div>
          <span className="rounded border border-indigo-800 bg-indigo-950/60 px-2 py-0.5 font-mono text-[9px] font-bold text-indigo-300">
            SIMULATED_EXTERNAL_MESSAGE → ExternalCue
          </span>
        </div>

        {/* Message Selector Tabs */}
        <div className="mt-3 flex flex-wrap gap-2">
          {GMAIL_ORIGIN_MESSAGES.map((msg) => {
            const isSelected = selectedOriginMessageId === msg.messageId;
            return (
              <button
                key={msg.messageId}
                onClick={() => setSelectedOriginMessageId(msg.messageId)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-[10px] transition cursor-pointer ${
                  isSelected
                    ? "border-indigo-500 bg-[#10172e] text-white shadow-sm ring-1 ring-indigo-500"
                    : "border-[#151c33] bg-[#090d1f] text-slate-400 hover:text-slate-200"
                }`}
              >
                <span className="font-bold text-indigo-300">
                  [{msg.messageId}]
                </span>
                <span className="truncate max-w-[140px]">
                  {msg.headers.Subject}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Origin Message & Ingress Card */}
        {isIdle ? (
          <div className="mt-4 p-8 rounded-lg bg-[#090d1f] border border-dashed border-[#1e2a4a] text-center space-y-2 font-sans">
            <span className="text-2xl font-mono">⏳</span>
            <h4 className="text-sm font-bold text-slate-200">
              No External Messages Ingested Yet (Cache Cleared)
            </h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Launch a scenario from Client View or trigger a preset to simulate
              inbound Gmail webhook ingestion and transformation.
            </p>
          </div>
        ) : (
          (() => {
            const activeMsg =
              GMAIL_ORIGIN_MESSAGES.find(
                (m) => m.messageId === selectedOriginMessageId,
              ) || GMAIL_ORIGIN_MESSAGES[0];
            const activeCue =
              AUTODO_INGRESS_CUES.find(
                (c) => c.sourceMessageId === activeMsg.messageId,
              ) || AUTODO_INGRESS_CUES[0];

            return (
              <div className="mt-4 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {/* Left: Simulated External Message */}
                  <div className="rounded-lg border border-[#151c33] bg-[#090d1f] p-3.5">
                    <div className="flex items-center justify-between border-b border-[#12182d] pb-2">
                      <span className="font-bold uppercase tracking-wider text-slate-300 text-[10px]">
                        1. Simulated External Message (Origin)
                      </span>
                      <span className="rounded bg-slate-800 px-1.5 py-0.2 font-mono text-[8px] font-bold text-slate-300">
                        {activeMsg.sourceType}
                      </span>
                    </div>
                    <dl className="mt-2.5 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 font-mono text-[10px]">
                      <dt className="text-slate-500">Source System</dt>
                      <dd className="text-white">
                        {activeMsg.sourceSystem} ({activeMsg.provider})
                      </dd>
                      <dt className="text-slate-500">Origin Host</dt>
                      <dd className="text-sky-300">{activeMsg.origin}</dd>
                      <dt className="text-slate-500">Account</dt>
                      <dd className="text-slate-200">{activeMsg.account}</dd>
                      <dt className="text-slate-500">Message ID</dt>
                      <dd className="text-indigo-300 font-bold">
                        {activeMsg.messageId}
                      </dd>
                      <dt className="text-slate-500">Thread / History</dt>
                      <dd className="text-slate-300">
                        {activeMsg.threadId} / {activeMsg.historyId}
                      </dd>
                      <dt className="text-slate-500">Received At</dt>
                      <dd className="text-slate-300">{activeMsg.receivedAt}</dd>
                      <dt className="text-slate-500">From / To</dt>
                      <dd className="text-slate-200">
                        {activeMsg.headers.From} → {activeMsg.headers.To}
                      </dd>
                      <dt className="text-slate-500">Subject</dt>
                      <dd className="text-white font-semibold">
                        {activeMsg.headers.Subject}
                      </dd>
                      <dt className="text-slate-500">Labels</dt>
                      <dd className="flex flex-wrap gap-1">
                        {activeMsg.labels.map((l) => (
                          <span
                            key={l}
                            className="rounded bg-slate-800 px-1 py-0.2 text-[8px] text-slate-300"
                          >
                            {l}
                          </span>
                        ))}
                      </dd>
                    </dl>
                    <div className="mt-3 border-t border-[#12182d] pt-2">
                      <span className="text-slate-500 font-mono text-[9px] block mb-1">
                        Raw Snippet Preview:
                      </span>
                      <p className="rounded bg-[#050711] p-2 text-[10px] text-slate-300 font-mono italic border border-[#12182d]">
                        &ldquo;{activeMsg.snippet}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Right: AutoDo Normalized Ingress Cue */}
                  <div className="rounded-lg border border-indigo-900/60 bg-[#070b1e] p-3.5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between border-b border-[#12182d] pb-2">
                        <span className="font-bold uppercase tracking-wider text-indigo-300 text-[10px]">
                          2. AutoDo Ingress Boundary (ExternalCue)
                        </span>
                        <span className="rounded bg-emerald-950 px-1.5 py-0.2 font-mono text-[8px] font-bold text-emerald-400 border border-emerald-800/40">
                          {activeCue.provenance} INGRESS
                        </span>
                      </div>
                      <dl className="mt-2.5 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 font-mono text-[10px]">
                        <dt className="text-slate-500">Cue ID</dt>
                        <dd className="text-emerald-400 font-bold">
                          {activeCue.cueId}
                        </dd>
                        <dt className="text-slate-500">Cue Source</dt>
                        <dd className="text-white">{activeCue.source}</dd>
                        <dt className="text-slate-500">Source Message ID</dt>
                        <dd className="text-indigo-300 font-bold">
                          {activeCue.sourceMessageId}
                        </dd>
                        <dt className="text-slate-500">Source Account</dt>
                        <dd className="text-slate-200">
                          {activeCue.sourceAccount}
                        </dd>
                        <dt className="text-slate-500">Received Timestamp</dt>
                        <dd className="text-slate-300">
                          {activeCue.receivedAt}
                        </dd>
                        <dt className="text-slate-500">Payload Reference</dt>
                        <dd className="text-sky-300">{activeCue.payloadRef}</dd>
                      </dl>
                    </div>
                    <p className="mt-3 rounded border border-[#151c33] bg-[#050711] p-2 font-mono text-[9px] text-slate-400 leading-relaxed">
                      ℹ Adapter normalization removes provider coupling and
                      validates schema invariants before entering AutoDo Brain
                      Layer 1 (Input / Cue).
                    </p>
                  </div>
                </div>

                {/* Boundary Transformation Flow Visualizer */}
                <div className="rounded-lg border border-[#151c33] bg-[#090d1f] p-3.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block mb-2 font-mono">
                    Ingress Transformation Chain (Provider → Brain)
                  </span>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 font-mono text-[9px]">
                    {GMAIL_ORIGIN_TRANSFORMATION_FLOW.map((flowStep) => (
                      <div
                        key={flowStep.stepNumber}
                        className="p-2.5 rounded border border-[#151c33] bg-[#050711] flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between pb-1 border-b border-[#12182d]">
                            <span className="text-indigo-300 font-bold">
                              Step {flowStep.stepNumber}
                            </span>
                            <span className="text-[8px] text-slate-500">
                              [{flowStep.boundary}]
                            </span>
                          </div>
                          <span className="font-bold text-white block mt-1 leading-tight">
                            {flowStep.name}
                          </span>
                          <p className="text-slate-400 text-[8px] mt-0.5 leading-tight">
                            {flowStep.description}
                          </p>
                        </div>
                        <div className="mt-2 pt-1 border-t border-[#12182d] flex justify-between items-center text-[8px]">
                          <span className="text-slate-500 truncate max-w-[100px]">
                            {flowStep.outputArtifact}
                          </span>
                          <span className="text-emerald-400 font-bold">
                            [{flowStep.provenance.slice(0, 3)}]
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()
        )}
      </div>
    </div>
  );
}
