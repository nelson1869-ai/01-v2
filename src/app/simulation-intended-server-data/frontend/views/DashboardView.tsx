"use client";

import React from "react";
import type { PrimaryNav } from "../../contracts";
import { CONNECTED_ACCOUNTS } from "../../accounts";
import { AUTODO_SCENARIOS, type ScenarioId } from "../../scenarios";

interface DashboardViewProps {
  setPrimaryNav: (nav: PrimaryNav) => void;
  pendingApprovalCount: number;
  setActiveScenarioId?: (id: ScenarioId) => void;
  simulatedMaxStep?: number;
}

export function DashboardView({
  setPrimaryNav,
  pendingApprovalCount,
  setActiveScenarioId,
  simulatedMaxStep = 18,
}: DashboardViewProps) {
  const isIdle = simulatedMaxStep === 0;

  return (
    <div className="flex flex-col gap-4 text-xs">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 font-mono">
        <div className="p-3.5 rounded-xl border border-[#151c33] bg-[#070a18]">
          <span className="text-slate-500 uppercase text-[9px] font-bold block">
            Active Personal Agent
          </span>
          <span className="text-sm font-bold text-white block mt-1">
            {isIdle ? "AutoDo Core (Standby)" : "AutoDo Core v1.0"}
          </span>
          <span className="text-[10px] text-indigo-300">
            {isIdle ? "0/18 Layers in Memory" : "18-Layer Autonomous Loop"}
          </span>
        </div>
        <div className="p-3.5 rounded-xl border border-[#151c33] bg-[#070a18]">
          <span className="text-slate-500 uppercase text-[9px] font-bold block">
            Run Success Rate (Evals)
          </span>
          <span className="text-sm font-bold text-emerald-400 block mt-1">
            {isIdle ? "0 Active Runs" : "100% (3/3 Suites Pass)"}
          </span>
          <span className="text-[10px] text-slate-400">
            {isIdle ? "Cache Cleared" : "0 Policy Invariant Breaches"}
          </span>
        </div>
        <div className="p-3.5 rounded-xl border border-[#151c33] bg-[#070a18]">
          <span className="text-slate-500 uppercase text-[9px] font-bold block">
            Connected Accounts
          </span>
          <span className="text-sm font-bold text-white block mt-1">
            {
              CONNECTED_ACCOUNTS.filter(
                (account) => account.connectionState === "CONNECTED",
              ).length
            }{" "}
            Active
          </span>
          <span className="text-[10px] text-slate-400">
            Gmail, Calendar, Contacts, GitHub
          </span>
        </div>
        <div className="p-3.5 rounded-xl border border-[#151c33] bg-[#070a18]">
          <span className="text-slate-500 uppercase text-[9px] font-bold block">
            Approval Inbox
          </span>
          <span className="text-sm font-bold text-amber-400 block mt-1">
            {pendingApprovalCount} Pending Review
          </span>
          <span className="text-[10px] text-slate-400">
            Sensitive actions guarded
          </span>
        </div>
      </div>

      {/* Quick Actions & Recent Runs */}
      <div className="rounded-xl border border-[#151c33] bg-[#070a18] p-4">
        <h4 className="font-bold text-white text-sm pb-2 border-b border-[#12182d]">
          Recent Personal AI Runs (Scenario History)
        </h4>

        {isIdle ? (
          <div className="mt-3 p-8 rounded-lg bg-[#090d1f] border border-dashed border-[#1e2a4a] text-center space-y-2 font-sans">
            <span className="text-2xl font-mono">⏳</span>
            <h4 className="text-sm font-bold text-slate-200">
              No Active Runs in Memory (Cache Cleared)
            </h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Launch a run from Client View or trigger a preset above to stream telemetry and record run history.
            </p>
          </div>
        ) : (
          <div className="mt-3 flex flex-col gap-2 font-mono text-[11px]">
            {AUTODO_SCENARIOS.map((scenario) => (
              <button
                key={scenario.id}
                type="button"
                onClick={() => {
                  if (setActiveScenarioId) {
                    setActiveScenarioId(scenario.id as ScenarioId);
                  }
                  setPrimaryNav("pipeline");
                }}
                className="flex w-full items-center justify-between p-2.5 rounded bg-[#090d1f] border border-[#151c33] cursor-pointer text-left hover:border-indigo-500 hover:bg-[#10172e] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-emerald-400 font-bold">✔</span>
                  <span className="font-bold text-white">
                    {scenario.metadata.runId}
                  </span>
                  <span className="text-slate-400 truncate">
                    &ldquo;{scenario.metadata.goal}&rdquo;
                  </span>
                </div>
                <div className="flex items-center gap-4 text-slate-400 shrink-0">
                  <span className="hidden sm:inline">18/18 Layers</span>
                  <span>{scenario.metadata.duration}</span>
                  <span className="text-emerald-400 font-bold">
                    {scenario.metadata.status.toUpperCase()}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
