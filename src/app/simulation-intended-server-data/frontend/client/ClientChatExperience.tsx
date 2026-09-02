"use client";

import React, { useState } from "react";
import type { AiProviderAttempt, AiSafetyEvaluation } from "@/ai/contracts";
import type { PrimaryNav } from "../../contracts";
import {
  type ScenarioId,
  ASK_1_SCENARIO,
  ASK_2_SCENARIO,
} from "../../scenarios";
import { payrollPayslipMay2026 } from "../../like-real-massage";

import { InboundGmailSimulator } from "../views/tools/InboundGmailSimulator";
import { broadcastRunState, subscribeToRunSync } from "../utils/runSync";

interface ClientChatExperienceProps {
  setPrimaryNav: (nav: PrimaryNav) => void;
  setActiveScenarioId: (id: ScenarioId) => void;
}

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  timestamp: string;
  text?: string;
  scenarioId?: ScenarioId;
  type?: "digest" | "autoreply" | "payroll" | "generic";
  providerUsed?: string;
  reasoningSummary?: string;
  providerAttempts?: AiProviderAttempt[];
  safetyEvaluation?: AiSafetyEvaluation;
  pipelineSummary?: {
    intent: string;
    toolUsed: string;
    policyStatus: string;
    verifiedAssertions: string;
    traceId: string;
  };
}

export function ClientChatExperience({
  setPrimaryNav,
  setActiveScenarioId,
}: ClientChatExperienceProps) {
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>("");
  const [clientTab, setClientTab] = useState<"chat" | "simulator">("chat");
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg_welcome",
      sender: "assistant",
      timestamp: "10:30 AM",
      text: "Hello Nelson! I am the AutoDo V1 prototype. I can simulate Gmail and calendar workflows and generate AI reply proposals. No external action occurs unless a real authorized adapter reports it.",
      type: "generic",
    },
  ]);

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isProcessing, currentStep]);

  // Sync cross-tab run state
  React.useEffect(() => {
    const unsubscribe = subscribeToRunSync((msg) => {
      if (
        msg.type === "FINISH_RUN" ||
        msg.type === "CLEAR_CACHE" ||
        (msg.simulatedMaxStep && msg.simulatedMaxStep >= 18)
      ) {
        setIsProcessing(false);
        setCurrentStep("");
      }
    });
    return unsubscribe;
  }, []);

  const handleSendPrompt = (promptText: string) => {
    const cleanPrompt = promptText.trim();
    if (!cleanPrompt || isProcessing) return;

    const userMsgId = `user_${Date.now()}`;
    const userMessage: ChatMessage = {
      id: userMsgId,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      text: cleanPrompt,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsProcessing(true);

    // Check if user clicked an explicit canonical preset button
    const isExplicitAsk1Digest = cleanPrompt.startsWith("Ask 1: Summarize");
    const isExplicitAsk2Reply = cleanPrompt.startsWith("Ask 2: Auto-reply");
    const isExplicitPayroll = cleanPrompt.startsWith(
      "Ask 1: Check May Payroll",
    );

    if (isExplicitAsk1Digest) {
      setActiveScenarioId("ask-1");
      broadcastRunState({
        type: "START_RUN",
        scenarioId: "ask-1",
        simulatedMaxStep: 1,
        isPlayingReplay: true,
      });
      setCurrentStep(
        "1. Ingress & Context: Summarizing unread morning messages...",
      );
      setTimeout(() => {
        setIsProcessing(false);
        setCurrentStep("");
        setMessages((prev) => [
          ...prev,
          {
            id: `asst_${Date.now()}`,
            sender: "assistant",
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            scenarioId: "ask-1",
            type: "digest",
            pipelineSummary: {
              intent: "EMAIL_SUMMARIZATION",
              toolUsed: "gmail.list_messages (Read-Only)",
              policyStatus: "SIMULATED ALLOW (Read-Only Policy)",
              verifiedAssertions: `${ASK_1_SCENARIO.response.assertionsPassed} / ${ASK_1_SCENARIO.response.assertionsTotal} PASSED`,
              traceId: ASK_1_SCENARIO.metadata.traceId,
            },
          },
        ]);
      }, 1500);
      return;
    }

    if (isExplicitAsk2Reply) {
      setActiveScenarioId("ask-2");
      broadcastRunState({
        type: "START_RUN",
        scenarioId: "ask-2",
        simulatedMaxStep: 1,
        isPlayingReplay: true,
      });
      setCurrentStep(
        "1. Ingress & Context: Generating auto-reply & calendar hold...",
      );
      setTimeout(() => {
        setIsProcessing(false);
        setCurrentStep("");
        setMessages((prev) => [
          ...prev,
          {
            id: `asst_${Date.now()}`,
            sender: "assistant",
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            scenarioId: "ask-2",
            type: "autoreply",
            pipelineSummary: {
              intent: "ACT_AS_USER_AUTO_REPLY",
              toolUsed: "Proposed gmail.send_reply + calendar hold (SIMULATED)",
              policyStatus: "SIMULATED ALLOW_WITH_AUDIT (#MEM-019)",
              verifiedAssertions: `${ASK_2_SCENARIO.response.assertionsPassed} / ${ASK_2_SCENARIO.response.assertionsTotal} PASSED`,
              traceId: ASK_2_SCENARIO.metadata.traceId,
            },
          },
        ]);
      }, 1500);
      return;
    }

    if (isExplicitPayroll) {
      setActiveScenarioId("ask-1");
      setCurrentStep("1. Querying payroll database record...");
      setTimeout(() => {
        setIsProcessing(false);
        setCurrentStep("");
        setMessages((prev) => [
          ...prev,
          {
            id: `asst_${Date.now()}`,
            sender: "assistant",
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            scenarioId: "ask-1",
            type: "payroll",
            pipelineSummary: {
              intent: "PAYROLL_STATUS_INQUIRY",
              toolUsed: "gmail.list_messages (HR Message #msg_hr_01)",
              policyStatus: "SIMULATED ALLOW (Read-Only Policy)",
              verifiedAssertions: `${ASK_1_SCENARIO.response.assertionsPassed} / ${ASK_1_SCENARIO.response.assertionsTotal} PASSED`,
              traceId: ASK_1_SCENARIO.metadata.traceId,
            },
          },
        ]);
      }, 1500);
      return;
    }

    // Dynamic Live AI Response for ANY custom text / greeting
    setCurrentStep(
      "⚡ AutoDo AI Brain: Reasoning with NVIDIA DeepSeek / Gemini...",
    );

    const customChatPayload = {
      sourceSystem: "Client Chat",
      provider: "AutoDo Executive Assistant Chat",
      origin: "http://localhost:3000/client",
      sourceType: "USER_INTERACTIVE_PROMPT",
      account: "nelson@company.com",
      messageId: `chat_${Date.now()}`,
      headers: {
        From: "Nelson Fernandez <dev@autodo.ai>",
        To: "AutoDo Brain <ai@autodo.internal>",
        Subject: cleanPrompt,
        Date: new Date().toUTCString(),
      },
      bodyText: cleanPrompt,
    };

    broadcastRunState({
      type: "START_RUN",
      scenarioId: "ask-1",
      simulatedMaxStep: 1,
      isPlayingReplay: true,
      customInboundPayload: customChatPayload,
    });

    fetch("/api/ai/reason", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senderName: "Nelson Fernandez",
        senderEmail: "dev@autodo.ai",
        subject: "Executive Assistant Chat Prompt",
        body: cleanPrompt,
        personaGuideline:
          "Nelson's executive AI assistant. Friendly, professional, helpful, concise.",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsProcessing(false);
        setCurrentStep("");
        const providerName =
          data.provider === "nvidia"
            ? "NVIDIA DeepSeek v4 Pro (Live AI)"
            : data.provider === "gemini"
              ? "Google Gemini 2.5 (Live AI)"
              : data.provider === "ollama"
                ? "Local Ollama (Live AI)"
                : "AutoDo Persona Synthesizer";

        setMessages((prev) => [
          ...prev,
          {
            id: `asst_${Date.now()}`,
            sender: "assistant",
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            text:
              data.replyDraft ||
              `Hello Nelson! How can I assist you with your schedule, inbox, or tasks today?`,
            type: "generic",
            providerUsed: providerName,
            reasoningSummary: data.reasoningSummary,
            providerAttempts: Array.isArray(data.providerAttempts)
              ? data.providerAttempts
              : undefined,
            safetyEvaluation:
              data.safetyEvaluation && typeof data.safetyEvaluation === "object"
                ? data.safetyEvaluation
                : undefined,
          },
        ]);
      })
      .catch((err) => {
        console.warn("Chat AI route fallback triggered:", err);
        setIsProcessing(false);
        setCurrentStep("");

        const lower = cleanPrompt.toLowerCase();
        const isGreeting =
          lower.includes("hello") ||
          lower.includes("hi") ||
          lower.includes("hey");

        const fallbackText = isGreeting
          ? `Hello Nelson! How can I assist you today with your inbox, calendar, or tasks?`
          : `I received your request regarding "${cleanPrompt}". This fallback can propose a response but cannot execute external actions.`;

        setMessages((prev) => [
          ...prev,
          {
            id: `asst_${Date.now()}`,
            sender: "assistant",
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            text: fallbackText,
            type: "generic",
            providerUsed: "AutoDo AI Engine",
          },
        ]);
      });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] w-full rounded-2xl border border-[#151c33] bg-[#070a18] overflow-hidden shadow-2xl">
      {/* Client Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#151c33] bg-[#090d1f] px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-600 text-base font-bold text-white shadow-lg shadow-indigo-600/40">
            🤖
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white">
                AutoDo Personal Executive Assistant
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-800">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Acting for:{" "}
              <strong className="text-slate-200">
                {payrollPayslipMay2026.employee.name} (
                {payrollPayslipMay2026.employee.email})
              </strong>{" "}
              · Model:{" "}
              <span className="text-indigo-300 font-semibold">
                Gemini 2.5 Pro
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg bg-[#050711] p-1 border border-[#151c33] text-xs font-semibold">
            <button
              onClick={() => setClientTab("chat")}
              className={`px-3 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
                clientTab === "chat"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>💬</span> Chat with AutoDo
            </button>
            <button
              onClick={() => setClientTab("simulator")}
              className={`px-3 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
                clientTab === "simulator"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>✉️</span> Inbound Gmail Simulator
            </button>
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
              setMessages([
                {
                  id: "msg_welcome",
                  sender: "assistant",
                  timestamp: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  text: "Hello Nelson! All UI/UX session cache and conversation history have been deleted. How can I help you today?",
                  type: "generic",
                },
              ]);
              setIsProcessing(false);
              setCurrentStep("");
            }}
            title="Delete all temporary conversation artifacts, cached state, and reset assistant"
            className="flex items-center gap-1.5 rounded-lg border border-rose-900/60 bg-rose-950/30 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-900/50 transition cursor-pointer"
          >
            <span>🧹</span> Clear Cache
          </button>
          <button
            onClick={() => setPrimaryNav("pipeline")}
            className="flex items-center gap-1.5 rounded-lg border border-indigo-500/60 bg-indigo-950/40 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-900/50 transition cursor-pointer"
          >
            <span>⚡</span> Open 18-Layer Dev Lab
          </button>
        </div>
      </div>

      {/* Simulator Tab Content */}
      {clientTab === "simulator" ? (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#04060f]">
          <InboundGmailSimulator
            onTriggerInboundRun={(scenarioId) => {
              setActiveScenarioId(scenarioId);
            }}
            setPrimaryNav={setPrimaryNav}
          />
        </div>
      ) : (
        <>
          {/* Message Chat Feed */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 font-sans text-xs sm:text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span className="font-semibold text-xs text-slate-400">
                    {msg.sender === "user"
                      ? `You (${payrollPayslipMay2026.employee.name})`
                      : "AutoDo Brain"}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {msg.timestamp}
                  </span>
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-2xl rounded-2xl p-4 shadow-md ${
                    msg.sender === "user"
                      ? "bg-indigo-600 text-white rounded-tr-none font-medium text-xs sm:text-sm"
                      : "bg-[#0c1228] border border-[#1b2545] text-slate-200 rounded-tl-none space-y-3"
                  }`}
                >
                  {msg.text && (
                    <p className="leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </p>
                  )}

                  {msg.providerUsed && (
                    <div className="pt-2 border-t border-[#1b2545]/60 flex flex-wrap items-center justify-between gap-1.5 text-[10px] font-mono text-emerald-400">
                      <span className="flex items-center gap-1 font-bold">
                        <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>⚡ {msg.providerUsed}</span>
                      </span>
                      {msg.reasoningSummary && (
                        <span
                          className="text-slate-400 truncate max-w-[280px]"
                          title={msg.reasoningSummary}
                        >
                          {msg.reasoningSummary}
                        </span>
                      )}
                    </div>
                  )}

                  {(msg.providerAttempts || msg.safetyEvaluation) && (
                    <details className="rounded border border-[#1b2545] bg-[#070a18] p-2 text-[10px] font-mono text-slate-300">
                      <summary className="cursor-pointer font-bold text-indigo-300">
                        Raw AI diagnostics
                      </summary>
                      <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words text-slate-400">
                        {JSON.stringify(
                          {
                            providerAttempts: msg.providerAttempts,
                            safetyEvaluation: msg.safetyEvaluation,
                          },
                          null,
                          2,
                        )}
                      </pre>
                    </details>
                  )}

                  {/* Rich Payload: Ask 1 (Email Digest directly from ASK_1_SCENARIO) */}
                  {msg.type === "digest" && (
                    <div className="space-y-3 font-sans">
                      <div className="flex items-center justify-between pb-2 border-b border-[#1b2545]">
                        <span className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                          <span>📬</span> Simulated Email Digest
                        </span>
                        <span className="rounded bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-800 font-mono uppercase">
                          SIMULATED
                        </span>
                      </div>

                      <ul className="list-disc pl-4 text-slate-200 space-y-1.5 text-xs sm:text-[13px] leading-relaxed">
                        {ASK_1_SCENARIO.response.bulletPoints.map(
                          (point, idx) => (
                            <li key={idx}>{point}</li>
                          ),
                        )}
                      </ul>

                      {/* Execution Badge & Dev Link */}
                      {msg.pipelineSummary && (
                        <div className="pt-2 border-t border-[#1b2545] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
                          <span>Tool: {msg.pipelineSummary.toolUsed}</span>
                          <button
                            onClick={() => {
                              setActiveScenarioId("ask-1");
                              setPrimaryNav("pipeline");
                            }}
                            className="text-indigo-400 font-bold hover:underline cursor-pointer"
                          >
                            Inspect 18 Layers (Ask 1) ➔
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Rich Payload: Ask 2 simulated auto-reply proposal */}
                  {msg.type === "autoreply" && (
                    <div className="space-y-3 font-sans">
                      <div className="flex items-center justify-between pb-2 border-b border-[#1b2545]">
                        <span className="font-bold text-emerald-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                          <span>✉️</span> Simulated Auto-Reply Proposal
                        </span>
                        <span className="rounded bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-800 font-mono uppercase">
                          SIMULATED
                        </span>
                      </div>

                      <div className="p-3 rounded-lg bg-[#070a18] border border-emerald-900/60 space-y-2">
                        <div className="flex justify-between text-xs text-slate-300 border-b border-[#151c33] pb-1.5 font-mono">
                          <div>
                            To: <strong className="text-white">John Doe</strong>{" "}
                            &lt;john.doe@partner.org&gt;
                          </div>
                          <span className="text-indigo-300 text-[11px]">
                            Thread: thread_proposal_02
                          </span>
                        </div>
                        <div className="text-xs text-slate-300 font-mono">
                          Subject:{" "}
                          <strong>
                            Re: Proposal follow-up for Q3 Architecture
                          </strong>
                        </div>
                        <div className="rounded bg-[#04060f] p-3 text-slate-200 text-xs sm:text-sm font-sans leading-relaxed border border-[#151c33]">
                          &ldquo;Hi John,
                          <br />
                          <br />
                          Thanks for following up. The Q3 architecture proposal
                          draft looks very solid. I am free for a 15-minute sync
                          on <strong>Thursday at 2:00 PM (Asia/Manila)</strong>.
                          I&apos;ll send over a calendar invite.
                          <br />
                          <br />
                          Best,
                          <br />
                          Nelson&rdquo;
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs font-mono text-slate-300">
                          <span className="text-emerald-400">
                            Calendar proposal: Thu May 29, 2:00 PM – 2:15 PM
                          </span>
                          <span className="text-slate-400">
                            Policy fixture: ALLOW_WITH_AUDIT (#MEM-019)
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-amber-300">
                        Prototype only: no Gmail message was sent and no
                        Calendar event was created.
                      </p>

                      {msg.pipelineSummary && (
                        <div className="pt-2 border-t border-[#1b2545] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
                          <span>Trace: {msg.pipelineSummary.traceId}</span>
                          <button
                            onClick={() => {
                              setActiveScenarioId("ask-2");
                              setPrimaryNav("pipeline");
                            }}
                            className="text-indigo-400 font-bold hover:underline cursor-pointer"
                          >
                            Inspect 18 Layers (Ask 2) ➔
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Rich Payload: simulated payroll fixture */}
                  {msg.type === "payroll" && (
                    <div className="space-y-3 font-sans">
                      <div className="flex items-center justify-between pb-2 border-b border-[#1b2545]">
                        <span className="font-bold text-emerald-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                          <span>💵</span> {payrollPayslipMay2026.documentType}{" "}
                          (May 2026)
                        </span>
                        <span className="rounded bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-800 font-mono">
                          SIMULATED FIXTURE
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                        <div className="p-2.5 rounded bg-[#070a18] border border-[#151c33]">
                          <span className="text-slate-400 block text-[10px]">
                            Gross Earnings
                          </span>
                          <span className="text-white font-bold text-sm block mt-0.5">
                            $
                            {payrollPayslipMay2026.grossPay.currentTotal.toFixed(
                              2,
                            )}
                          </span>
                        </div>
                        <div className="p-2.5 rounded bg-[#070a18] border border-[#151c33]">
                          <span className="text-slate-400 block text-[10px]">
                            Taxes &amp; Deductions
                          </span>
                          <span className="text-rose-400 font-bold text-sm block mt-0.5">
                            -$
                            {payrollPayslipMay2026.totalDeductions.currentTotal.toFixed(
                              2,
                            )}
                          </span>
                        </div>
                        <div className="p-2.5 rounded bg-[#070a18] border border-emerald-900/60 bg-emerald-950/20">
                          <span className="text-emerald-300 block text-[10px]">
                            Net Pay Amount
                          </span>
                          <span className="text-emerald-400 font-bold text-sm block mt-0.5">
                            $
                            {payrollPayslipMay2026.netPay.currentNet.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300">
                        Employee:{" "}
                        <strong>{payrollPayslipMay2026.employee.name}</strong> (
                        {payrollPayslipMay2026.employee.jobTitle}) · Pay Date:{" "}
                        <strong>
                          {payrollPayslipMay2026.payPeriod.payDate}
                        </strong>
                        .
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Live Processing Pipeline Bar */}
            {isProcessing && (
              <div className="flex flex-col items-start gap-2 max-w-xl">
                <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 bg-[#090d1f] p-3 rounded-xl border border-indigo-800/60 shadow-lg animate-pulse w-full">
                  <span className="size-2 rounded-full bg-indigo-400 animate-ping"></span>
                  <span className="font-semibold">{currentStep}</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} aria-hidden="true" />
          </div>

          {/* Suggested Live AI Sample Prompts */}
          <div className="px-4 py-2.5 border-t border-[#12182d] bg-[#050711] flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">
              Live AI Suggestions:
            </span>
            <button
              onClick={() =>
                handleSendPrompt(
                  "Summarize my important unread morning emails.",
                )
              }
              className="px-3 py-1 rounded-full bg-[#0c1228] border border-[#1b2545] text-xs font-medium text-slate-200 hover:border-indigo-500 hover:text-white transition cursor-pointer"
            >
              📬 Summarize morning emails
            </button>
            <button
              onClick={() =>
                handleSendPrompt(
                  "Auto-reply to John Doe's proposal follow-up on Gmail proposing Thursday 2:00 PM sync (acting as me).",
                )
              }
              className="px-3 py-1 rounded-full bg-[#0c1228] border border-[#1b2545] text-xs font-medium text-slate-200 hover:border-emerald-500 hover:text-white transition cursor-pointer"
            >
              ✉️ Auto-reply to John Doe (Acting as Me)
            </button>
            <button
              onClick={() =>
                handleSendPrompt(
                  "What meetings or tasks are on my calendar schedule for today?",
                )
              }
              className="px-3 py-1 rounded-full bg-[#0c1228] border border-[#1b2545] text-xs font-medium text-slate-200 hover:border-indigo-500 hover:text-white transition cursor-pointer"
            >
              📅 Check today&apos;s schedule
            </button>
          </div>

          {/* Interactive Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt(inputValue);
            }}
            className="flex items-center gap-3 border-t border-[#151c33] bg-[#090d1f] p-3 sm:p-4"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type an instruction (e.g. 'Summarize my emails', 'Reply to John Doe', 'Check May payroll')..."
              disabled={isProcessing}
              className="flex-1 rounded-xl border border-[#202c52] bg-[#050711] px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isProcessing}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-indigo-600/40 hover:bg-indigo-500 transition disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
            >
              <span>Send</span>
              <span>➔</span>
            </button>
          </form>
        </>
      )}
    </div>
  );
}
