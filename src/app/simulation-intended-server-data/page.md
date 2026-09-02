# AutoDo V1 UI-Only Simulation & Intended Server Data Guide

> **First Reading Guide for Future AutoDo AI Development & Engineering Work**

This directory contains the modularized, strongly-typed simulation fixtures, intended server-shaped data contracts, and modular frontend components for the AutoDo V1 Developer Lab UI.

---

## 1. Directory Structure

```text
src/app/simulation-intended-server-data/
├── index.ts                              # Stable root facade (single import boundary)
├── page.md                               # Architectural guide & reading reference (ALWAYS UPDATED)
├── contracts/
│   └── index.ts                          # Shared TypeScript architectural, domain, scenario, and origin contracts
├── run/
│   └── index.ts                          # RUN_METADATA and RAW_JSON_OUTPUT fixtures
├── pipeline/
│   └── index.ts                          # PIPELINE_STEPS (18 canonical layers) & buildSimulatedRunSnapshot()
├── ai/
│   └── index.ts                          # MODEL_OPTIONS_BY_PROVIDER and CANDIDATES evaluation matrix
├── tools/
│   └── index.ts                          # TOOL_REGISTRY and CAPABILITIES authorization matrix
├── gmail-data/
│   ├── request.json                      # Simulated HTTP GET request to Gmail API
│   ├── response.json                     # Simulated HTTP 200 payload with 5 messages
│   ├── message-hr-01.json                # Simulated raw Gmail external message fixture (HR update)
│   ├── message-john-02.json              # Simulated raw Gmail external message fixture (John Doe proposal)
│   ├── message-finance-03.json           # Simulated raw Gmail external message fixture (Finance invoice)
│   └── index.ts                          # GMAIL_SIMULATION, GMAIL_ORIGIN_MESSAGES, AUTODO_INGRESS_CUES & Flow
├── like-real-massage/
│   ├── messages.csv                      # Excel / Spreadsheet CSV format of all 5 realistic messages
│   ├── messages-table.md                 # Markdown tabular spreadsheet preview
│   ├── payroll-breakdown.csv             # Excel / Spreadsheet CSV format of May 2026 payroll & deductions
│   ├── payroll-payslip-may-2026.json     # Detailed May 2026 processed payroll statement & earnings fixture
│   ├── msg-01-hr-payroll.json            # Exact full Gmail payload (HR payroll update)
│   ├── msg-02-john-proposal.json         # Exact full Gmail payload (John Doe proposal follow-up)
│   ├── msg-03-finance-invoice.json        # Exact full Gmail payload (Finance invoice notice)
│   ├── msg-04-github-pr.json             # Exact full Gmail payload (GitHub PR review request)
│   ├── msg-05-calendar-sync.json         # Exact full Gmail payload (Calendar sync invite)
│   └── index.ts                          # EXPECTED_REAL_MESSAGES & payslip export facade
├── scenarios/
│   ├── ask-1-summarize-emails/
│   │   ├── ask.json                      # Ask 1 (Read-only morning digest trigger & input)
│   │   ├── response.json                 # Ask 1 (Terminal outcome digest & verification)
│   │   ├── run-metadata.ts               # Ask 1 (Metadata: runId, goal, duration, cost, trace)
│   │   ├── pipeline-steps.ts             # Ask 1 (Full 18 canonical brain pipeline layers)
│   │   └── index.ts                      # ASK_1_SCENARIO export
│   ├── ask-2-autoreply-acting-as-me/
│   │   ├── ask.json                      # Ask 2 (Incoming Gmail event from John Doe)
│   │   ├── email-draft.json              # Ask 2 (Composed reply draft in Nelson's voice proposing Thu 2pm)
│   │   ├── guideline-nelson-persona.md   # Ask 2 RAG Guideline (Nelson persona playbook, tone & allowlist rules)
│   │   ├── guideline-nelson-persona.json # Ask 2 RAG Guideline (Structured pgvector chunk with similarity 0.972)
│   │   ├── response.json                 # Ask 2 (Sent reply details, Policy ALLOW, signed lease, terminal digest)
│   │   ├── run-metadata.ts               # Ask 2 (Metadata: runId, goal, duration, cost, trace)
│   │   ├── pipeline-steps.ts             # Ask 2 (Full 18 canonical brain pipeline layers with auto-reply flow)
│   │   └── index.ts                      # ASK_2_SCENARIO export
│   └── index.ts                          # AUTODO_SCENARIOS registry & getScenario() helper
├── mcp/
│   ├── registry.json                     # MCP server registry fixture (filesystem, fetch)
│   ├── call.json                         # Simulated MCP tool invocation fixture (stops at Policy/Approval)
│   └── index.ts                          # MCP_SERVERS & MCP_CALL_SIMULATION
├── rag/
│   ├── retrieval.json                    # Simulated vector/hybrid search request and results
│   └── index.ts                          # RAG_SIMULATION fixture
├── approvals/
│   └── index.ts                          # INITIAL_APPROVAL_REQUESTS fixture
├── triggers/
│   └── index.ts                          # TRIGGER_SOURCES and SCHEDULES fixtures
├── accounts/
│   └── index.ts                          # CONNECTED_ACCOUNTS and CONTACTS_PEOPLE fixtures
├── evaluations/
│   └── index.ts                          # EVAL_SCENARIOS benchmark suites
├── audit/
│   └── index.ts                          # AUDIT_TRAIL chronological governance ledger
├── runtime/
│   └── index.ts                          # RUNTIME_INFO and LOCAL_DEV_SECRETS fixtures
└── frontend/
    ├── index.ts                          # Frontend UI facade
    ├── AutoDoPersonalDeveloperLab.tsx    # Main developer lab container component
    ├── client/
    │   ├── ClientChatExperience.tsx      # Client-facing interactive chat & execution simulation
    │   └── index.ts                      # Client facade
    ├── components/
    │   ├── Sidebar.tsx                   # Left navigation sidebar & developer identity badge
    │   ├── Header.tsx                    # Top header bar with Scenario Switcher, run ID, status, trace, replay
    │   └── SafetyInvariantBanner.tsx     # Permanent control invariants panel
    └── views/
        ├── PipelineView.tsx              # Reusable 18-layer flow/timeline/trace/diff visualizer + dynamic Final Result
        ├── DashboardView.tsx             # Personal KPI metrics and recent runs
        ├── DecisionsView.tsx             # Model router, candidate evaluation matrix, and LLM controls
        ├── ContextView.tsx               # Context assembled preview and budget breakdown
        ├── RagView.tsx                   # RAG visual pipeline and search results
        ├── MemoryView.tsx                # 6 memory types and write decision pipeline
        ├── ToolsView.tsx                 # Unified Tool Gateway, lifecycle, and Source/Origin inspector
        ├── McpView.tsx                   # MCP server registry and call inspector
        ├── ApprovalsView.tsx             # Human-in-the-loop interactive approvals inbox
        ├── CapabilitiesView.tsx          # Capabilities RBAC matrix
        ├── SchedulerView.tsx             # Triggers & active schedules
        ├── AccountsView.tsx              # Connected OAuth2 accounts & people
        ├── EvalsView.tsx                 # Evaluation test suites & metrics
        ├── AuditView.tsx                 # 7-stage chronological audit ledger
        ├── ObservabilityView.tsx         # 18-span trace tree & log stream
        ├── RawStateView.tsx              # Formatted JSON state viewer
        └── RuntimeSecretsView.tsx        # Runtime versions & mock secrets with reveal/copy
```

---

## 2. Next.js App Entry Point

[`src/app/page.tsx`](file:///home/nelson/0/01-v2/src/app/page.tsx) is a clean, concise entry point rendering the modular developer lab component:

```typescript
"use client";

import AutoDoPersonalDeveloperLab from "./simulation-intended-server-data/frontend";

export default function Page() {
  return <AutoDoPersonalDeveloperLab />;
}
```

---

## 3. Reusable Scenario Architecture & Dynamic UI Switching

The AutoDo Developer Lab UI is **100% scenario-driven and dynamically adapts** whenever a scenario is selected:

1. **Header Switcher**: Switching between **`📥 Ask 1: Summarize`** and **`✉️ Ask 2: Auto-Reply (As Me)`** updates:
   - Run ID, Status, Goal, Trace ID, Mode, Duration, Tokens, and Cost.
2. **18 Brain Layers**: Dynamically renders the 18 layer cards, flow diagram, duration waterfall, trace tree, contract diffs, input/output inspectors, and assertion evidence for that active scenario.
3. **Terminal Outcome Digest**: Dynamically renders the scenario's summary title, bullet points, tool action, policy decisions, and verified memory writes.
4. **Adding New Scenarios**: Future asks (e.g. Ask 3, Ask 4) can simply add a new folder implementing `ScenarioContract` in `scenarios/`, and the UI will automatically support them without hardcoding!

---

## 4. Ask 1 vs. Ask 2 Scenarios Overview

### Ask 1 — Summarize Important Emails (Read-Only)

- **Folder**: [`scenarios/ask-1-summarize-emails/`](file:///home/nelson/0/01-v2/src/app/simulation-intended-server-data/scenarios/ask-1-summarize-emails/)
- **Trigger**: User prompt: _"Summarize unread important emails from today from Gmail."_
- **Action**: Read-only `gmail.list_messages`
- **Policy**: `READ_ONLY_SCOPE_PERMITTED` (`ALLOW`)
- **Outcome**: Morning summary of 5 emails (Payroll update, proposal, invoice, GitHub PR, calendar invite).

### Ask 2 — Auto-Reply to Client on Gmail (Acting as Me)

- **Folder**: [`scenarios/ask-2-autoreply-acting-as-me/`](file:///home/nelson/0/01-v2/src/app/simulation-intended-server-data/scenarios/ask-2-autoreply-acting-as-me/)
- **Trigger**: Incoming message from John Doe on thread `thread_proposal_02` asking for a 15-min call.
- **AI Persona**: Nelson (Tone: Professional, direct, polite).
- **RAG Memory**: Recalls John Doe is trusted partner (`#MEM-019`) & checks Calendar for free slots.
- **Draft Composed**: Proposes Thursday at 2:00 PM (Asia/Manila).
- **Policy Gate**: `TRUSTED_CONTACT_AUTO_REPLY_POLICY` (`ALLOW_WITH_AUDIT` with signed lease token).
- **Action**: Mutating `POST https://gmail.googleapis.com/gmail/v1/users/me/messages/send` via Gmail API.
- **Outcome**: Sent RFC 2822 reply in-thread + tentative calendar hold.

---

## 5. Source / Origin & AutoDo Ingress Transformation Chain

```text
SIMULATED GMAIL MESSAGE (Origin: gmail.googleapis.com)
  ├── sourceSystem: "Gmail"
  ├── provider: "Google Gmail"
  ├── origin: "gmail.googleapis.com"
  ├── sourceType: "SIMULATED_EXTERNAL_MESSAGE"
  ├── account: "dev@autodo.ai"
  ├── messageId: "msg_hr_01"
  ├── threadId: "thread_payroll_01"
  ├── historyId: "98129"
  ├── receivedAt: "2026-05-27T10:32:13.026Z"
  ├── headers: { From, To, Subject, Date }
  ├── labels: ["UNREAD", "IMPORTANT", "INBOX"]
  └── snippet: "Payroll processing is confirmed."
       │
       ▼
Gmail Adapter Normalization (Strips vendor coupling & binds trace ID)
       │
       ▼
ExternalCue (AutoDo Ingress Envelope)
  ├── cueId: "cue_gmail_001"
  ├── source: "GMAIL_EVENT"
  ├── sourceMessageId: "msg_hr_01"
  ├── sourceAccount: "dev@autodo.ai"
  ├── receivedAt: "2026-05-27T10:32:13.026Z"
  ├── payloadRef: "gmail-data/message-hr-01.json"
  └── provenance: "SIMULATED"
       │
       ▼
 1. Input / Cue (Layer 1)            [OBSERVED Ingress Payload]
       │
       ▼
 2. Perception / Parsing (Layer 2)   [DERIVED CanonicalCommand]
       │
       ▼
 3. Context Build (Layer 3)          [DERIVED ExecutionContextBundle]
       │
       ▼
 4. Retrieval / Memory (Layer 4)     [SIMULATED RAG Context]
       │
       ▼
 5. AI Reasoning (Layer 5)           [SIMULATED StructuredReasoningPlan]
```

---

## 6. Canonical 18-Layer Simulated Pipeline Flow

```text
Simulated Trigger (HTTP POST / Manual Run / Chat / Schedule)
       │
       ▼
 1. Input / Cue            [OBSERVED]   RawHttpRequestPayload → UnparsedCueEvent
       │
       ▼
 2. Perception / Parsing   [DERIVED]    UnparsedCueEvent → CanonicalCommand
       │
       ▼
 3. Context Build          [DERIVED]    CanonicalCommand → ExecutionContextBundle
       │
       ▼
 4. Retrieval / Memory     [SIMULATED]  ExecutionContextBundle → MemoryEnrichedContext
       │
       ▼
 5. AI Reasoning           [SIMULATED]  ModelPromptPayload → StructuredReasoningPlan
       │
       ▼
 6. Candidate Generation   [DERIVED]    StructuredReasoningPlan → CandidateActionSet
       │
       ▼
 7. Scoring & Ranking      [DERIVED]    CandidateActionSet → RankedCandidateProposal
       │
       ▼
 8. Grounding              [DERIVED]    RankedCandidateProposal → GroundedProposalWithEvidence
       │
       ▼
 9. Policy / Safety        [DERIVED]    GroundedProposalWithEvidence → PolicyDecisionEnvelope
       │
       ▼
10. Authorization          [PLANNED]    PolicyDecisionEnvelope → SignedExecutionLease
       │
       ▼
11. Planning               [DERIVED]    SignedExecutionLease → ExecutablePlanGraph
       │
       ▼
12. Durable Execution      [PLANNED]    ExecutablePlanGraph → DurableExecutionClaim
       │
       ▼
13. Tool / Adapter Action  [SIMULATED]  DurableExecutionClaim → RawToolHttpResponse (Gmail API)
       │
       ▼
14. Observation            [DERIVED]    RawToolHttpResponse → ImmutableObservationRecord (SHA256)
       │
       ▼
15. Verification           [DERIVED]    ImmutableObservationRecord → VerificationResult (5 Assertions)
       │
       ▼
16. Reward                 [SIMULATED]  VerificationResult → RewardSignal (0.90 Score)
       │
       ▼
17. Learning               [SIMULATED]  RewardSignal + VerificationResult → LearningUpdate
       │
       ▼
18. Verified Memory        [SIMULATED]  LearningUpdate + VerificationResult → VerifiedMemoryWriteResult
       │
       ▼
★ FINAL RESULT (Terminal Outcome Digest & Scheduled Follow-up — NOT Layer 19)
```

---

## 7. Strict Provenance Rules

Every telemetry point and data field must be truthfully labeled:

1. **`OBSERVED`**: Real data measured or received by the running system.
2. **`DERIVED`**: Deterministically computed from observed data.
3. **`SIMULATED`**: Synthetic prototype fixtures illustrating future backend responses.
4. **`SIMULATED_EXTERNAL_MESSAGE` / `SIMULATED_GMAIL_PAYLOAD`**: Simulated raw external payloads.
5. **`PLANNED`**: Architectural components not yet implemented on the server.
6. **`MOCK TELEMETRY`**: Synthetic system resource metrics.
7. **`MOCK SECRET`**: Development-only fake credential strings.

---

## 8. Continuous Documentation & Synchronization Invariant

The client chat displays the observed `/api/ai/reason` provider-attempt chain and
safety evaluation in an expandable **Raw AI diagnostics** block. These values
come from the server response; they are not reconstructed from UI fixtures.

The inbound Gmail simulator labels generated replies and calendar holds as AI
proposals only. The reasoning route does not grant policy authorization or
perform Gmail or Calendar side effects.

Dynamic Developer Lab runs label hard-coded retrieval, reasoning, safety,
authorization, execution, verification, and memory values as **SIMULATED** or
**PLANNED**. Only input actually received from the interactive client is
**OBSERVED**; a browser-generated Gmail fixture remains **SIMULATED**.
The Gmail simulator therefore emits `SIMULATED_EXTERNAL_MESSAGE`, never an
observed external Gmail provenance label.

Preset chat results explicitly say **SIMULATED**, and the client welcome text
does not claim that V1 currently monitors Gmail or executes Calendar actions.
Email-digest and payroll preset cards are likewise marked as simulated fixtures.

The client chat relies on the server adapter timeouts and does not impose a
shorter browser timeout. This prevents a successful but slightly slower
`/api/ai/reason` response from being discarded by the browser.

The header speed controls are explicitly labeled **Replay**. They change only
the simulated per-layer animation delay and do not alter API or AI-provider
latency and timeout behavior.

Run synchronization has three explicit paths: in-memory subscribers for the
same tab, `BroadcastChannel` for other open contexts, and the `storage` event as
a cross-tab fallback. This allows embedded Client Chat actions to update the
Developer Lab in the same page.

The sidebar, header, running card, and selected inspector use the same current
layer number. No view adds one to the shared replay position.

Replay position means **current layer**, not completed-layer count. The timer
uses that current layer's configured delay; completed progress excludes the
running or paused layer. Layer 18 runs for its configured delay before the run
becomes complete.

The client chat keeps an end-of-feed anchor in view when messages or processing
state change, so the active AI loading indicator is visible while the server
request is pending.

Within the Developer Lab, Client Chat stays mounted while another sidebar view
is selected. Its pending request, loading indicator, and conversation state
therefore survive leaving the view and returning to it.

> **MANDATORY ENGINEERING RULE**:
> Whenever any file in `src/app/simulation-intended-server-data/` is added, modified, renamed, or refactored (including contracts, fixtures, flows, or modular frontend views):
>
> 1. This `page.md` file MUST be updated in the same change step.
> 2. Directory trees, export tables, and contract maps MUST reflect the exact state of the codebase.
> 3. Zero stale documentation is permitted.
