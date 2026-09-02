"use client";

import React from "react";
import { MCP_SERVERS } from "../../mcp";

export function McpView() {
  return (
    <div className="flex flex-col gap-4 text-xs">
      <div className="rounded-xl border border-[#151c33] bg-[#070a18] p-4">
        <div className="flex justify-between items-center pb-2 border-b border-[#12182d]">
          <div>
            <h4 className="font-bold text-white text-sm">
              Model Context Protocol (MCP) Registry
            </h4>
            <p className="text-[10px] text-slate-500">
              MCP tools are capabilities; they must pass through Policy &amp;
              Authorization
            </p>
          </div>
          <span className="rounded bg-indigo-950 px-2 py-0.5 font-mono text-[9px] font-bold text-indigo-300 border border-indigo-800">
            SIMULATED PROTOCOL: 2024-11-05
          </span>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {MCP_SERVERS.map((server) => (
            <div
              key={server.id}
              className="p-3.5 rounded-lg bg-[#090d1f] border border-[#151c33] flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center pb-1.5 border-b border-[#12182d]">
                  <span className="font-bold text-white font-mono">
                    {server.name}
                  </span>
                  <span className="rounded bg-emerald-950 px-1.5 py-0.2 text-[8px] font-bold text-emerald-400 border border-emerald-800">
                    SIMULATED {server.connectionState}
                  </span>
                </div>
                <div className="mt-2 text-[10px] font-mono text-slate-400 space-y-0.5">
                  <div>
                    Transport:{" "}
                    <span className="text-slate-200">{server.transport}</span>
                  </div>
                  <div>
                    Capabilities:{" "}
                    <span className="text-indigo-300">
                      {server.capabilities.join(", ")}
                    </span>
                  </div>
                  <div>
                    Tools:{" "}
                    <span className="text-slate-200">
                      {server.toolsCount} registered
                    </span>
                  </div>
                </div>

                <div className="mt-2 space-y-1">
                  {server.tools.map((t, idx) => (
                    <div
                      key={idx}
                      className="p-1.5 rounded bg-[#050711] border border-[#151c33] flex justify-between items-center text-[10px]"
                    >
                      <span className="font-mono text-slate-200">{t.name}</span>
                      <span
                        className={`text-[8px] font-bold px-1 rounded ${t.risk === "HIGH" ? "bg-rose-950 text-rose-400" : "bg-slate-800 text-slate-400"}`}
                      >
                        {t.risk} RISK
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-[#151c33] bg-[#070a18] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#12182d] pb-2">
          <h4 className="text-sm font-bold text-white">
            MCP Tool Call Inspector
          </h4>
          <span className="font-mono text-[9px] font-bold text-amber-300">
            SIMULATED CALL — NO SERVER CONTACTED
          </span>
        </div>
        <dl className="mt-3 grid grid-cols-1 gap-2 font-mono text-[10px] sm:grid-cols-[auto_1fr_auto_1fr]">
          <dt className="text-slate-500">Server</dt>
          <dd className="text-slate-200">filesystem-server</dd>
          <dt className="text-slate-500">Tool</dt>
          <dd className="text-indigo-300">write_file</dd>
          <dt className="text-slate-500">Capability</dt>
          <dd className="text-sky-300">cap_mcp_fs_write</dd>
          <dt className="text-slate-500">Policy</dt>
          <dd className="text-amber-300">REQUIRE_APPROVAL</dd>
          <dt className="text-slate-500">Authorization</dt>
          <dd className="text-rose-300">WAITING_FOR_APPROVAL</dd>
          <dt className="text-slate-500">Plan step</dt>
          <dd className="text-slate-200">step_mcp_01</dd>
          <dt className="text-slate-500">Execution</dt>
          <dd className="text-slate-400">NOT STARTED</dd>
          <dt className="text-slate-500">Arguments</dt>
          <dd className="text-sky-300">
            {"{ path: '/allowed/notes.md', content: '...' }"}
          </dd>
          <dt className="text-slate-500">Result</dt>
          <dd className="text-slate-400">No response or observation</dd>
        </dl>
        <p className="mt-3 rounded border border-rose-900/60 bg-rose-950/20 p-2 font-mono text-[10px] text-rose-200">
          AI → MCP direct execution is prohibited. This request stops at the
          approval boundary.
        </p>
      </div>
    </div>
  );
}
