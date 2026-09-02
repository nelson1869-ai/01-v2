"use client";

import React from "react";
import { CONNECTED_ACCOUNTS, CONTACTS_PEOPLE } from "../../accounts";

export function AccountsView() {
  return (
    <div className="flex flex-col gap-4 text-xs">
      <div className="rounded-xl border border-[#151c33] bg-[#070a18] p-4">
        <h4 className="font-bold text-white text-sm pb-2 border-b border-[#12182d]">
          Connected Personal Accounts &amp; Integrations
        </h4>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 font-mono text-[10px]">
          {CONNECTED_ACCOUNTS.map((acc) => (
            <div
              key={acc.id}
              className="p-3 rounded bg-[#090d1f] border border-[#151c33] space-y-1"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-white text-xs">
                  {acc.service}
                </span>
                <span className="text-emerald-400 font-bold text-[9px]">
                  SIMULATED {acc.connectionState}
                </span>
              </div>
              <div className="text-slate-300">Account: {acc.account}</div>
              <div className="text-slate-500">
                Scopes: {acc.scopes.join(", ")}
              </div>
              <div className="text-slate-500">
                Capabilities: {acc.capabilities.join(", ")}
              </div>
              <div className="grid grid-cols-1 gap-0.5 border-t border-[#151c33] pt-1 text-[9px] text-slate-500 sm:grid-cols-2">
                <span>Auth: {acc.authType}</span>
                <span>Health: SIMULATED {acc.health}</span>
                <span>Last sync: {acc.lastSync}</span>
                <span>Expires: {acc.expires}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* People & Contact Resolution */}
      <div className="rounded-xl border border-[#151c33] bg-[#070a18] p-4">
        <h4 className="font-bold text-white text-sm pb-2 border-b border-[#12182d]">
          Resolved People &amp; Trusted Contacts (Simulated Entity Resolver)
        </h4>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3 font-mono text-[10px]">
          {CONTACTS_PEOPLE.map((p) => (
            <div
              key={p.id}
              className="p-2.5 rounded bg-[#090d1f] border border-[#151c33]"
            >
              <span className="font-bold text-white block text-xs">
                {p.name}
              </span>
              <span className="text-slate-400 block">{p.email}</span>
              <span className="text-indigo-300 block">
                {p.organization} ({p.relationship})
              </span>
              <span className="text-emerald-400 text-[9px] block mt-1">
                Confidence: {p.confidence}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
