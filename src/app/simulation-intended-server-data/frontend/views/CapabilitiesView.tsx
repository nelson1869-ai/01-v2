"use client";

import React from "react";
import { CAPABILITIES } from "../../tools";

export function CapabilitiesView() {
  return (
    <div className="flex flex-col gap-4 text-xs">
      <div className="rounded-xl border border-[#151c33] bg-[#070a18] p-4">
        <h4 className="font-bold text-white text-sm pb-2 border-b border-[#12182d]">
          Personal Capability Registry (RBAC Matrix)
        </h4>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-[11px] font-mono">
            <thead>
              <tr className="border-b border-[#151c33] text-slate-500 uppercase text-[9px]">
                <th className="pb-2">Service</th>
                <th className="pb-2">Operation</th>
                <th className="pb-2">Risk</th>
                <th className="pb-2">Default Policy</th>
                <th className="pb-2">Approval Mode</th>
                <th className="pb-2">Required Scope</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#151c33]/60 text-slate-300">
              {CAPABILITIES.map((cap) => (
                <tr key={cap.id} className="hover:bg-[#090d1f]">
                  <td className="py-2 font-bold text-white">{cap.service}</td>
                  <td className="py-2 text-indigo-300">{cap.operation}</td>
                  <td className="py-2">
                    <span
                      className={`px-1 rounded text-[8px] font-bold ${
                        cap.risk === "CRITICAL"
                          ? "bg-rose-950 text-rose-300"
                          : cap.risk === "HIGH"
                            ? "bg-amber-950 text-amber-300"
                            : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {cap.risk}
                    </span>
                  </td>
                  <td className="py-2">{cap.defaultPolicy}</td>
                  <td className="py-2 text-slate-400">{cap.approvalMode}</td>
                  <td className="py-2 text-slate-500">{cap.scope}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
