"use client";

import React from "react";
import { SCHEDULES, TRIGGER_SOURCES } from "../../triggers";

export function SchedulerView() {
  return (
    <div className="flex flex-col gap-4 text-xs">
      <div className="rounded-xl border border-[#151c33] bg-[#070a18] p-4">
        <h4 className="font-bold text-white text-sm pb-2 border-b border-[#12182d]">
          Personal Automations &amp; Schedules (Simulated Engine)
        </h4>
        <div className="mt-3 space-y-2 font-mono text-[10px]">
          {SCHEDULES.map((sch) => (
            <div
              key={sch.id}
              className="p-3 rounded bg-[#090d1f] border border-[#151c33] flex justify-between items-center"
            >
              <div>
                <span className="font-bold text-white text-xs block">
                  {sch.goal}
                </span>
                <span className="text-slate-400">
                  {sch.triggerType} • Recurrence: {sch.recurrence} • Timezone:{" "}
                  {sch.timezone}
                </span>
              </div>
              <div className="text-right">
                <span className="text-indigo-300 block">
                  Next Run: {sch.nextRun}
                </span>
                <span className="text-emerald-400 font-bold">{sch.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ingress Triggers */}
      <div className="rounded-xl border border-[#151c33] bg-[#070a18] p-4">
        <h4 className="font-bold text-white text-sm pb-2 border-b border-[#12182d]">
          Ingress Cue Sources ({TRIGGER_SOURCES.length})
        </h4>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 font-mono text-[10px]">
          {TRIGGER_SOURCES.map((trg) => (
            <div
              key={trg.id}
              className="p-2.5 rounded bg-[#090d1f] border border-[#151c33]"
            >
              <span className="font-bold text-indigo-300 block">
                {trg.source}
              </span>
              <span className="text-slate-400 block">{trg.condition}</span>
              <span className="text-slate-500 text-[9px] block mt-1">
                Last Fired: {trg.lastFired} • Runs: {trg.runsCreated}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
