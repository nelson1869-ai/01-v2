"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ClientChatExperience } from "../simulation-intended-server-data/frontend/client";
import type { PrimaryNav } from "../simulation-intended-server-data/contracts";
import type { ScenarioId } from "../simulation-intended-server-data/scenarios";

export default function ClientPage() {
  const router = useRouter();
  const [, setActiveScenarioId] = useState<ScenarioId>("ask-1");

  const handleNav = (nav: PrimaryNav) => {
    if (nav === "pipeline") {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#050711] p-3 sm:p-6 flex flex-col items-center justify-center font-sans antialiased text-slate-200 selection:bg-indigo-600 selection:text-white">
      <div className="w-full max-w-5xl flex flex-col gap-3">
        {/* Top Minimal Navigation Bar */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white shadow-md shadow-indigo-600/40">
              ✦
            </div>
            <div>
              <span className="text-sm font-bold text-white tracking-tight">
                AutoDo Assistant Portal
              </span>
              <span className="ml-2 rounded bg-indigo-950 px-2 py-0.5 text-[10px] font-mono font-bold text-indigo-300 border border-indigo-800">
                CLIENT VIEW
              </span>
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-lg border border-[#1b2545] bg-[#090d1f] px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:border-indigo-500 hover:bg-[#10172e] transition"
          >
            <span>⚡ Developer Lab (18 Layers)</span>
            <span>➔</span>
          </Link>
        </div>

        {/* Client Interactive Assistant UI */}
        <ClientChatExperience
          setPrimaryNav={handleNav}
          setActiveScenarioId={setActiveScenarioId}
        />
      </div>
    </div>
  );
}
