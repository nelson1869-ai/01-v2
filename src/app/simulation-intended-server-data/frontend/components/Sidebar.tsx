"use client";

import React from "react";
import type { PrimaryNav } from "../../contracts";
import { getReplayProgress } from "../utils/replayProgress";

interface SidebarProps {
  primaryNav: PrimaryNav;
  setPrimaryNav: (nav: PrimaryNav) => void;
  pendingApprovalCount: number;
  simulatedMaxStep?: number;
  isPlayingReplay?: boolean;
}

export function Sidebar({
  primaryNav,
  setPrimaryNav,
  pendingApprovalCount,
  simulatedMaxStep = 18,
  isPlayingReplay = false,
}: SidebarProps) {
  const replayProgress = getReplayProgress(
    simulatedMaxStep,
    isPlayingReplay,
  );

  const getRunningBadge = (itemId: string) => {
    if (replayProgress.isIdle)
      return itemId === "pipeline" ? "0/18 IDLE" : null;
    if (replayProgress.isComplete)
      return itemId === "pipeline" ? "18/18" : null;

    const currentLayer = simulatedMaxStep;

    if (!isPlayingReplay) {
      return itemId === "pipeline" ? `L${currentLayer}/18 PAUSED` : null;
    }

    switch (itemId) {
      case "pipeline":
        return `L${currentLayer}/18`;
      case "context":
        return currentLayer === 3 ? "⚡ 12s" : null;
      case "rag":
        return currentLayer === 4 ? "⚡ 14s" : null;
      case "decisions":
        return currentLayer >= 5 && currentLayer <= 7 ? "⚡ 20s" : null;
      case "capabilities":
        return currentLayer >= 9 && currentLayer <= 10 ? "⚡ 10s" : null;
      case "tools":
        return currentLayer === 13 ? "⚡ 18s" : null;
      case "evals":
        return currentLayer === 15 ? "⚡ 12s" : null;
      case "memory":
        return currentLayer === 18 ? "⚡ 12s" : null;
      default:
        return null;
    }
  };

  return (
    <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-[#151c33] bg-[#070a18] p-3.5 lg:flex">
      <div className="flex flex-col gap-4">
        {/* Logo & Personal Workspace Badge */}
        <div className="flex items-center gap-3 px-1 pb-3 border-b border-[#12182d]">
          <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white shadow-md shadow-indigo-600/40">
            ✦
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white leading-tight">
              AutoDo Dev Lab
            </h1>
            <p className="text-[11px] text-slate-400 font-mono leading-tight mt-0.5">
              Personal AI OS (18 Layers)
            </p>
          </div>
        </div>

        {/* Nav Categories */}
        <div className="flex flex-col gap-4 text-xs">
          {/* CORE BRAIN & RUNTIME */}
          <div className="flex flex-col gap-1">
            <span className="px-2.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              CORE BRAIN &amp; RUNS
            </span>
            <nav className="mt-1 flex flex-col gap-0.5">
              {[
                {
                  id: "client_chat",
                  label: "Client Chat (Interactive)",
                  icon: "💬",
                  badge: "LIVE MOCK",
                },
                { id: "dashboard", label: "Dashboard", icon: "⊞" },
                {
                  id: "pipeline",
                  label: "Brain Pipeline (18)",
                  icon: "⚡",
                  badge: "CANONICAL",
                },
                {
                  id: "decisions",
                  label: "AI Decisions & Router",
                  icon: "🤖",
                },
                { id: "context", label: "Context Assembled", icon: "📦" },
                { id: "rag", label: "Knowledge & RAG", icon: "🔍" },
                { id: "memory", label: "Memory (6 Types)", icon: "🧠" },
              ].map((item) => {
                const isActive = primaryNav === item.id;
                const liveBadge = getRunningBadge(item.id);

                return (
                  <button
                    key={item.id}
                    onClick={() => setPrimaryNav(item.id as PrimaryNav)}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-xs sm:text-[13px] transition cursor-pointer ${
                      isActive
                        ? "border border-indigo-500/60 bg-indigo-950/50 font-bold text-indigo-300 shadow-sm"
                        : "text-slate-300 hover:bg-[#0e1428] hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>

                    {liveBadge ? (
                      <span className="rounded bg-cyan-950 px-2 py-0.5 text-[9px] font-bold text-cyan-300 border border-cyan-700 animate-pulse font-mono">
                        {liveBadge}
                      </span>
                    ) : item.badge ? (
                      <span className="rounded bg-indigo-600 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase font-mono">
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* TOOLS, MCP & CONTROL */}
          <div className="flex flex-col gap-1">
            <span className="px-2.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              TOOLS, MCP &amp; CONTROL
            </span>
            <nav className="mt-1 flex flex-col gap-0.5">
              {[
                { id: "tools", label: "Tools Gateway (Gmail)", icon: "🔧" },
                { id: "mcp", label: "MCP Registry (2)", icon: "🔌" },
                {
                  id: "approvals",
                  label: `Approval Inbox (${pendingApprovalCount})`,
                  icon: "🛡️",
                  count: String(pendingApprovalCount),
                },
                { id: "capabilities", label: "Capabilities & Scope", icon: "🔑" },
                { id: "scheduler", label: "Scheduler & Triggers", icon: "⏰" },
                { id: "accounts", label: "Connected Accounts", icon: "👥" },
              ].map((item) => {
                const isActive = primaryNav === item.id;
                const liveBadge = getRunningBadge(item.id);

                return (
                  <button
                    key={item.id}
                    onClick={() => setPrimaryNav(item.id as PrimaryNav)}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-xs sm:text-[13px] transition cursor-pointer ${
                      isActive
                        ? "border border-indigo-500/60 bg-indigo-950/50 font-bold text-indigo-300 shadow-sm"
                        : "text-slate-300 hover:bg-[#0e1428] hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>

                    {liveBadge ? (
                      <span className="rounded bg-cyan-950 px-2 py-0.5 text-[9px] font-bold text-cyan-300 border border-cyan-700 animate-pulse font-mono">
                        {liveBadge}
                      </span>
                    ) : item.count && Number(item.count) > 0 ? (
                      <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/40 font-mono">
                        {item.count}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* OBSERVABILITY & AUDIT */}
          <div className="flex flex-col gap-1">
            <span className="px-2.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              OBSERVABILITY &amp; AUDIT
            </span>
            <nav className="mt-1 flex flex-col gap-0.5">
              {[
                { id: "evals", label: "Evaluations & Tests", icon: "🧪" },
                { id: "audit", label: "Audit Ledger (7 Stages)", icon: "📋" },
                { id: "observability", label: "Traces & Metrics", icon: "📊" },
                { id: "raw", label: "Raw State JSON", icon: "💾" },
                {
                  id: "runtime_secrets",
                  label: "Runtime & Secrets",
                  icon: "🔐",
                },
              ].map((item) => {
                const isActive = primaryNav === item.id;
                const liveBadge = getRunningBadge(item.id);

                return (
                  <button
                    key={item.id}
                    onClick={() => setPrimaryNav(item.id as PrimaryNav)}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-xs sm:text-[13px] transition cursor-pointer ${
                      isActive
                        ? "border border-indigo-500/60 bg-indigo-950/50 font-bold text-indigo-300 shadow-sm"
                        : "text-slate-300 hover:bg-[#0e1428] hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>

                    {liveBadge ? (
                      <span className="rounded bg-cyan-950 px-2 py-0.5 text-[9px] font-bold text-cyan-300 border border-cyan-700 animate-pulse font-mono">
                        {liveBadge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Developer Profile Card */}
      <div className="mt-4 rounded-xl border border-[#151c33] bg-[#090d1f] p-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-full bg-emerald-950 font-mono text-xs font-bold text-emerald-400 border border-emerald-800">
            N
          </div>
          <div className="truncate">
            <div className="font-semibold text-slate-100 truncate">
              Nelson (Developer)
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              Single-User Dev Mode
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
