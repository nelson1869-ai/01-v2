// Canonical simulated run envelope and completed raw-state fixture.
import type { RunStatus } from "../contracts";

export const RUN_METADATA = {
  runId: "run_2026_05_27_00129",
  commandId: "cmd_cue_20260527_00129",
  requestId: "req_cue_98f12a",
  traceId: "trc_autodo_20260527_98a",
  executionId: "exec_autodo_00129_wk1",
  sessionId: "ses_dev_9812",
  workspaceId: "ws_autodo_01",
  correlationId: "corr_gmail_summarize_98a",
  status: "completed" as RunStatus,
  goal: "Summarize unread important emails from today",
  provider: "Gmail (Simulated)",
  agent: "AutoDo Core v1.0 (Canonical 18-Layer Brain)",
  environment: "development (local sandbox)",
  version: "v0.1.0 (package.json)",
  started: "May 27, 2026 10:32:11 AM",
  completed: "May 27, 2026 10:32:13 AM",
  duration: "00:00:02.054 (MOCK TELEMETRY)",
  totalDurationMs: 2054,
  totalTokens: "12,342 (SIMULATED)",
  promptTokens: 9840,
  completionTokens: 2502,
  costEst: "$0.0021 (SIMULATED)",
  stepsCompleted: 18,
  totalSteps: 18,
  model: "Gemini 2.5 Pro (Target Provider)",
  temperature: 0.2,
  topP: 1.0,
  maxTokens: 2048,
  criticalPathSummary: "Reason (781ms) → Ground (206ms) → Act (580ms)",
  criticalPathTotalMs: 1567,
  criticalPathPercentage: "76.3% of active pipeline time",
  slowestLayer: "5. Reason (781ms)",
};

export const RAW_JSON_OUTPUT = `{
  "system": "AutoDo 01-v2 Personal AI Operating Console",
  "provenanceNotice": "Visual Contract / Discovery Lab Prototype (SIMULATED DATA)",
  "run": {
    "runId": "run_2026_05_27_00129",
    "commandId": "cmd_cue_20260527_00129",
    "requestId": "req_cue_98f12a",
    "traceId": "trc_autodo_20260527_98a",
    "status": "completed",
    "goal": "summarize unread important emails from today",
    "pipelineLayersTotal": 18,
    "startedAt": "2026-05-27T10:32:11.120Z",
    "completedAt": "2026-05-27T10:32:13.174Z",
    "durationMs": 2054
  },
  "invariantsChecked": [
    {"invariant": "AI Choice != Permission", "status": "UPHELD"},
    {"invariant": "Candidate Score != Permission", "status": "UPHELD"},
    {"invariant": "Retrieved Memory != Permission", "status": "UPHELD"},
    {"invariant": "Grounding != Permission", "status": "UPHELD"},
    {"invariant": "Plan != Permission", "status": "UPHELD"},
    {"invariant": "Reward != Permission", "status": "UPHELD"},
    {"invariant": "Learning != Permission", "status": "UPHELD"},
    {"invariant": "Verified Memory != Authorization", "status": "UPHELD"},
    {"invariant": "Policy + Authorization = Execution Gate", "status": "UPHELD"}
  ],
  "chosenAction": {
    "action": "gmail.list_messages",
    "score": 0.94,
    "policyDecision": "ALLOW",
    "authorizationStatus": "AUTHORIZED"
  },
  "verification": {
    "status": "VERIFIED",
    "passedCount": 5,
    "failedCount": 0
  },
  "reward": {
    "finalReward": 0.90,
    "qualityScore": 0.94,
    "penalties": 0.04
  },
  "learning": {
    "candidateAdjustment": {"gmail.list_messages": 0.04},
    "pattern": "gmail.list_messages for read-only summary"
  },
  "verifiedMemory": {
    "memoryId": "mem_verified_00129",
    "writeStatus": "stored",
    "storedCount": 1,
    "rejectedCount": 1
  }
}`;
