import type {
  ExternalCueIngress,
  OriginTransformationStep,
  SimulatedExternalGmailMessage,
} from "../contracts";
import gmailRequestFixture from "./request.json";
import gmailResponseFixture from "./response.json";
import messageHr01Fixture from "./message-hr-01.json";
import messageJohn02Fixture from "./message-john-02.json";
import messageFinance03Fixture from "./message-finance-03.json";

export {
  gmailRequestFixture,
  gmailResponseFixture,
  messageHr01Fixture,
  messageJohn02Fixture,
  messageFinance03Fixture,
};

export const GMAIL_ORIGIN_MESSAGES: readonly SimulatedExternalGmailMessage[] = [
  messageHr01Fixture as SimulatedExternalGmailMessage,
  messageJohn02Fixture as SimulatedExternalGmailMessage,
  messageFinance03Fixture as SimulatedExternalGmailMessage,
];

export const AUTODO_INGRESS_CUES: readonly ExternalCueIngress[] = [
  {
    cueId: "cue_gmail_001",
    source: "GMAIL_EVENT",
    sourceMessageId: "msg_hr_01",
    sourceAccount: "dev@autodo.ai",
    receivedAt: "2026-05-27T10:32:13.026Z",
    payloadRef: "gmail-data/message-hr-01.json",
    provenance: "SIMULATED",
  },
  {
    cueId: "cue_gmail_002",
    source: "GMAIL_EVENT",
    sourceMessageId: "msg_john_02",
    sourceAccount: "dev@autodo.ai",
    receivedAt: "2026-05-27T10:32:13.026Z",
    payloadRef: "gmail-data/message-john-02.json",
    provenance: "SIMULATED",
  },
  {
    cueId: "cue_gmail_003",
    source: "GMAIL_EVENT",
    sourceMessageId: "msg_finance_03",
    sourceAccount: "dev@autodo.ai",
    receivedAt: "2026-05-27T10:32:13.026Z",
    payloadRef: "gmail-data/message-finance-03.json",
    provenance: "SIMULATED",
  },
];

export const GMAIL_ORIGIN_TRANSFORMATION_FLOW: readonly OriginTransformationStep[] = [
  {
    stepNumber: 1,
    name: "Simulated Gmail External Message",
    boundary: "EXTERNAL_PROVIDER",
    description: "Raw provider-shaped Gmail payload from googleapis.com",
    inputArtifact: "Simulated IMAP/REST Ingress",
    outputArtifact: "SimulatedExternalGmailMessage (JSON)",
    provenance: "SIMULATED_EXTERNAL_MESSAGE",
  },
  {
    stepNumber: 2,
    name: "Gmail Adapter Normalization",
    boundary: "ADAPTER_GATEWAY",
    description: "Adapter normalizes provider payload and removes provider coupling",
    inputArtifact: "SimulatedExternalGmailMessage",
    outputArtifact: "NormalizedExternalEvent",
    provenance: "DERIVED",
  },
  {
    stepNumber: 3,
    name: "ExternalCue Ingress Boundary",
    boundary: "AUTODO_BRAIN",
    description: "Structured cue envelope with correlation headers and payload reference",
    inputArtifact: "NormalizedExternalEvent",
    outputArtifact: "ExternalCueIngress (cue_gmail_001)",
    provenance: "DERIVED",
  },
  {
    stepNumber: 4,
    name: "Input / Cue (Layer 1)",
    boundary: "AUTODO_BRAIN",
    description: "First canonical pipeline layer registers ingress event",
    inputArtifact: "ExternalCueIngress",
    outputArtifact: "UnparsedCueEvent",
    provenance: "OBSERVED",
  },
  {
    stepNumber: 5,
    name: "Perception / Parsing (Layer 2)",
    boundary: "AUTODO_BRAIN",
    description: "Synthesizes intent, scope, and parameters into canonical command",
    inputArtifact: "UnparsedCueEvent",
    outputArtifact: "CanonicalCommand (gmail.summarize_unread)",
    provenance: "DERIVED",
  },
  {
    stepNumber: 6,
    name: "Context Build (Layer 3)",
    boundary: "AUTODO_BRAIN",
    description: "Assembles user preferences, active accounts, and tool constraints",
    inputArtifact: "CanonicalCommand",
    outputArtifact: "ExecutionContextBundle",
    provenance: "DERIVED",
  },
  {
    stepNumber: 7,
    name: "RAG / Memory Retrieval (Layer 4)",
    boundary: "AUTODO_BRAIN",
    description: "Selective retrieval of verified memory preferences",
    inputArtifact: "ExecutionContextBundle",
    outputArtifact: "MemoryEnrichedContext (#MEM-012)",
    provenance: "SIMULATED",
  },
  {
    stepNumber: 8,
    name: "AI Reasoning (Layer 5)",
    boundary: "AUTODO_BRAIN",
    description: "Gemini 2.5 Pro JSON Mode structured reasoning",
    inputArtifact: "MemoryEnrichedContext",
    outputArtifact: "StructuredReasoningPlan",
    provenance: "SIMULATED",
  },
];

export const GMAIL_SIMULATION = {
  provenance: "SIMULATED" as const,
  toolId: "gmail.list_messages",
  requiredCapability: "cap_gmail_read",
  request: {
    method: gmailRequestFixture.method,
    endpoint: gmailRequestFixture.endpoint,
    query: gmailRequestFixture.query,
    maxResults: gmailRequestFixture.maxResults,
    scope: gmailRequestFixture.scope,
  },
  response: {
    httpStatus: gmailResponseFixture.httpStatus,
    latencyMs: gmailResponseFixture.latencyMs,
    payloadBytes: gmailResponseFixture.payloadBytes,
    itemsReceived: gmailResponseFixture.resultSizeEstimate,
    messageIds: [
      "msg_hr_01",
      "msg_john_02",
      "msg_finance_03",
      "msg_security_04",
      "msg_meeting_05",
    ],
  },
  observation: {
    observedItems: 5,
    senders: ["HR", "John Doe", "Finance"],
    summaryBulletsCount: 5,
    observedAt: "2026-05-27T10:32:13.026Z",
    uncertainty: "NONE (SIMULATED)",
  },
  verification: {
    outcome: "VERIFIED" as const,
    assertionsPassed: 5,
    assertionsFailed: 0,
    checks: [
      { name: "Schema", status: "PASS" as const },
      { name: "Expected Count", status: "PASS" as const },
      { name: "Filter Match", status: "PASS" as const },
      { name: "Date Match", status: "PASS" as const },
      { name: "Permission Boundary", status: "PASS" as const },
    ],
  },
} as const;

export const GMAIL_MESSAGE_SUMMARIES = [
  {
    id: "msg_hr_01",
    sender: "HR",
    subject: "Payroll update for May 2026",
    summary: "Payroll processing is confirmed.",
  },
  {
    id: "msg_john_02",
    sender: "John Doe",
    subject: "Proposal follow-up",
    summary: "John followed up on the shared proposal.",
  },
  {
    id: "msg_finance_03",
    sender: "Finance",
    subject: "Invoice #INV-2026-118",
    summary: "The invoice remains pending.",
  },
  {
    id: "msg_security_04",
    sender: "Security",
    subject: "Account security alert",
    summary: "A security alert requires review.",
  },
  {
    id: "msg_meeting_05",
    sender: "Operations",
    subject: "Team meeting update",
    summary: "The team meeting time changed.",
  },
] as const;
