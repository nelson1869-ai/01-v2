"use client";

import React, { useState, useEffect } from "react";
import type {
  ApprovalRequest,
  LayerInspectorTab,
  ModelProviderId,
  PipelineViewMode,
  PrimaryNav,
} from "../contracts";
import { INITIAL_APPROVAL_REQUESTS } from "../approvals";
import { CANDIDATES, CANDIDATES_ASK_2 } from "../ai";
import { AUDIT_TRAIL, AUDIT_TRAIL_ASK_2 } from "../audit";
import { getScenario, type ScenarioId } from "../scenarios";

import { Sidebar } from "./components/Sidebar";
import { Header, type ExecutionSpeedMode } from "./components/Header";
import { SafetyInvariantBanner } from "./components/SafetyInvariantBanner";

import { PipelineView } from "./views/PipelineView";
import { DashboardView } from "./views/DashboardView";
import { DecisionsView } from "./views/DecisionsView";
import { ContextView } from "./views/ContextView";
import { RagView } from "./views/RagView";
import { MemoryView } from "./views/MemoryView";
import { ToolsView } from "./views/ToolsView";
import { McpView } from "./views/McpView";
import { ApprovalsView } from "./views/ApprovalsView";
import { CapabilitiesView } from "./views/CapabilitiesView";
import { SchedulerView } from "./views/SchedulerView";
import { AccountsView } from "./views/AccountsView";
import { EvalsView } from "./views/EvalsView";
import { AuditView } from "./views/AuditView";
import { ObservabilityView } from "./views/ObservabilityView";
import { RawStateView } from "./views/RawStateView";
import { RuntimeSecretsView } from "./views/RuntimeSecretsView";
import { ClientChatExperience } from "./client";

import { subscribeToRunSync, broadcastRunState } from "./utils/runSync";

export function AutoDoPersonalDeveloperLab() {
  const [activeScenarioId, setActiveScenarioId] = useState<ScenarioId>("ask-1");
  const [primaryNav, setPrimaryNav] = useState<PrimaryNav>("pipeline");
  const [developerMode, setDeveloperMode] = useState<boolean>(true);
  const [selectedLayerId, setSelectedLayerId] = useState<number>(1);
  const [expandedLayers, setExpandedLayers] = useState<Record<number, boolean>>(
    { 1: true },
  );
  const [layerInspectorTab, setLayerInspectorTab] =
    useState<LayerInspectorTab>("overview");
  const [pipelineViewMode, setPipelineViewMode] =
    useState<PipelineViewMode>("flow");

  // Replay / Step-Through State (1 to 18 layers)
  const [simulatedMaxStep, setSimulatedMaxStep] = useState<number>(18);
  const [isPlayingReplay, setIsPlayingReplay] = useState<boolean>(false);

  // Approvals State
  const [approvalRequests, setApprovalRequests] = useState<
    readonly ApprovalRequest[]
  >(INITIAL_APPROVAL_REQUESTS);
  const [editingApprovalId, setEditingApprovalId] = useState<string | null>(
    null,
  );
  const [approvalDrafts, setApprovalDrafts] = useState<Record<string, string>>(
    {},
  );

  // Sync state across multiple tabs (/ and /client) in real time
  const [customInboundPayload, setCustomInboundPayload] = useState<Record<
    string,
    unknown
  > | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToRunSync((msg) => {
      if (msg.type === "CLEAR_CACHE") {
        setCustomInboundPayload(null);
        setSimulatedMaxStep(0);
        setSelectedLayerId(1);
        setIsPlayingReplay(false);
        setApprovalRequests([]);
        setPrimaryNav("pipeline");
        return;
      }
      if (msg.scenarioId) {
        setActiveScenarioId(msg.scenarioId);
      }
      if (msg.customInboundPayload) {
        setCustomInboundPayload(msg.customInboundPayload);
      }
      if (typeof msg.simulatedMaxStep === "number") {
        setSimulatedMaxStep(msg.simulatedMaxStep);
        setSelectedLayerId(Math.max(1, msg.simulatedMaxStep));
      }
      if (typeof msg.isPlayingReplay === "boolean") {
        setIsPlayingReplay(msg.isPlayingReplay);
      }
    });

    return unsubscribe;
  }, []);

  // Model Router & AI Playground State
  const [selectedProvider, setSelectedProvider] =
    useState<ModelProviderId>("gemini");
  const [selectedModel, setSelectedModel] = useState<string>("gemini-2.5-pro");
  const [customTemp, setCustomTemp] = useState<number>(0.2);
  const [customTopP, setCustomTopP] = useState<number>(1.0);
  const [customMaxTokens, setCustomMaxTokens] = useState<number>(2048);

  // Secrets Reveal State
  const [revealedSecrets, setRevealedSecrets] = useState<
    Record<string, boolean>
  >({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Origin Inspector State
  const [selectedOriginMessageId, setSelectedOriginMessageId] =
    useState<string>("msg_hr_01");

  // Simulated replay speed; this does not control server or provider latency.
  const [executionSpeed, setExecutionSpeed] =
    useState<ExecutionSpeedMode>("realtime");
  const [customDelaySeconds, setCustomDelaySeconds] = useState<number>(5);

  const baseScenario = getScenario(activeScenarioId);
  const activeScenario = React.useMemo(() => {
    if (!customInboundPayload) return baseScenario;
    const headers =
      (customInboundPayload.headers as Record<string, string>) || {};
    const bodyText = (customInboundPayload.bodyText as string) || "";
    const fromStr = headers.From || "Nelson Fernandez";
    const subjectStr = headers.Subject || "Assistant Request";
    const dateStr = headers.Date || new Date().toISOString();
    const isChat = customInboundPayload.sourceSystem === "Client Chat";
    const msgId =
      (customInboundPayload.messageId as string) || "msg_inbound_observed";
    const cmdId = `cmd_${msgId.replace(/^msg_/, "").replace(/^chat_/, "")}`;

    return {
      ...baseScenario,
      ask: {
        ...baseScenario.ask,
        goal: isChat
          ? `Personal Assistant Chat: "${subjectStr}"`
          : `Process Inbound Email: "${subjectStr}"`,
      },
      response: {
        ...baseScenario.response,
        summaryTitle: isChat
          ? `AI Executive Assistant Response to "${subjectStr}"`
          : `Simulated Auto-Reply Proposal for ${fromStr} (Re: ${subjectStr})`,
        bulletPoints: isChat
          ? [
              `User Prompt: "${subjectStr}"`,
              `AI Engine display: simulated pipeline fixture`,
              `Intent: Personal Executive Assistant Interaction`,
              `Safety display: simulated until the observed API result is synchronized`,
              `Outcome display: simulated; observed API response remains in the client diagnostics`,
            ]
          : [
              `Sender: ${fromStr}`,
              `Subject: Re: ${subjectStr}`,
              `Tool Proposal: gmail.send_reply (not executed)`,
              `Calendar Proposal: tentative slot (not reserved)`,
              `Verification: simulated fixture only`,
            ],
        terminalDigest: isChat
          ? `The client processed "${subjectStr}". This pipeline visualization remains simulated until its observed API result is synchronized.`
          : `Simulated a proposed reply to ${fromStr} regarding "${subjectStr}". No Gmail message or calendar hold was created.`,
      },
      steps: baseScenario.steps.map((step) => {
        if (step.id === 1) {
          return {
            ...step,
            provenance: isChat ? ("OBSERVED" as const) : ("SIMULATED" as const),
            inputData: customInboundPayload,
            outputData: {
              commandId: cmdId,
              type: isChat
                ? "USER_INTERACTIVE_PROMPT"
                : "INBOUND_GMAIL_MESSAGE",
              sender: fromStr,
              subject: subjectStr,
              bodySnippet: bodyText.slice(0, 120),
              receivedAt: dateStr,
            },
          };
        }
        if (step.id === 2) {
          return {
            ...step,
            provenance: "DERIVED" as const,
            inputData: {
              commandId: cmdId,
              type: isChat
                ? "USER_INTERACTIVE_PROMPT"
                : "INBOUND_GMAIL_MESSAGE",
              sender: fromStr,
              subject: subjectStr,
              bodyText: bodyText,
            },
            outputData: {
              intent: isChat
                ? "EXECUTIVE_ASSISTANT_CHAT"
                : "PROPOSE_EMAIL_REPLY_AND_CALENDAR_HOLD",
              extractedSender: fromStr,
              extractedSubject: subjectStr,
              proposedMeetingSlot: "Thursday 2:00 PM",
              confidence: 0.98,
            },
          };
        }
        if (step.id === 4) {
          return {
            ...step,
            provenance: "SIMULATED" as const,
            inputData: {
              query: isChat
                ? `Persona guidelines for "${subjectStr}"`
                : `Triage rules for ${subjectStr}`,
              embeddingModel: "nvidia/nemotron-3-embed-1b (2048-dim)",
            },
            outputData: {
              sourceFile: "knowledge_base/triage_rules.md (#DOC-012)",
              matchedGuideline:
                "Nelson's executive AI assistant. Friendly, professional, helpful, concise.",
              similarityScore: 0.962,
              status: "RETRIEVED",
            },
          };
        }
        if (step.id === 5) {
          return {
            ...step,
            provenance: "SIMULATED" as const,
            inputData: {
              provider: "NVIDIA NIM",
              model: "deepseek-ai/deepseek-v4-pro-0813",
              prompt: bodyText,
            },
            outputData: {
              reasoningSummary: isChat
                ? `Evaluated user prompt "${subjectStr}" against #DOC-012 persona. Generated friendly, professional assistant greeting.`
                : `Simulated evaluation of email from ${fromStr} and proposed a reply and calendar hold.`,
              candidateActionsCount: 3,
              confidence: 0.98,
            },
          };
        }
        if (step.id === 6) {
          return {
            ...step,
            provenance: "SIMULATED" as const,
            outputData: {
              candidatesGenerated: isChat
                ? [
                    { action: "assistant.respond", confidence: 0.99 },
                    { action: "calendar.query_upcoming", confidence: 0.75 },
                    { action: "gmail.check_unread", confidence: 0.7 },
                  ]
                : [
                    {
                      action: "gmail.send_reply + calendar.hold",
                      confidence: 0.96,
                    },
                    { action: "gmail.create_draft", confidence: 0.82 },
                    { action: "calendar.query_conflicts", confidence: 0.78 },
                  ],
            },
          };
        }
        if (step.id === 7) {
          return {
            ...step,
            provenance: "DERIVED" as const,
            outputData: {
              topRankedAction: isChat
                ? "assistant.respond"
                : "gmail.send_reply + calendar.create_tentative_hold",
              score: 0.98,
              rationale: isChat
                ? "Direct conversational reply fulfills user prompt with zero mutation risk."
                : "Best autonomous action adhering to trusted contact #MEM-019 rule.",
            },
          };
        }
        if (step.id === 8) {
          return {
            ...step,
            provenance: "DERIVED" as const,
            outputData: {
              evidenceSources: [
                "knowledge_base/triage_rules.md",
                "User Session Auth #usr_nelson",
              ],
              isGrounded: true,
              groundingScore: 0.99,
            },
          };
        }
        if (step.id === 9) {
          return {
            ...step,
            provenance: "DERIVED" as const,
            outputData: {
              guardrailModel: "meta/llama-guard-4-12b",
              hazardsEvaluated: "MLCommons S1–S14",
              hazardsDetected: 0,
              safetyAssessment: "SIMULATED_SAFE",
              policyDecision: "NOT_EVALUATED_BY_RUNTIME_POLICY",
              zeroTrustVerified: false,
            },
          };
        }
        if (step.id === 10) {
          return {
            ...step,
            provenance: "PLANNED" as const,
            outputData: {
              authorizedPrincipal: "Nelson Fernandez (dev@autodo.ai)",
              requestedScope: isChat
                ? "assistant.chat"
                : "gmail.send + calendar.write",
              authorizationStatus: "PLANNED_NOT_ISSUED",
            },
          };
        }
        if (step.id === 11) {
          return {
            ...step,
            provenance: "SIMULATED" as const,
            outputData: {
              executionPlan: isChat
                ? [
                    "1. Synthesize conversational response",
                    "2. Deliver HTTP payload to UI",
                  ]
                : [
                    "1. Dispatch Gmail reply to recipient",
                    "2. Place tentative hold on Google Calendar",
                    "3. Write verification assertion record",
                  ],
            },
          };
        }
        if (step.id === 13) {
          return {
            ...step,
            provenance: "SIMULATED" as const,
            inputData: {
              tool: isChat ? "assistant.respond" : "gmail.send_reply",
              recipient: fromStr,
              subject: `Re: ${subjectStr}`,
              bodyPreview: bodyText.slice(0, 80),
              calendarHold: "Thursday 2:00 PM - 2:30 PM",
            },
            outputData: {
              status: "SIMULATED_NOT_EXECUTED",
              messageId: `msg_sent_${cmdId}`,
              threadId: "thread_proposal_02",
              subject: `Re: ${subjectStr}`,
              recipient: fromStr,
              dispatchedAt: dateStr,
            },
          };
        }
        if (step.id === 14) {
          return {
            ...step,
            provenance: "SIMULATED" as const,
            outputData: {
              httpStatus: "SIMULATED_200",
              toolResult: isChat
                ? "AI_RESPONSE_DELIVERED"
                : "EMAIL_AND_CALENDAR_DISPATCHED",
              subject: `Re: ${subjectStr}`,
              recipient: fromStr,
            },
          };
        }
        if (step.id === 15) {
          return {
            ...step,
            provenance: "SIMULATED" as const,
            outputData: {
              assertionsEvaluated: 5,
              assertionsPassed: 5,
              verificationOutcome: "SIMULATED_VERIFIED",
              checks: [
                "Response matches Nelson executive tone",
                "No unauthorized financial/PII mutation",
                "Safety guardrails clean (S1-S14)",
                "Correlation trace valid",
                "Response rendered to client view",
              ],
            },
          };
        }
        if (step.id === 18) {
          return {
            ...step,
            provenance: "SIMULATED" as const,
            outputData: {
              memoryKey: `mem_chat_${cmdId}`,
              writeStatus: "SIMULATED_NOT_PERSISTED",
              summary: `Simulated memory candidate for '${subjectStr}'.`,
            },
          };
        }
        return step;
      }),
    };
  }, [baseScenario, customInboundPayload]);

  // Realistic Layer Execution Timer (Minimum 10 sec up to 20 sec per layer in realtime mode)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    if (
      isPlayingReplay &&
      simulatedMaxStep >= 1 &&
      simulatedMaxStep <= 18
    ) {
      const currentStepId = simulatedMaxStep;

      // Realistic layer duration based on selected execution speed mode
      let realisticDelay = 10000;
      if (executionSpeed === "instant") {
        realisticDelay = 50;
      } else if (executionSpeed === "fast") {
        realisticDelay = 1000;
      } else if (executionSpeed === "balanced") {
        realisticDelay = 3000;
      } else if (executionSpeed === "custom") {
        realisticDelay = Math.max(200, customDelaySeconds * 1000);
      } else {
        switch (currentStepId) {
          case 1: // Input / Cue
          case 2: // Perception / Parsing
            realisticDelay = 10000; // 10s
            break;
          case 3: // Context Build
            realisticDelay = 12000; // 12s
            break;
          case 4: // Memory / RAG pgvector
            realisticDelay = 14000; // 14s
            break;
          case 5: // AI Reasoning & Deep Gemini Planning
            realisticDelay = 20000; // 20s
            break;
          case 6: // Candidate Generation
            realisticDelay = 12000; // 12s
            break;
          case 7: // Scoring & Ranking
            realisticDelay = 10000; // 10s
            break;
          case 8: // Grounding Evidence
            realisticDelay = 12000; // 12s
            break;
          case 9: // Policy Gate
          case 10: // Authorization
          case 11: // Planning
          case 12: // Durable Lease Claim
            realisticDelay = 10000; // 10s
            break;
          case 13: // Tool Execution (Gmail API & Calendar Hold)
            realisticDelay = 18000; // 18s
            break;
          case 14: // Observation
            realisticDelay = 10000; // 10s
            break;
          case 15: // Verification (6 assertions check)
            realisticDelay = 12000; // 12s
            break;
          case 16: // Reward
          case 17: // Learning
            realisticDelay = 10000; // 10s
            break;
          case 18: // Verified Memory pgvector write
            realisticDelay = 12000; // 12s
            break;
          default:
            realisticDelay = 10000;
        }
      }

      timeoutId = setTimeout(() => {
        if (currentStepId === 18) {
          setIsPlayingReplay(false);
          broadcastRunState({
            type: "FINISH_RUN",
            scenarioId: activeScenarioId,
            simulatedMaxStep: 18,
            isPlayingReplay: false,
          });
          return;
        }

        const nextStepId = currentStepId + 1;
        setSimulatedMaxStep(nextStepId);
        setSelectedLayerId(nextStepId);
        broadcastRunState({
          type: "STEP_UPDATE",
          scenarioId: activeScenarioId,
          simulatedMaxStep: nextStepId,
          isPlayingReplay: true,
        });
      }, realisticDelay);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [
    isPlayingReplay,
    simulatedMaxStep,
    executionSpeed,
    customDelaySeconds,
    activeScenarioId,
  ]);

  const toggleLayerExpand = (id: number) => {
    setExpandedLayers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleExpandAll = () => {
    const all: Record<number, boolean> = {};
    activeScenario.steps.forEach((s) => {
      all[s.id] = true;
    });
    setExpandedLayers(all);
  };

  const handleCollapseAll = () => {
    setExpandedLayers({});
  };

  const toggleSecretReveal = (id: string) => {
    setRevealedSecrets((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      if (!navigator.clipboard) {
        throw new Error("Clipboard API unavailable");
      }
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
    } catch {
      setCopiedId(`${id}:error`);
    }
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleApprove = (id: string) => {
    setApprovalRequests((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "APPROVED" } : a)),
    );
  };

  const handleReject = (id: string) => {
    setApprovalRequests((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "REJECTED" } : a)),
    );
  };

  const handleSaveApprovalEdit = (id: string) => {
    setApprovalRequests((prev) =>
      prev.map((request) =>
        request.id === id
          ? { ...request, argumentsPreview: approvalDrafts[id] }
          : request,
      ),
    );
    setEditingApprovalId(null);
  };

  const pendingApprovalCount = approvalRequests.filter(
    (request) => request.status === "PENDING",
  ).length;

  return (
    <div className="flex min-h-screen w-full bg-[#050711] font-sans text-slate-200 antialiased selection:bg-indigo-600 selection:text-white">
      {/* 1. Navigation Sidebar */}
      <Sidebar
        primaryNav={primaryNav}
        setPrimaryNav={setPrimaryNav}
        pendingApprovalCount={pendingApprovalCount}
        simulatedMaxStep={simulatedMaxStep}
        isPlayingReplay={isPlayingReplay}
      />

      {/* 2. Main Content Area */}
      <div className="flex flex-1 flex-col pb-16 lg:pb-0 overflow-x-hidden">
        <Header
          setPrimaryNav={setPrimaryNav}
          developerMode={developerMode}
          setDeveloperMode={setDeveloperMode}
          setLayerInspectorTab={setLayerInspectorTab}
          simulatedMaxStep={simulatedMaxStep}
          setSimulatedMaxStep={setSimulatedMaxStep}
          setSelectedLayerId={setSelectedLayerId}
          isPlayingReplay={isPlayingReplay}
          setIsPlayingReplay={setIsPlayingReplay}
          executionSpeed={executionSpeed}
          setExecutionSpeed={setExecutionSpeed}
          customDelaySeconds={customDelaySeconds}
          setCustomDelaySeconds={setCustomDelaySeconds}
          copiedId={copiedId}
          copyToClipboard={copyToClipboard}
          activeScenarioId={activeScenarioId}
          setActiveScenarioId={setActiveScenarioId}
          runMetadata={activeScenario.metadata}
        />

        <SafetyInvariantBanner />

        <main className="p-4 sm:p-6 flex-1 flex flex-col gap-4">
          {developerMode ? (
            <>
              <div
                className={primaryNav === "client_chat" ? "contents" : "hidden"}
                aria-hidden={primaryNav !== "client_chat"}
              >
                <ClientChatExperience
                  setPrimaryNav={setPrimaryNav}
                  setActiveScenarioId={setActiveScenarioId}
                />
              </div>

              {primaryNav === "pipeline" && (
                <PipelineView
                  pipelineSteps={activeScenario.steps}
                  activeScenarioId={activeScenarioId}
                  setActiveScenarioId={setActiveScenarioId}
                  scenarioTitle={activeScenario.title}
                  scenarioResponse={activeScenario.response}
                  scenarioMetadata={activeScenario.metadata}
                  selectedLayerId={selectedLayerId}
                  setSelectedLayerId={setSelectedLayerId}
                  expandedLayers={expandedLayers}
                  toggleLayerExpand={toggleLayerExpand}
                  handleExpandAll={handleExpandAll}
                  handleCollapseAll={handleCollapseAll}
                  layerInspectorTab={layerInspectorTab}
                  setLayerInspectorTab={setLayerInspectorTab}
                  pipelineViewMode={pipelineViewMode}
                  setPipelineViewMode={setPipelineViewMode}
                  simulatedMaxStep={simulatedMaxStep}
                  setSimulatedMaxStep={setSimulatedMaxStep}
                  isPlayingReplay={isPlayingReplay}
                  setIsPlayingReplay={setIsPlayingReplay}
                />
              )}

              {primaryNav === "dashboard" && (
                <DashboardView
                  setPrimaryNav={setPrimaryNav}
                  pendingApprovalCount={pendingApprovalCount}
                  setActiveScenarioId={setActiveScenarioId}
                  simulatedMaxStep={simulatedMaxStep}
                />
              )}

              {primaryNav === "decisions" && (
                <DecisionsView
                  selectedProvider={selectedProvider}
                  setSelectedProvider={setSelectedProvider}
                  selectedModel={selectedModel}
                  setSelectedModel={setSelectedModel}
                  customTemp={customTemp}
                  setCustomTemp={setCustomTemp}
                  customTopP={customTopP}
                  setCustomTopP={setCustomTopP}
                  customMaxTokens={customMaxTokens}
                  setCustomMaxTokens={setCustomMaxTokens}
                  candidates={
                    activeScenarioId === "ask-2" ? CANDIDATES_ASK_2 : CANDIDATES
                  }
                  simulatedMaxStep={simulatedMaxStep}
                  isPlayingReplay={isPlayingReplay}
                />
              )}

              {primaryNav === "context" && (
                <ContextView
                  activeScenarioId={activeScenarioId}
                  simulatedMaxStep={simulatedMaxStep}
                  isPlayingReplay={isPlayingReplay}
                />
              )}
              {primaryNav === "rag" && (
                <RagView
                  activeScenarioId={activeScenarioId}
                  simulatedMaxStep={simulatedMaxStep}
                  isPlayingReplay={isPlayingReplay}
                />
              )}
              {primaryNav === "memory" && (
                <MemoryView
                  activeScenarioId={activeScenarioId}
                  simulatedMaxStep={simulatedMaxStep}
                  isPlayingReplay={isPlayingReplay}
                />
              )}
              {primaryNav === "tools" && (
                <ToolsView
                  selectedOriginMessageId={selectedOriginMessageId}
                  setSelectedOriginMessageId={setSelectedOriginMessageId}
                  simulatedMaxStep={simulatedMaxStep}
                  onTriggerInboundRun={(
                    scenarioId,
                    autoNavigateToPipeline = false,
                  ) => {
                    setActiveScenarioId(scenarioId);
                    setSimulatedMaxStep(1);
                    setSelectedLayerId(1);
                    setIsPlayingReplay(true);
                    if (autoNavigateToPipeline) {
                      setPrimaryNav("pipeline");
                    }
                  }}
                  isPlayingReplay={isPlayingReplay}
                  setPrimaryNav={setPrimaryNav}
                />
              )}
              {primaryNav === "mcp" && <McpView />}
              {primaryNav === "approvals" && (
                <ApprovalsView
                  approvalRequests={approvalRequests}
                  editingApprovalId={editingApprovalId}
                  setEditingApprovalId={setEditingApprovalId}
                  approvalDrafts={approvalDrafts}
                  setApprovalDrafts={setApprovalDrafts}
                  handleApprove={handleApprove}
                  handleReject={handleReject}
                  handleSaveApprovalEdit={handleSaveApprovalEdit}
                />
              )}
              {primaryNav === "capabilities" && <CapabilitiesView />}
              {primaryNav === "scheduler" && <SchedulerView />}
              {primaryNav === "accounts" && <AccountsView />}
              {primaryNav === "evals" && (
                <EvalsView
                  simulatedMaxStep={simulatedMaxStep}
                  isPlayingReplay={isPlayingReplay}
                />
              )}
              {primaryNav === "audit" && (
                <AuditView
                  auditTrail={
                    activeScenarioId === "ask-2"
                      ? AUDIT_TRAIL_ASK_2
                      : AUDIT_TRAIL
                  }
                  simulatedMaxStep={simulatedMaxStep}
                  isPlayingReplay={isPlayingReplay}
                />
              )}
              {primaryNav === "observability" && (
                <ObservabilityView
                  pipelineSteps={activeScenario.steps}
                  traceId={activeScenario.metadata.traceId}
                  simulatedMaxStep={simulatedMaxStep}
                  isPlayingReplay={isPlayingReplay}
                />
              )}
              {primaryNav === "raw" && (
                <RawStateView
                  copiedId={copiedId}
                  copyToClipboard={copyToClipboard}
                  rawJson={JSON.stringify(activeScenario, null, 2)}
                  simulatedMaxStep={simulatedMaxStep}
                />
              )}
              {primaryNav === "runtime_secrets" && (
                <RuntimeSecretsView
                  revealedSecrets={revealedSecrets}
                  toggleSecretReveal={toggleSecretReveal}
                  copiedId={copiedId}
                  copyToClipboard={copyToClipboard}
                />
              )}
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center p-12 text-center text-slate-400">
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="text-lg font-bold text-white mb-1">
                Developer Mode is Disabled
              </h3>
              <p className="max-w-md text-xs text-slate-400 mb-4">
                Enable Developer Mode via the switch in the top header to
                inspect all 18 canonical brain pipeline layers, telemetry, and
                execution traces.
              </p>
              <button
                onClick={() => setDeveloperMode(true)}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition"
              >
                Turn On Developer Mode
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AutoDoPersonalDeveloperLab;
