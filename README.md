# AutoDo 01-v2

AutoDo 01-v2 is a personal learning-by-building rebuild of AutoDo using
Next.js, React, and TypeScript.

The current V1 combines:

- an 18-layer Developer Lab visualization;
- a client-facing assistant prototype;
- simulated Gmail, Calendar, policy, execution, verification, and memory data;
- server routes for AI reasoning, safety evaluation, embeddings, and translation;
- NVIDIA, Gemini, Ollama, and deterministic fallback adapters.

## Current truth boundary

The Developer Lab is an acceptance and learning surface, not proof that every
displayed capability exists on the server.

- **OBSERVED** means the running system actually received or measured it.
- **DERIVED** means it was deterministically calculated from observed data.
- **SIMULATED** means it is a prototype fixture.
- **PLANNED** means the server capability is not implemented yet.

The reasoning route can propose actions, but it does not grant policy
permission, issue authorization, send Gmail messages, or create Calendar
events. Provider attempts, fallback reasons, and safety results are returned as
structured diagnostics. Real secrets remain server-side and ignored by Git.

## Run locally

```bash
npm install
npm run dev
```

Open:

- `http://localhost:3000` for the Developer Lab
- `http://localhost:3000/client` for the client prototype

## Validation

```bash
npm run lint
npm run build
```

## Server routes

- `POST /api/ai/reason`
- `POST /api/ai/guard`
- `POST /api/ai/embed`
- `POST /api/ai/translate`

All request bodies are runtime-validated. Invalid JSON, non-object bodies, and
invalid field types return HTTP 400 with structured validation details.

## Development status

This is a personal V1 learning project and remains under active development.
The simulated pipeline should be replaced incrementally with observed and
derived server behavior; it must never be relabeled as real before that work
exists.
