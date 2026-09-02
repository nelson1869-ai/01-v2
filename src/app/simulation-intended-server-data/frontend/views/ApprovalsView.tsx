"use client";

import React from "react";
import type { ApprovalRequest } from "../../contracts";

interface ApprovalsViewProps {
  approvalRequests: readonly ApprovalRequest[];
  editingApprovalId: string | null;
  setEditingApprovalId: (id: string | null) => void;
  approvalDrafts: Record<string, string>;
  setApprovalDrafts: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
  handleApprove: (id: string) => void;
  handleReject: (id: string) => void;
  handleSaveApprovalEdit: (id: string) => void;
}

export function ApprovalsView({
  approvalRequests,
  editingApprovalId,
  setEditingApprovalId,
  approvalDrafts,
  setApprovalDrafts,
  handleApprove,
  handleReject,
  handleSaveApprovalEdit,
}: ApprovalsViewProps) {
  const pendingCount = approvalRequests.filter(
    (a) => a.status === "PENDING",
  ).length;

  return (
    <div className="flex flex-col gap-4 text-xs">
      <div className="rounded-xl border border-amber-900/50 bg-[#070a18] p-4">
        <div className="flex justify-between items-center pb-2 border-b border-[#12182d]">
          <div>
            <h4 className="font-bold text-amber-400 text-sm">
              Personal Approval Inbox (Human Gate)
            </h4>
            <p className="text-[10px] text-slate-500">
              Sensitive actions guarded by Policy requiring explicit user
              consent
            </p>
          </div>
          <span className="font-mono text-amber-400 text-[10px] font-bold">
            PENDING: {pendingCount}
          </span>
        </div>

        <div className="mt-3 flex flex-col gap-3">
          {approvalRequests.length === 0 ? (
            <div className="p-8 rounded-lg bg-[#090d1f] border border-dashed border-[#1e2a4a] text-center space-y-2 font-sans">
              <span className="text-2xl font-mono">🛡️</span>
              <h4 className="text-sm font-bold text-slate-200">
                Approval Inbox Clean (0 Pending Requests)
              </h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                No privileged actions currently require manual human
                authorization.
              </p>
            </div>
          ) : (
            approvalRequests.map((req) => (
              <div
                key={req.id}
                className="p-3.5 rounded-lg bg-[#090d1f] border border-[#151c33] flex flex-col gap-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#12182d]">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-white text-xs">
                      {req.action}
                    </span>
                    <span className="text-slate-400 text-[10px]">
                      ({req.tool})
                    </span>
                    <span className="rounded bg-amber-950 px-1.5 py-0.2 text-[8px] font-bold text-amber-300 border border-amber-800">
                      {req.risk} RISK
                    </span>
                  </div>
                  <span
                    className={`font-mono text-[10px] font-bold ${
                      req.status === "APPROVED"
                        ? "text-emerald-400"
                        : req.status === "REJECTED"
                          ? "text-rose-400"
                          : "text-amber-400"
                    }`}
                  >
                    STATUS: {req.status}
                  </span>
                </div>

                <p className="text-slate-200 text-xs">{req.reason}</p>
                {editingApprovalId === req.id ? (
                  <label className="flex flex-col gap-1 font-mono text-[9px] text-slate-400">
                    Mock arguments
                    <textarea
                      value={approvalDrafts[req.id] ?? ""}
                      onChange={(event) =>
                        setApprovalDrafts((drafts) => ({
                          ...drafts,
                          [req.id]: event.target.value,
                        }))
                      }
                      rows={4}
                      className="w-full resize-y rounded border border-indigo-700 bg-[#03050c] p-2 text-sky-300 outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                    />
                  </label>
                ) : (
                  <pre className="max-h-20 overflow-auto rounded bg-[#03050c] p-2 font-mono text-[9px] text-sky-300 border border-[#151c33]">
                    <code>{req.argumentsPreview}</code>
                  </pre>
                )}

                <div className="flex justify-between items-center pt-2 border-t border-[#12182d]">
                  <div className="text-[10px] text-slate-400">
                    Side Effect:{" "}
                    <strong className="text-slate-200">
                      {req.potentialSideEffect}
                    </strong>
                  </div>

                  {req.status === "PENDING" && (
                    <div className="flex items-center gap-2">
                      {editingApprovalId === req.id ? (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setApprovalDrafts((drafts) => ({
                                ...drafts,
                                [req.id]: req.argumentsPreview,
                              }));
                              setEditingApprovalId(null);
                            }}
                            className="rounded border border-[#263153] bg-[#090d1f] px-3 py-1 text-[10px] font-bold text-slate-300 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveApprovalEdit(req.id)}
                            className="rounded bg-indigo-600 px-3 py-1 text-[10px] font-bold text-white hover:bg-indigo-500"
                          >
                            Save Mock Edit
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setEditingApprovalId(req.id)}
                          className="rounded border border-[#263153] bg-[#090d1f] px-3 py-1 text-[10px] font-bold text-slate-300 hover:text-white"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleReject(req.id)}
                        disabled={editingApprovalId === req.id}
                        className="rounded bg-rose-950 px-3 py-1 text-[10px] font-bold text-rose-300 border border-rose-800 hover:bg-rose-900 cursor-pointer"
                      >
                        Reject
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApprove(req.id)}
                        disabled={editingApprovalId === req.id}
                        className="rounded bg-emerald-600 px-3 py-1 text-[10px] font-bold text-white hover:bg-emerald-500 cursor-pointer shadow"
                      >
                        Approve Request
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
