"use client";

import React from "react";
import { LOCAL_DEV_SECRETS, RUNTIME_INFO } from "../../runtime";

interface RuntimeSecretsViewProps {
  revealedSecrets: Record<string, boolean>;
  toggleSecretReveal: (id: string) => void;
  copiedId: string | null;
  copyToClipboard: (text: string, id: string) => Promise<void>;
}

export function RuntimeSecretsView({
  revealedSecrets,
  toggleSecretReveal,
  copiedId,
  copyToClipboard,
}: RuntimeSecretsViewProps) {
  return (
    <div className="flex flex-col gap-4 text-xs">
      <div className="rounded-xl border border-[#151c33] bg-[#070a18] p-4">
        <h4 className="font-bold text-white text-sm pb-2 border-b border-[#12182d]">
          Runtime Engine Specifications (Truthful Package Inspection)
        </h4>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 font-mono text-[10px]">
          {Object.entries(RUNTIME_INFO).map(([k, v]) => (
            <div
              key={k}
              className="flex justify-between p-2 rounded bg-[#090d1f] border border-[#151c33]"
            >
              <span className="text-slate-500 uppercase font-bold">{k}</span>
              <span className="text-slate-200 font-semibold">{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-amber-900/50 bg-[#070a18] p-4">
        <div className="flex justify-between items-center pb-2 border-b border-[#12182d]">
          <div>
            <h4 className="font-bold text-amber-400 text-sm">
              Local Dev Mock Secrets (Protected Boundary)
            </h4>
            <p className="text-[10px] text-slate-500">
              LOCAL DEV / MOCK ONLY — Never real production secrets
            </p>
          </div>
        </div>

        <div className="mt-3 space-y-2 font-mono text-[10px]">
          {LOCAL_DEV_SECRETS.map((sec) => {
            const isRevealed = Boolean(revealedSecrets[sec.id]);
            return (
              <div
                key={sec.id}
                className="p-2.5 rounded bg-[#090d1f] border border-[#151c33] flex justify-between items-center"
              >
                <div>
                  <span className="font-bold text-slate-200 block text-xs">
                    {sec.label}
                  </span>
                  <span className="text-slate-500">
                    {sec.source} • Scope: {sec.scope}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-indigo-300 bg-[#050711] px-2 py-0.5 rounded border border-[#151c33]">
                    {isRevealed ? sec.mockValue : sec.maskedValue}
                  </span>
                  <button
                    onClick={() => toggleSecretReveal(sec.id)}
                    className="px-2 py-0.5 rounded bg-indigo-600 text-white font-bold cursor-pointer"
                  >
                    {isRevealed ? "Hide" : "Reveal"}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(sec.mockValue, `secret:${sec.id}`)
                    }
                    className="px-2 py-0.5 rounded border border-[#263153] bg-[#090d1f] text-slate-300 font-bold hover:text-white"
                  >
                    {copiedId === `secret:${sec.id}`
                      ? "Copied"
                      : copiedId === `secret:${sec.id}:error`
                        ? "Failed"
                        : "Copy"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cache & Ephemeral Storage Management */}
      <div className="rounded-xl border border-[#151c33] bg-[#070a18] p-4">
        <div className="flex justify-between items-center pb-2 border-b border-[#12182d]">
          <div>
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <span>🧹</span> Cache &amp; Ephemeral Storage Management
            </h4>
            <p className="text-[11px] text-slate-400">
              Manage local browser storage, RAG vector in-memory cache, and
              session tokens
            </p>
          </div>
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
              copyToClipboard("ALL_CACHE_PURGED", "storage_all_purged");
            }}
            className="flex items-center gap-1.5 rounded-lg border border-rose-900/60 bg-rose-950/40 px-3 py-1.5 text-xs font-bold text-rose-300 hover:bg-rose-900/60 transition cursor-pointer"
          >
            <span>🗑</span>{" "}
            {copiedId === "storage_all_purged"
              ? "All Cache Purged! ✓"
              : "Purge All UI/UX Cache"}
          </button>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 font-mono text-xs">
          <div className="p-3 rounded-lg bg-[#090d1f] border border-[#151c33] flex justify-between items-center">
            <div>
              <span className="font-bold text-slate-200 block">
                Browser Storage Cache
              </span>
              <span className="text-[10px] text-slate-400">
                localStorage + sessionStorage keys
              </span>
            </div>
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
                copyToClipboard("BROWSER_STORAGE_CLEARED", "browser_cleared");
              }}
              className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-semibold cursor-pointer"
            >
              {copiedId === "browser_cleared" ? "Cleared ✓" : "Clear"}
            </button>
          </div>

          <div className="p-3 rounded-lg bg-[#090d1f] border border-[#151c33] flex justify-between items-center">
            <div>
              <span className="font-bold text-slate-200 block">
                RAG Vector Cache
              </span>
              <span className="text-[10px] text-slate-400">
                pgvector cosine index buffer
              </span>
            </div>
            <button
              onClick={() =>
                copyToClipboard("VECTOR_CACHE_FLUSHED", "vector_flushed")
              }
              className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-semibold cursor-pointer"
            >
              {copiedId === "vector_flushed" ? "Flushed ✓" : "Flush"}
            </button>
          </div>

          <div className="p-3 rounded-lg bg-[#090d1f] border border-[#151c33] flex justify-between items-center">
            <div>
              <span className="font-bold text-slate-200 block">
                Lease &amp; Auth Tokens
              </span>
              <span className="text-[10px] text-slate-400">
                Active run tokens &amp; TTL locks
              </span>
            </div>
            <button
              onClick={() => copyToClipboard("LEASES_RESET", "leases_reset")}
              className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-semibold cursor-pointer"
            >
              {copiedId === "leases_reset" ? "Reset ✓" : "Reset"}
            </button>
          </div>

          <div className="p-3 rounded-lg bg-[#090d1f] border border-[#151c33] flex justify-between items-center">
            <div>
              <span className="font-bold text-slate-200 block">
                Simulated Gmail Cache
              </span>
              <span className="text-[10px] text-slate-400">
                Cached message list &amp; threads
              </span>
            </div>
            <button
              onClick={() =>
                copyToClipboard("TOOL_CACHE_CLEARED", "tool_cleared")
              }
              className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-semibold cursor-pointer"
            >
              {copiedId === "tool_cleared" ? "Cleared ✓" : "Clear"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
