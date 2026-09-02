# AutoDo 01-v2 — Modern 2026 Proactive AI OS (Manual Rebuild)

## 🏛️ Vision: The Post-Prompting Personal AI OS

AutoDo is a modern **2026 Proactive AI Operating System**. Moving beyond reactive chatbots that only reply when prompted, AutoDo operates as an **always-on, ambient digital personal assistant** that observes environmental cues, anticipates user needs, executes scheduled background loops, and acts autonomously within zero-trust governance boundaries.

* **Rebuild Route**: `http://localhost:3000/app-v2`
* **Source Root**: `src/app/app-v2/`
* **Execution Model**: **100% Real Live AI APIs & Observed State (Zero Fake Mocks)**

---

## 🪵 Triple-Window Real-Time Logging & Observability

To inspect the real system flow as we build, structured logging is active across 3 windows:

```text
┌────────────────────────────┐  ┌────────────────────────────┐  ┌────────────────────────────┐
│   1. Chrome DevTools F12   │  │  2. Terminal Server Logs   │  │   3. In-App UI Inspector   │
│   (Browser Inspect Console)│  │   (Next.js Server Process) │  │  (Logs & Raw State Tabs)   │
└────────────────────────────┘  └────────────────────────────┘  └────────────────────────────┘
```

1. **Browser Console (`F12 ➔ Console`)**: Color-coded, real-time client events, cue dispatches, and streaming AI responses.
2. **Terminal Logs (`npm run dev`)**: Server-side Route Handler execution, AI API request payloads, token counts, and vector queries.
3. **In-App Layer Inspector**: On-screen structured JSON logs attached with `traceId`, `spanId`, duration in `ms`, and provenance badges.

---

## ⚡ Direct Live AI API Stack (No Simulation Mocks)

Every layer connects directly to live production-grade AI models:

* **Layer 4 (RAG & Semantic Retrieval)**: Live **NVIDIA Nemotron-3-Embed-1B** generating real 2048-dimensional dense vectors.
* **Layer 5 (AI Deliberation & Planning)**: Live **NVIDIA DeepSeek v4 Pro / GPT-OSS 120B / Gemini 2.5 Pro** extracting real chain-of-thought (`reasoning_content`).
* **Layer 9 (Safety Guardrail)**: Live **Meta Llama Guard 4 (12B)** evaluating real prompt hazard categories (MLCommons S1–S14).
* **Layer 15 (Verification)**: Live deterministic test assertions evaluating real tool outputs.

---

## 🔍 Zero Hidden Flow: 100% Full Observability Guarantee

For learning and developer inspection, **no runtime state is ever hidden**. Every layer in the UI provides 8 deep inspection lenses:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Overview] [Input] [Output] [Lineage] [Evidence] [Metrics] [Logs] [Raw JSON]│
└─────────────────────────────────────────────────────────────────────────────┘
```

* **1. Overview**: Human-readable layer responsibility, lifecycle state, and provenance.
* **2. Input**: Exact immutable payload that entered the layer.
* **3. Output**: Exact structured contract artifact produced by the layer.
* **4. Lineage**: Transformation history showing how fields evolved from preceding layers.
* **5. Evidence**: Cryptographic citations, document IDs, and verified facts.
* **6. Metrics**: Real execution latency (ms), token usage, and API dollar cost.
* **7. Logs**: Structured log records tagged with OpenTelemetry `traceId` and `spanId`.
* **8. Raw JSON**: Complete serialized JSON state for instant copying and debugging.

---

## 🌲 Target Architectural Folder & File Blueprint

```text
src/app/app-v2/
├── README.md                      # Modern 2026 Architecture & Visual Blueprint
├── page.tsx                       # Main UI Dashboard / Pipeline Explorer (RSC)
├── types.ts                       # Canonical 18-Layer Domain Contracts (Immutable DTOs)
│
├── core/                          # Pipeline Engine & Deterministic Governance
│   ├── pipeline.ts                # 18-Layer Brain Pipeline Orchestrator
│   ├── context.ts                 # Layer 3: Context Builder & Timezone Resolver
│   ├── scoring.ts                 # Layer 7: Deterministic Candidate Scoring
│   ├── grounding.ts               # Layer 8: Evidence & Source Grounding
│   ├── policy.ts                  # Layer 9: Zero-Trust Safety Policy Gate
│   ├── authorization.ts           # Layer 10: Capability Lease & Human Approval Gate
│   ├── planning.ts                # Layer 11: DAG Execution Graph Builder
│   ├── durable.ts                 # Layer 12: Idempotency & Lease Claim Manager
│   └── verification.ts            # Layer 15: Deterministic Test Assertions Proof
│
├── rag/                           # Retrieval-Augmented Generation (RAG Subsystem)
│   ├── retriever.ts               # Layer 4: Semantic Vector Retriever (Hybrid Vector + Keyword)
│   ├── embeddings.ts              # Layer 4: NVIDIA Nemotron-3-Embed (2048d Dense Vectors)
│   ├── chunker.ts                 # Document Chunker (Token-Aware Markdown Splitter)
│   ├── reranker.ts                # Cross-Encoder Reranker & Relevance Filter
│   └── knowledge-base.ts          # Persona Rules Loader (knowledge_base/triage_rules.md #DOC-012)
│
├── ai/                            # Provider-Neutral AI Reasoning Subsystem
│   ├── router.ts                  # Cascading Multi-Model AI Router
│   ├── guard.ts                   # Layer 9: Meta Llama Guard 4 (MLCommons S1–S14)
│   ├── deepseek.ts                # Layer 5: NVIDIA DeepSeek v4 Pro Adapter
│   ├── gpt-oss.ts                 # Layer 5: NVIDIA GPT-OSS 120B/20B (Chain-of-Thought)
│   ├── gemini.ts                  # Layer 5: Google Gemini 2.5 Pro Adapter
│   └── ollama.ts                  # Layer 5: Local Offline Fallback Adapter
│
├── learning/                      # Reinforcement & Self-Improvement Subsystem (AutoDo Core)
│   ├── reward.ts                  # Layer 16: Mathematical Reward Calculator (Success + Latency + Cost)
│   ├── optimizer.ts               # Layer 17: Routing Weights & Strategy Adaptation Engine
│   └── preference-model.ts        # User Feedback & Tone Calibration Model
│
├── storage/                       # Durable Memory & Knowledge Store
│   ├── memory.ts                  # 6 Memory Types (Working, Episodic, Semantic, Procedural)
│   ├── verified-memory.ts         # Layer 18: Verified Long-Term Memory Writer
│   └── vector-store.ts            # PostgreSQL pgvector Store & HNSW Indexing
│
├── tools/                         # External Adapters (Behind Explicit Contracts)
│   ├── gmail.ts                   # Layer 13: Gmail API Adapter (Send, Search, Draft)
│   ├── calendar.ts                # Layer 13: Google Calendar Adapter (Events, Holds)
│   └── mcp.ts                     # Layer 13: Model Context Protocol Client Gateway
│
└── ui/                            # Modern 2026 UI Layer (React 19 Server & Client Islands)
    ├── layout/                    # Layout & Shell Elements
    │   ├── Header.tsx             # Live Status, Telemetry & Playback Scrubber
    │   ├── Sidebar.tsx            # Navigation & 18-Layer Brain Quick Jump
    │   └── InvariantBanner.tsx    # Zero-Trust Safety Boundary Badge
    │
    ├── pipeline/                  # 18-Layer Interactive Pipeline Views
    │   ├── PipelineVisualizer.tsx # Flow Graph, Timeline & Step Scrubber
    │   ├── LayerCard.tsx          # Collapsible Step Card with Provenance Badges
    │   ├── LayerInspector.tsx     # 8-Tab Deep Inspector (Overview, In, Out, Diff, Evidence...)
    │   └── TerminalOutcomeCard.tsx# Final Verified Result & Assertions Proof
    │
    ├── client/                    # Autonomous Client Experience
    │   ├── ClientChat.tsx         # Proactive Assistant Chat & Stream Delivery
    │   └── SuggestionChips.tsx    # Live Contextual Action Suggestions
    │
    ├── governance/                # Zero-Trust Governance & Human-in-the-Loop
    │   ├── ApprovalInbox.tsx      # Personal Approval Gate (Human Consent Inbox)
    │   ├── PolicyDecisionView.tsx # MLCommons S1–S14 Guardrail Risk Inspector
    │   └── CapabilitiesView.tsx   # Cryptographic Lease & Permission Scope Viewer
    │
    └── observability/             # Real-Time Telemetry & Memory Inspection
        ├── TraceTree.tsx          # OpenTelemetry Distributed Span Waterfall
        ├── MemoryExplorer.tsx     # 6 Memory Tiers & Vector Similarity Viewer
        ├── AuditLedgerView.tsx    # 7-Stage Cryptographic Hash Chain Audit
        └── SecretsView.tsx        # Zero-Leak Credential Boundary Inspector
```

---

## 🧠 The 18 Canonical Brain Layers

```text
Cue (Ambient/Cron/Chat) ➔ Perceive ➔ Build Context ➔ Retrieve Memory (RAG) ➔ Reason ➔ 
Generate Candidates ➔ Score ➔ Ground ➔ Policy Gate ➔ Authorize ➔ Plan ➔ 
Durable Claim ➔ Act ➔ Observe ➔ Verify ➔ Reward ➔ Learn ➔ Verified Memory ➔ Final Result
```

### Phase 1: Ingress & Context Assembly
* **Layer 1: Input / Cue** — Untrusted ingress boundary & distributed trace creation (`UnparsedCueEvent`).
* **Layer 2: Perception / Parsing** — Intent extraction & multilingual normalization (`CanonicalCommand`).
* **Layer 3: Context Build** — Runtime user state & timezone enrichment (`ExecutionContextBundle`).
* **Layer 4: Retrieval / Memory (RAG)** — Live 2048-dim vector search & rule injection (`MemoryEnrichedContext`).

### Phase 2: AI Deliberation & Candidate Generation
* **Layer 5: AI Reasoning** — Live multi-model reasoning with native chain-of-thought (`StructuredReasoningPlan`).
* **Layer 6: Candidate Generation** — Discrete action generation (`CandidateActionSet[]`).
* **Layer 7: Scoring & Ranking** — Deterministic score computation: $\text{Score} = \text{Relevance} \times \text{Quality} - \text{RiskPenalty}$.
* **Layer 8: Grounding** — Cryptographic evidence verification against retrieved facts.

### Phase 3: Zero-Trust Governance & Planning Gate
* **Layer 9: Policy / Safety** — Live MLCommons S1–S14 guardrails with Meta Llama Guard 4.
* **Layer 10: Authorization** — Cryptographic capabilities, RBAC, and Personal Approval Gate (`SignedExecutionLease`).
* **Layer 11: Planning** — Directed Acyclic Graph (DAG) dependency execution graph (`ExecutablePlanGraph`).
* **Layer 12: Durable Execution** — Idempotency claims, leases, and transaction boundaries.

### Phase 4: Execution, Observation & Learning
* **Layer 13: Tool / Adapter Action** — External API dispatchers (Gmail API, Google Calendar).
* **Layer 14: Observation** — Capture immutable external reality (HTTP $200 \neq$ verified business success).
* **Layer 15: Verification** — Deterministic test assertions proof (`VerificationResult`).
* **Layer 16: Reward Signal** — Mathematical reinforcement signal based on verified outcomes (`RewardSignal`).
* **Layer 17: Learning** — Strategy optimization & provider preferences update (`LearningUpdate`).
* **Layer 18: Verified Memory** — Long-term pgvector memory persistence (`VerifiedMemoryWriteResult`).

---

## 🛡️ Non-Negotiable Control Invariants
1. `AI Choice ≠ Permission`
2. `High Score ≠ Permission`
3. `Grounding ≠ Permission`
4. `Reward ≠ Permission`
5. `Memory ≠ Permission`
6. `Policy & Authorization stay strictly outside the LLM.`
