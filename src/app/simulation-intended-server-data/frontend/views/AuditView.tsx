"use client";

import React from "react";
import type { AuditEvent } from "../../contracts";
import { AUDIT_TRAIL } from "../../audit";
import { getReplayProgress } from "../utils/replayProgress";

interface AuditViewProps {
  auditTrail?: readonly AuditEvent[];
  simulatedMaxStep?: number;
  isPlayingReplay?: boolean;
}

export function AuditView({
  auditTrail = AUDIT_TRAIL,
  simulatedMaxStep = 18,
  isPlayingReplay = false,
}: AuditViewProps) {
  const replayProgress = getReplayProgress(simulatedMaxStep, isPlayingReplay);
  const getVisibleStageCount = (step: number) => {
    if (step >= 18) return 7;
    if (step >= 15) return 6;
    if (step >= 13) return 5;
    if (step >= 10) return 4;
    if (step >= 9) return 3;
    if (step >= 5) return 2;
    if (step >= 1) return 1;
    return 0;
  };

  const visibleCount = getVisibleStageCount(replayProgress.completedThrough);
  const visibleEvents = auditTrail.slice(0, visibleCount);
  const isRecorded = visibleEvents.length > 0;
  const isStillAppending =
    isPlayingReplay || (simulatedMaxStep > 0 && simulatedMaxStep < 18);

  return (
    <div className="flex flex-col gap-4 text-xs">
      <div className="rounded-xl border border-[#151c33] bg-[#070a18] p-4">
        <div className="flex justify-between items-center pb-2 border-b border-[#12182d]">
          <h4 className="font-bold text-white text-sm">
            Complete Run Audit Trail (WHAT, WHEN, WHO, WHY, PERMISSION,
            EVIDENCE)
          </h4>
          <span
            className={`font-mono text-[10px] px-2 py-0.5 rounded border ${
              isStillAppending
                ? "bg-cyan-950 text-cyan-300 border-cyan-700 animate-pulse"
                : simulatedMaxStep === 0
                  ? "bg-slate-900 text-slate-400 border-slate-800"
                  : "bg-emerald-950 text-emerald-400 border-emerald-800"
            }`}
          >
            {isStillAppending
              ? `⚡ STREAMING: ${visibleCount}/7 STAGES RECORDED`
              : simulatedMaxStep === 0
                ? "AUDIT LEDGER: IDLE"
                : "AUDIT LEDGER: 7/7 STAGES COMMITTED"}
          </span>
        </div>

        {!isRecorded ? (
          <div className="mt-3 p-8 rounded-lg bg-[#090d1f] border border-dashed border-[#1e2a4a] text-center space-y-2 font-sans">
            <span className="text-2xl font-mono">⏳</span>
            <h4 className="text-sm font-bold text-slate-200">
              No Audit Ledger Events Recorded Yet (Cache Cleared)
            </h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Every action, evaluation, policy check, and tool invocation is
              immutably appended to this ledger during execution.
            </p>
          </div>
        ) : (
          <div className="mt-3 space-y-2.5 font-mono text-[10px]">
            {visibleEvents.map((a, idx) => (
              <div
                key={a.id}
                className="p-3 rounded bg-[#090d1f] border border-[#151c33] space-y-1"
              >
                <div className="flex justify-between items-center text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="flex size-5 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-slate-200">
                      {idx + 1}
                    </span>
                    <span className="text-white font-bold text-xs">
                      {a.what}
                    </span>
                  </div>
                  <span>{a.timestamp}</span>
                </div>
                <div className="text-indigo-300 pl-7">
                  Initiator: {a.whoInitiated} | Why: {a.why}
                </div>
                <div className="text-slate-400 pl-7">
                  Permission:{" "}
                  <strong className="text-emerald-400">
                    {a.permissionExisted}
                  </strong>{" "}
                  | Evidence: {a.evidenceSupported}
                </div>
                <div className="text-slate-500 pl-7">
                  Outcome: {a.outcomeAfterward}
                </div>
              </div>
            ))}

            {isStillAppending && visibleCount < 7 && (
              <div className="p-3.5 rounded bg-cyan-950/20 border border-dashed border-cyan-800/60 flex items-center justify-between text-cyan-300 animate-pulse">
                <span className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-cyan-400 animate-ping"></span>
                  Awaiting next stage audit event (Stage {visibleCount + 1}
                  /7)...
                </span>
                <span className="text-[10px] text-slate-400">
                  Append-Only Invariant Enforced
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
