// Shared UI-only simulation contracts.

export type ProvenanceBadge =
  | "OBSERVED"
  | "DERIVED"
  | "SIMULATED"
  | "PLANNED"
  | "MOCK TELEMETRY"
  | "MOCK SECRET"
  | "SIMULATED_EXTERNAL_MESSAGE"
  | "SIMULATED_GMAIL_PAYLOAD";

export type RunStatus =
  | "completed"
  | "running"
  | "warning"
  | "failed"
  | "paused"
  | "waiting_for_approval";

export type LayerStatus =
  | "success"
  | "running"
  | "warning"
  | "failed"
  | "pending"
  | "blocked"
  | "skipped"
  | "paused";

export type LayerHealth = "healthy" | "degraded" | "slow" | "failed";

export type VerificationOutcome = "VERIFIED" | "FAILED" | "UNCERTAIN";

export type PolicyDecisionType =
  | "ALLOW"
  | "DENY"
  | "REQUIRE_APPROVAL"
  | "LIMIT"
  | "ESCALATE";

export type AuthorizationState =
  | "AUTHORIZED"
  | "DENIED"
  | "WAITING_FOR_APPROVAL"
  | "EXPIRED"
  | "REVOKED";

export type DurableState =
  | "PENDING"
  | "CLAIMED"
  | "RUNNING"
  | "WAITING"
  | "RETRYING"
  | "PAUSED"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

export type PrimaryNav =
  | "client_chat"
  | "dashboard"
  | "pipeline"
  | "decisions"
  | "context"
  | "rag"
  | "memory"
  | "tools"
  | "mcp"
  | "approvals"
  | "capabilities"
  | "scheduler"
  | "accounts"
  | "evals"
  | "audit"
  | "observability"
  | "raw"
  | "runtime_secrets";

export type LayerInspectorTab =
  | "overview"
  | "input"
  | "output"
  | "diff"
  | "lineage"
  | "evidence"
  | "metrics"
  | "logs"
  | "raw";

export type PipelineViewMode = "flow" | "timeline" | "trace" | "diff";

export type ModelProviderId = "gemini" | "nvidia" | "openai" | "ollama";

export type ContractDiffItem = {
  readonly field: string;
  readonly type: "ADDED" | "CHANGED" | "PRESERVED" | "REMOVED";
  readonly inputValue?: string;
  readonly outputValue: string;
  readonly note: string;
};

export type PipelineStep = {
  readonly id: number;
  readonly name: string;
  readonly layerKey: string;
  readonly responsibility: string;
  readonly durationMs: number;
  readonly status: LayerStatus;
  readonly health: LayerHealth;
  readonly healthReason: string;
  readonly provenance: ProvenanceBadge;
  readonly isCriticalPath: boolean;
  readonly warningsCount: number;
  readonly errorsCount: number;
  readonly attempts: string;
  readonly retryCount: number;
  readonly startedAt: string;
  readonly completedAt: string;
  readonly spanId: string;
  readonly parentSpanId?: string;
  readonly previousLayer: string;
  readonly nextLayer: string;
  readonly inputContract: string;
  readonly outputContract: string;
  readonly owns: readonly string[];
  readonly doesNotOwn: readonly string[];
  readonly internalFlow: readonly {
    readonly step: string;
    readonly durationMs: number;
  }[];
  readonly inputData: Record<string, unknown>;
  readonly outputData: Record<string, unknown>;
  readonly contractDiff: readonly ContractDiffItem[];
  readonly expectedVsActual: {
    readonly expected: string;
    readonly actual: string;
    readonly matchStatus: "MATCH" | "WARNING" | "MISMATCH";
  };
  readonly dataLineage?: readonly {
    readonly from: string;
    readonly fromType: "OBSERVED" | "DERIVED" | "SIMULATED";
    readonly transform: string;
    readonly to: string;
    readonly toType: "DERIVED" | "SIMULATED";
    readonly destination: string;
  }[];
  readonly evidenceChecks: readonly {
    readonly checkName: string;
    readonly description: string;
    readonly status: "PASS" | "FAIL" | "WARN";
  }[];
  readonly timingWaterfall: readonly {
    readonly operation: string;
    readonly durationMs: number;
    readonly percentage: number;
  }[];
  readonly mockTelemetry: {
    readonly cpuUserTimeMs: number;
    readonly heapDeltaKb: number;
    readonly eventLoopLagMs: number;
    readonly memoryAllocatedKb: number;
  };
  readonly layerLogs: readonly {
    readonly timestamp: string;
    readonly level: "DEBUG" | "INFO" | "WARN" | "ERROR" | "SUCCESS";
    readonly event: string;
    readonly metadata?: string;
  }[];
  readonly rawJson: Record<string, unknown>;
};

export type SimulatedRunSnapshot = {
  readonly status: "running" | "completed";
  readonly completedThrough: number;
  readonly completedLayerIds: readonly number[];
  readonly activeLayer: PipelineStep;
  readonly currentInput: Record<string, unknown>;
  readonly currentOutput: Record<string, unknown>;
  readonly nextDestination: string;
  readonly finalResultAvailable: boolean;
};

export type CandidateAction = {
  readonly id: string;
  readonly action: string;
  readonly tool: string;
  readonly argumentsPayload: Record<string, unknown>;
  readonly score: number;
  readonly qualityScore: number;
  readonly relevanceScore: number;
  readonly evidenceScore: number;
  readonly riskPenalty: number;
  readonly latencyEstimateMs: number;
  readonly costEstimateUsd: number;
  readonly preferenceScore: number;
  readonly confidence: number;
  readonly status: "chosen" | "rejected";
  readonly reason: string;
  readonly requiredScope: string;
  readonly risk: "LOW" | "MEDIUM" | "HIGH";
};

export type EvidenceItem = {
  readonly id: string;
  readonly category:
    | "Grounding"
    | "Policy"
    | "Execution"
    | "Verification"
    | "Reward"
    | "Learning"
    | "Memory";
  readonly source: string;
  readonly checkName: string;
  readonly expected: string;
  readonly observed: string;
  readonly status: "PASS" | "FAIL";
  readonly freshness: "Fresh" | "Stale";
};

export type McpServer = {
  readonly id: string;
  readonly name: string;
  readonly transport: "stdio" | "sse" | "websocket";
  readonly connectionState: "CONNECTED" | "DISCONNECTED" | "ERROR";
  readonly protocolVersion: string;
  readonly capabilities: readonly string[];
  readonly toolsCount: number;
  readonly resourcesCount: number;
  readonly promptsCount: number;
  readonly health: "HEALTHY" | "DEGRADED";
  readonly lastConnected: string;
  readonly tools: readonly {
    readonly name: string;
    readonly description: string;
    readonly inputSchema: string;
    readonly risk: "LOW" | "MEDIUM" | "HIGH";
  }[];
};

export type ToolRegistryItem = {
  readonly id: string;
  readonly provider: string;
  readonly description: string;
  readonly inputSchema: string;
  readonly outputSchema: string;
  readonly risk: "LOW" | "MEDIUM" | "HIGH";
  readonly requiredCapability: string;
  readonly timeoutMs: number;
  readonly retryPolicy: string;
  readonly enabled: boolean;
  readonly health: "SIMULATED HEALTHY" | "PLANNED";
  readonly implementationType: "NATIVE ADAPTER" | "MCP TOOL" | "INTERNAL TOOL";
};

export type CapabilityItem = {
  readonly id: string;
  readonly service: string;
  readonly operation: string;
  readonly risk: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  readonly defaultPolicy: PolicyDecisionType;
  readonly approvalMode:
    | "AUTO_ALLOW"
    | "REQUIRE_EXPLICIT_APPROVAL"
    | "ALWAYS_DENY";
  readonly scope: string;
  readonly enabled: boolean;
};

export type ApprovalRequest = {
  readonly id: string;
  readonly action: string;
  readonly tool: string;
  readonly argumentsPreview: string;
  readonly reason: string;
  readonly risk: "MEDIUM" | "HIGH";
  readonly evidence: string;
  readonly requestedCapability: string;
  readonly policyResult: string;
  readonly expectedEffect: string;
  readonly potentialSideEffect: string;
  readonly status: "PENDING" | "APPROVED" | "REJECTED";
};

export type TriggerSource = {
  readonly id: string;
  readonly source:
    | "Chat"
    | "Manual Run"
    | "Schedule"
    | "Gmail Event"
    | "Calendar Event"
    | "Webhook"
    | "MCP Event"
    | "System Event";
  readonly condition: string;
  readonly payloadPreview: string;
  readonly lastFired: string;
  readonly nextFire?: string;
  readonly enabled: boolean;
  readonly runsCreated: number;
};

export type ScheduleItem = {
  readonly id: string;
  readonly goal: string;
  readonly triggerType:
    | "One-Time Task"
    | "Recurring Task"
    | "Reminder"
    | "Delayed Action"
    | "Follow-Up"
    | "Conditional Watch";
  readonly timezone: string;
  readonly recurrence: string;
  readonly nextRun: string;
  readonly lastRun: string;
  readonly status: "ACTIVE" | "PENDING" | "PAUSED";
  readonly failureCount: number;
  readonly associatedRunId: string;
};

export type ConnectedAccount = {
  readonly id: string;
  readonly service: string;
  readonly account: string;
  readonly connectionState: "CONNECTED" | "NEEDS_REAUTH" | "DISCONNECTED";
  readonly scopes: readonly string[];
  readonly capabilities: readonly string[];
  readonly lastSync: string;
  readonly health: "HEALTHY" | "DEGRADED";
  readonly authType: "OAuth2" | "API Key" | "Local Stdio";
  readonly expires: string;
};

export type ContactPerson = {
  readonly id: string;
  readonly name: string;
  readonly aliases: readonly string[];
  readonly email: string;
  readonly phone?: string;
  readonly organization: string;
  readonly relationship: "Trusted Team" | "Partner" | "Vendor" | "Unknown";
  readonly calendarIdentity: string;
  readonly source: "Google Contacts" | "Gmail Headers" | "Manual Context";
  readonly confidence: number;
};

export type EvaluationScenario = {
  readonly id: string;
  readonly name: string;
  readonly dataset: string;
  readonly expectedOutcome: string;
  readonly actualOutcome: string;
  readonly status: "PASS" | "FAIL" | "UNCERTAIN";
  readonly taskSuccessRate: number;
  readonly groundingQuality: number;
  readonly toolCorrectness: number;
  readonly policyCorrectness: number;
  readonly verificationRate: number;
  readonly hallucinationRate: number;
  readonly latencyMs: number;
  readonly costUsd: number;
};

export type AuditEvent = {
  readonly id: string;
  readonly timestamp: string;
  readonly what: string;
  readonly whoInitiated: string;
  readonly why: string;
  readonly permissionExisted: string;
  readonly whatChanged: string;
  readonly evidenceSupported: string;
  readonly outcomeAfterward: string;
};

export type LocalDevSecret = {
  readonly id: string;
  readonly label: string;
  readonly maskedValue: string;
  readonly mockValue: string;
  readonly source: string;
  readonly scope: string;
  readonly lastLoaded: string;
  readonly status: "Active (Local Mock)" | "Simulated";
};

export type SimulatedExternalGmailMessage = {
  readonly _provenance: "SIMULATED_EXTERNAL_MESSAGE";
  readonly sourceSystem: string;
  readonly provider: string;
  readonly origin: string;
  readonly sourceType: "SIMULATED_EXTERNAL_MESSAGE";
  readonly account: string;
  readonly messageId: string;
  readonly threadId: string;
  readonly historyId: string;
  readonly receivedAt: string;
  readonly headers: {
    readonly From: string;
    readonly To: string;
    readonly Subject: string;
    readonly Date: string;
  };
  readonly labels: readonly string[];
  readonly snippet: string;
  readonly payloadFixturePath: string;
};

export type ExternalCueIngress = {
  readonly cueId: string;
  readonly source:
    | "GMAIL_EVENT"
    | "CHAT"
    | "MANUAL_RUN"
    | "SCHEDULE"
    | "WEBHOOK";
  readonly sourceMessageId: string;
  readonly sourceAccount: string;
  readonly receivedAt: string;
  readonly payloadRef: string;
  readonly provenance: "SIMULATED";
};

export type OriginTransformationStep = {
  readonly stepNumber: number;
  readonly name: string;
  readonly boundary: "EXTERNAL_PROVIDER" | "ADAPTER_GATEWAY" | "AUTODO_BRAIN";
  readonly description: string;
  readonly inputArtifact: string;
  readonly outputArtifact: string;
  readonly provenance: ProvenanceBadge;
};

export type ScenarioContract = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly ask: {
    readonly scenarioId: string;
    readonly name: string;
    readonly goal: string;
    readonly ingressType: string;
    readonly traceId: string;
    readonly targetProvider: string;
    readonly requiredScope: string;
    readonly riskLevel: string;
    readonly inputPayload: Record<string, unknown>;
  };
  readonly response: {
    readonly scenarioId: string;
    readonly status: string;
    readonly provenance: ProvenanceBadge;
    readonly durationMs: number;
    readonly costUsd: number;
    readonly assertionsPassed: number;
    readonly assertionsTotal: number;
    readonly summaryTitle: string;
    readonly bulletPoints: readonly string[];
    readonly toolActionExecuted?: Record<string, unknown>;
    readonly terminalDigest: string;
    readonly policyAudit?: Record<string, unknown>;
    readonly sentMessageDetails?: Record<string, unknown>;
  };
  readonly metadata: {
    readonly runId: string;
    readonly goal: string;
    readonly status: string;
    readonly statusColor: string;
    readonly mode: string;
    readonly duration: string;
    readonly durationMs: number;
    readonly startedAt: string;
    readonly totalLayers: number;
    readonly passedLayers: number;
    readonly failedLayers: number;
    readonly skippedLayers: number;
    readonly policyViolations: number;
    readonly evalAssertionsPassed: string;
    readonly activeLease: string;
    readonly provenance: string;
    readonly traceId: string;
    readonly currentAttempt: string;
    readonly isDurable: boolean;
    readonly workerId: string;
    readonly estimatedCostUsd: number;
    readonly tokenUsage: {
      readonly prompt?: number;
      readonly completion?: number;
      readonly total: number;
    };
    readonly sourceSystem: string;
    readonly provider: string;
    readonly origin: string;
  };
  readonly steps: readonly PipelineStep[];
};
