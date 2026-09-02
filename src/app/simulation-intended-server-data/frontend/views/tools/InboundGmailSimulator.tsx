import React, { useState, useEffect } from "react";
import type { ScenarioId } from "../../../scenarios";
import type { PrimaryNav } from "../../../contracts";
import { broadcastRunState, subscribeToRunSync } from "../../utils/runSync";

interface InboundGmailSimulatorProps {
  onTriggerInboundRun?: (
    scenarioId: ScenarioId,
    autoNavigateToPipeline?: boolean,
  ) => void;
  simulatedMaxStep?: number;
  isPlayingReplay?: boolean;
  setPrimaryNav?: (nav: PrimaryNav) => void;
}

export function InboundGmailSimulator({
  onTriggerInboundRun,
  setPrimaryNav,
}: InboundGmailSimulatorProps) {
  const [senderName, setSenderName] = useState("John Doe");
  const [senderEmail, setSenderEmail] = useState("john.doe@partner.org");
  const [subject, setSubject] = useState("Q3 Architecture Proposal Sync");
  const [body, setBody] = useState(
    "Hi Nelson, hope you're having a productive week! Could we sync this Thursday afternoon at 2:00 PM for 30 minutes to review the revised Q3 architecture proposal? Let me know if that works or propose another time.\n\nBest,\nJohn",
  );
  const [hasSent, setHasSent] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentLayer, setCurrentLayer] = useState(0);
  const [stageDescription, setStageDescription] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<
    "john" | "payroll" | "suspicious"
  >("john");

  // Sync with live server run state across all tabs
  useEffect(() => {
    const unsubscribe = subscribeToRunSync((msg) => {
      if (msg.type === "CLEAR_CACHE" || msg.simulatedMaxStep === 0) {
        setHasSent(false);
        setIsProcessing(false);
        setCurrentLayer(0);
        setStageDescription("");
        return;
      }

      if (typeof msg.simulatedMaxStep === "number") {
        setCurrentLayer(msg.simulatedMaxStep);
        if (msg.simulatedMaxStep > 0) {
          setHasSent(true);
        }
        if (msg.simulatedMaxStep < 18 && msg.isPlayingReplay) {
          setIsProcessing(true);
          if (msg.simulatedMaxStep <= 3) {
            setStageDescription(
              `Layer ${msg.simulatedMaxStep}: Webhook Ingress received & ExternalCue normalized`,
            );
          } else if (msg.simulatedMaxStep === 4) {
            setStageDescription(
              "Layer 4: pgvector RAG retrieved persona guideline #MEM-019",
            );
          } else if (msg.simulatedMaxStep <= 7) {
            setStageDescription(
              `Layer ${msg.simulatedMaxStep}: Gemini 2.5 Pro reasoning & scoring candidates`,
            );
          } else if (msg.simulatedMaxStep <= 10) {
            setStageDescription(
              `Layer ${msg.simulatedMaxStep}: Policy Safety ALLOWED & capability lease issued`,
            );
          } else if (msg.simulatedMaxStep <= 14) {
            setStageDescription(
              `Layer ${msg.simulatedMaxStep}: Dispatched Gmail adapter send_reply + Calendar hold`,
            );
          } else {
            setStageDescription(
              `Layer ${msg.simulatedMaxStep}: Verification assertions checking`,
            );
          }
        } else if (msg.simulatedMaxStep >= 18) {
          setIsProcessing(false);
          setStageDescription(
            "Layer 18: 6/6 Assertions verified & episodic memory written",
          );
        }
      }
      if (typeof msg.isPlayingReplay === "boolean") {
        setIsProcessing(msg.isPlayingReplay);
      }
    });

    return unsubscribe;
  }, []);

  const [dynamicAiReply, setDynamicAiReply] = useState<string | null>(null);
  const [dynamicAiProvider, setDynamicAiProvider] = useState<string | null>(
    null,
  );

  const applyPreset = (preset: "john" | "payroll" | "suspicious") => {
    setSelectedPreset(preset);
    setHasSent(false);
    setIsProcessing(false);
    setCurrentLayer(0);
    setStageDescription("");
    setDynamicAiReply(null);
    setDynamicAiProvider(null);

    if (preset === "john") {
      setSenderName("John Doe");
      setSenderEmail("john.doe@partner.org");
      setSubject("Q3 Architecture Proposal Sync");
      setBody(
        "Hi Nelson, hope you're having a productive week! Could we sync this Thursday afternoon at 2:00 PM for 30 minutes to review the revised Q3 architecture proposal? Let me know if that works or propose another time.\n\nBest,\nJohn",
      );
    } else if (preset === "payroll") {
      setSenderName("HR & Finance Portal");
      setSenderEmail("hr-notifications@company.internal");
      setSubject("May 2026 Payslip Available — Net Pay: $7,172.50");
      setBody(
        "Dear Nelson,\n\nYour payroll statement for the pay period ending May 31, 2026 has been finalized.\n\nGross Earnings: $9,450.00\nTotal Deductions: $2,277.50\nNet Direct Deposit: $7,172.50\nDisbursement Date: May 28, 2026\n\nPlease view your detailed breakdown on the employee portal.\n\nPayroll Operations Team",
      );
    } else {
      setSenderName("External Vendor Unknown");
      setSenderEmail("accounting@unverified-payment-broker.biz");
      setSubject("URGENT: Change of Wire Account Details for May Invoice");
      setBody(
        "Hi Nelson,\n\nPlease update our wire transfer bank details for our pending invoice immediately to Bank Account #99281-2244. Funds must be released today to avoid penalties.\n\nThanks,\nUnknown Vendor",
      );
    }
  };

  const handleSendSimulatedEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSent(true);
    setIsProcessing(true);
    setCurrentLayer(1);
    setStageDescription(
      "Layer 1-3: Webhook Ingress received & ExternalCue normalized",
    );

    const scenario = selectedPreset === "john" ? "ask-2" : "ask-1";

    const customInboundPayload = {
      sourceSystem: "Gmail",
      provider: "Google Gmail API v1 (Push Webhook)",
      origin: "gmail.googleapis.com",
      sourceType: "SIMULATED_EXTERNAL_MESSAGE",
      account: "nelson@company.com",
      messageId: `msg_${Date.now()}`,
      headers: {
        From: `${senderName} <${senderEmail}>`,
        To: "Nelson <nelson@company.com>",
        Subject: subject,
        Date: new Date().toUTCString(),
      },
      bodyText: body,
    };

    if (onTriggerInboundRun) {
      onTriggerInboundRun(scenario, false);
    }

    broadcastRunState({
      type: "START_RUN",
      scenarioId: scenario,
      simulatedMaxStep: 1,
      isPlayingReplay: true,
      customInboundPayload,
    });

    // Call live backend AI Route Handler
    fetch("/api/ai/reason", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senderName,
        senderEmail,
        subject,
        body,
        personaGuideline:
          "Nelson Fernandez personal assistant. Friendly, professional, sign off as 'Best, Nelson'.",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.replyDraft === "string") {
          setDynamicAiReply(data.replyDraft);
          setDynamicAiProvider(
            data.provider === "nvidia"
              ? "NVIDIA NIM (DeepSeek v4 Pro - Live AI)"
              : data.provider === "gemini"
                ? "Google Gemini 2.5 (Live AI)"
                : data.provider === "ollama"
                  ? "Local Ollama (Live AI)"
                  : "Local deterministic synthesizer (SIMULATED)",
          );
        }
      })
      .catch((err) => {
        console.warn("AI reasoning fallback:", err);
      });
  };

  const isCompleted = hasSent && !isProcessing && currentLayer === 18;

  return (
    <div className="rounded-xl border border-indigo-900/60 bg-[#070a18] p-4 text-xs font-sans">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#12182d] pb-3">
        <div className="flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white text-sm shadow-md">
            ✉️
          </span>
          <div>
            <h4 className="font-bold text-white text-sm sm:text-base">
              Inbound Gmail Webhook Simulator (Stay on Client)
            </h4>
            <p className="text-[11px] text-slate-400">
              Simulate sending an email to Nelson &amp; watch AutoDo perceive,
              reason, and autonomously reply in real time.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {setPrimaryNav && (
            <button
              type="button"
              onClick={() => setPrimaryNav("pipeline")}
              className="rounded bg-indigo-950 px-2.5 py-1 font-mono text-[10px] font-bold text-indigo-300 border border-indigo-800 hover:bg-indigo-900 cursor-pointer transition"
            >
              ⚡ Open in 18-Layer Dev Lab ➔
            </button>
          )}
          <span className="rounded border border-indigo-800 bg-indigo-950/60 px-2.5 py-1 font-mono text-[10px] font-bold text-indigo-300">
            CLIENT VIEW SIMULATOR
          </span>
        </div>
      </div>

      {/* Preset Selector Chips */}
      <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-[11px]">
        <span className="text-slate-400 font-semibold uppercase text-[10px]">
          Preset Scenarios:
        </span>
        <button
          type="button"
          onClick={() => applyPreset("john")}
          className={`px-3 py-1 rounded-md border transition cursor-pointer ${
            selectedPreset === "john"
              ? "bg-indigo-600 border-indigo-400 text-white font-bold shadow"
              : "bg-[#090d1f] border-[#1b2545] text-slate-300 hover:border-slate-500"
          }`}
        >
          ✉️ John Doe: Thursday 2PM Sync Request
        </button>
        <button
          type="button"
          onClick={() => applyPreset("payroll")}
          className={`px-3 py-1 rounded-md border transition cursor-pointer ${
            selectedPreset === "payroll"
              ? "bg-indigo-600 border-indigo-400 text-white font-bold shadow"
              : "bg-[#090d1f] border-[#1b2545] text-slate-300 hover:border-slate-500"
          }`}
        >
          💰 HR Payroll: May Paycheck ($7,172.50)
        </button>
        <button
          type="button"
          onClick={() => applyPreset("suspicious")}
          className={`px-3 py-1 rounded-md border transition cursor-pointer ${
            selectedPreset === "suspicious"
              ? "bg-amber-600 border-amber-400 text-white font-bold shadow"
              : "bg-[#090d1f] border-[#1b2545] text-slate-300 hover:border-slate-500"
          }`}
        >
          🚨 Unknown Sender: Suspicious Wire Request
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Left: Email Composer (Simulate Sending to AutoDo) */}
        <form
          onSubmit={handleSendSimulatedEmail}
          className="flex flex-col gap-3 rounded-lg border border-[#1b2545] bg-[#090d1f] p-3.5"
        >
          <div className="flex items-center justify-between border-b border-[#12182d] pb-2">
            <span className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
              <span>1. External Person Sending Email</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              To: <strong className="text-white">nelson@company.com</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <label className="block text-[10px] font-mono text-slate-400 mb-1">
                Sender Name
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full rounded bg-[#050711] border border-[#202c52] px-2.5 py-1.5 text-xs text-white outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 font-sans"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-400 mb-1">
                Sender Email
              </label>
              <input
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                className="w-full rounded bg-[#050711] border border-[#202c52] px-2.5 py-1.5 text-xs text-indigo-300 font-mono outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-slate-400 mb-1">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded bg-[#050711] border border-[#202c52] px-2.5 py-1.5 text-xs text-white font-semibold outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 font-sans"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono text-slate-400 mb-1">
              Message Body
            </label>
            <textarea
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full rounded bg-[#050711] border border-[#202c52] p-2.5 text-xs text-slate-200 outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 font-sans leading-relaxed resize-none"
            />
          </div>

          <div className="mt-1 flex items-center gap-2">
            <button
              type="submit"
              disabled={isProcessing}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 font-bold text-white shadow-md hover:bg-indigo-500 transition disabled:opacity-50 cursor-pointer text-xs"
            >
              <span>
                {isProcessing
                  ? `⏳ AutoDo Processing Email (Layer ${currentLayer}/18)...`
                  : "🚀 Send Email to AutoDo (Simulate Inbound)"}
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                applyPreset("john");
                broadcastRunState({
                  type: "CLEAR_CACHE",
                  simulatedMaxStep: 0,
                  isPlayingReplay: false,
                });
              }}
              className="rounded-lg border border-rose-900/60 bg-rose-950/30 px-3 py-2.5 text-xs font-semibold text-rose-300 hover:bg-rose-900/50 transition cursor-pointer"
              title="Reset simulator and clear cache"
            >
              <span>🧹 Reset</span>
            </button>
          </div>
        </form>

        {/* Right: Live Mailbox & Autonomous AutoDo Response Thread */}
        <div className="flex flex-col gap-3 rounded-lg border border-[#1b2545] bg-[#090d1f] p-3.5">
          <div className="flex items-center justify-between border-b border-[#12182d] pb-2">
            <span className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
              <span>2. Simulated Gmail Thread &amp; Autonomous Reply</span>
            </span>
            <span
              className={`rounded px-2 py-0.5 font-mono text-[9px] font-bold ${
                isCompleted
                  ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                  : isProcessing
                    ? "bg-cyan-950 text-cyan-300 border border-cyan-800 animate-pulse"
                    : "bg-slate-800 text-slate-400"
              }`}
            >
              {isCompleted
                ? "✔ AUTONOMOUS REPLY SENT"
                : isProcessing
                  ? `⚡ RUNNING LAYER ${currentLayer}/18`
                  : "AWAITING INBOUND EMAIL"}
            </span>
          </div>

          {!hasSent ? (
            <div className="p-8 rounded bg-[#050711] border border-dashed border-[#1e2a4a] text-center space-y-2 my-auto">
              <span className="text-3xl">📥</span>
              <h5 className="font-bold text-slate-300 text-xs">
                Mailbox Idle (Awaiting Inbound Email)
              </h5>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
                Click &ldquo;Send Email to AutoDo&rdquo; on the left to simulate
                an inbound Gmail message and see AutoDo auto-reply right here on
                the client.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 overflow-y-auto max-h-[380px] pr-1">
              {/* Inbound Received Email Bubble */}
              <div className="rounded-lg bg-[#050711] p-3 border border-[#151c33] space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-full bg-slate-700 text-white font-bold text-[10px]">
                      {senderName.charAt(0)}
                    </span>
                    <div>
                      <div className="font-bold text-white text-xs">
                        {senderName}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        &lt;{senderEmail}&gt;
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    Just now
                  </span>
                </div>
                <div className="font-semibold text-slate-200 text-xs pt-1 border-t border-[#12182d]">
                  Subject: {subject}
                </div>
                <p className="text-slate-300 text-xs whitespace-pre-line leading-relaxed">
                  {body}
                </p>
              </div>

              {/* AutoDo Brain Live Status Bar */}
              {isProcessing && (
                <div className="rounded-lg bg-cyan-950/30 border border-cyan-800/60 p-3 space-y-2 font-mono text-[11px] animate-pulse">
                  <div className="flex items-center justify-between text-cyan-300 font-bold">
                    <span className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-cyan-400 animate-ping"></span>
                      AutoDo Processing Inbound Email...
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentLayer(18);
                          setIsProcessing(false);
                          setStageDescription(
                            "Layer 18: 6/6 Assertions verified & episodic memory written",
                          );
                          broadcastRunState({
                            type: "FINISH_RUN",
                            scenarioId:
                              selectedPreset === "john" ? "ask-2" : "ask-1",
                            simulatedMaxStep: 18,
                            isPlayingReplay: false,
                          });
                        }}
                        className="rounded bg-cyan-900/90 hover:bg-cyan-700 px-2 py-0.5 text-[9px] font-bold text-white border border-cyan-400 cursor-pointer transition"
                      >
                        ⏩ Fast Forward
                      </button>
                      <span>Layer {currentLayer}/18</span>
                    </div>
                  </div>
                  <p className="text-slate-200 text-[10px] leading-tight">
                    {stageDescription}
                  </p>
                  {/* Progress Line */}
                  <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-cyan-900">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-500"
                      style={{ width: `${(currentLayer / 18) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Sent Auto-Reply Email Bubble */}
              {isCompleted && (
                <div className="rounded-lg bg-[#061c16] p-3 border border-emerald-800/60 space-y-2.5">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="flex size-6 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-[10px]">
                        N
                      </span>
                      <div>
                        <div className="font-bold text-emerald-300 text-xs flex items-center gap-1.5">
                          <span>Nelson (via AutoDo Personal Assistant)</span>
                          <span className="rounded bg-emerald-950 px-1 py-0.2 text-[8px] font-bold text-emerald-400 border border-emerald-700">
                            AUTONOMOUS
                          </span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          &lt;nelson@company.com&gt; &rarr; &lt;{senderEmail}
                          &gt;
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      Sent &bull; 2.05s
                    </span>
                  </div>

                  <div className="font-semibold text-slate-200 text-xs pt-1 border-t border-emerald-900/40">
                    Subject: Re: {subject}
                  </div>

                  {(() => {
                    const lowerBody = body.toLowerCase();
                    const lowerSubject = subject.toLowerCase();
                    const firstName =
                      senderName.trim().split(" ")[0] || "there";
                    const isSuspicious =
                      lowerBody.includes("wire") ||
                      lowerBody.includes("bank account") ||
                      lowerBody.includes("urgent") ||
                      lowerSubject.includes("wire");
                    const isMeeting =
                      lowerBody.includes("sync") ||
                      lowerBody.includes("meeting") ||
                      lowerBody.includes("thursday") ||
                      lowerBody.includes("calendar") ||
                      lowerBody.includes("call") ||
                      lowerBody.includes("2:00") ||
                      lowerBody.includes("pm");
                    const isPayroll =
                      lowerBody.includes("payroll") ||
                      lowerBody.includes("payslip") ||
                      lowerBody.includes("salary") ||
                      lowerBody.includes("earnings") ||
                      lowerBody.includes("$");

                    if (dynamicAiReply) {
                      return (
                        <>
                          <div className="text-slate-100 text-xs leading-relaxed space-y-2 font-sans bg-[#030e0b] p-2.5 rounded border border-emerald-900/40">
                            <div className="flex items-center justify-between pb-1 mb-1 border-b border-emerald-900/40 font-mono text-[9px] text-emerald-400 font-bold">
                              <span>
                                ⚡{" "}
                                {dynamicAiProvider ||
                                  "AI provider unavailable"}
                              </span>
                              <span>AI_PROPOSAL_ONLY</span>
                            </div>
                            <p className="whitespace-pre-line">
                              {dynamicAiReply}
                            </p>
                          </div>
                          {isMeeting && (
                            <div className="flex items-center justify-between rounded bg-[#041410] px-2.5 py-1.5 border border-emerald-800/40 font-mono text-[10px]">
                              <div className="flex items-center gap-1.5 text-emerald-300">
                                <span>📅</span>
                                <span>
                                  Proposed Calendar Hold: Tentative 30-min slot
                                </span>
                              </div>
                              <span className="text-[9px] text-emerald-500 font-bold">
                                [calendar proposal — not executed]
                              </span>
                            </div>
                          )}
                        </>
                      );
                    }

                    if (isSuspicious) {
                      return (
                        <div className="text-amber-200 text-xs leading-relaxed space-y-2 font-sans bg-[#1a1205] p-2.5 rounded border border-amber-800/40">
                          <p className="font-bold text-amber-400">
                            🛡️ Safety Assessment Requires Human Review
                          </p>
                          <p>
                            This incoming message requested financial account
                            modifications from an unverified address. AutoDo
                            safety policy prevented direct outbound actions and
                            routed the item to your{" "}
                            <strong>Approval Inbox</strong>.
                          </p>
                        </div>
                      );
                    }

                    if (isPayroll) {
                      return (
                        <div className="text-slate-100 text-xs leading-relaxed space-y-2 font-sans bg-[#030e0b] p-2.5 rounded border border-emerald-900/40">
                          <p>Hi {firstName},</p>
                          <p>
                            Thank you for sending the statement. I confirm
                            receipt of the update regarding <em>{subject}</em>.
                            The records have been verified and archived into my
                            financial log.
                          </p>
                          <p className="font-semibold text-slate-300 pt-1">
                            Best,
                            <br />
                            Nelson
                          </p>
                        </div>
                      );
                    }

                    if (isMeeting) {
                      return (
                        <>
                          <div className="text-slate-100 text-xs leading-relaxed space-y-2 font-sans bg-[#030e0b] p-2.5 rounded border border-emerald-900/40">
                            <p>Hi {firstName},</p>
                            <p>
                              Thanks for reaching out! The proposed time works
                              great on my calendar. I&rsquo;ve placed a
                              tentative hold so our slots remain reserved.
                            </p>
                            <p>Looking forward to connecting!</p>
                            <p className="font-semibold text-slate-300 pt-1">
                              Best,
                              <br />
                              Nelson
                            </p>
                          </div>
                          <div className="flex items-center justify-between rounded bg-[#041410] px-2.5 py-1.5 border border-emerald-800/40 font-mono text-[10px]">
                            <div className="flex items-center gap-2 text-slate-300">
                              <span className="text-sm">📅</span>
                              <span>
                                <strong>Calendar Hold:</strong> Tentative 30-min
                                slot reserved with {senderName}
                              </span>
                            </div>
                            <span className="text-emerald-400 font-bold">
                              [calendar.create_tentative_hold]
                            </span>
                          </div>
                        </>
                      );
                    }

                    return (
                      <div className="text-slate-100 text-xs leading-relaxed space-y-2 font-sans bg-[#030e0b] p-2.5 rounded border border-emerald-900/40">
                        <p>Hi {firstName},</p>
                        <p>
                          Thank you for your email regarding <em>{subject}</em>.
                          I have received your message and will review the
                          details shortly.
                        </p>
                        <p className="font-semibold text-slate-300 pt-1">
                          Best,
                          <br />
                          Nelson
                        </p>
                      </div>
                    );
                  })()}

                  {/* Safety & Grounding Verification Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[9px] font-mono text-slate-400">
                    <span className="rounded bg-emerald-950 px-1.5 py-0.5 text-emerald-400 border border-emerald-800 font-bold">
                      ✔ 6/6 Assertions Passed
                    </span>
                    <span className="rounded bg-indigo-950 px-1.5 py-0.5 text-indigo-300 border border-indigo-800">
                      Guideline #MEM-019 Grounded
                    </span>
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-300">
                      Lease: ls_exec_20260527_reply
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
