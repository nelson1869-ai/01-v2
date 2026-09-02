# AutoDo 01-v2 — AI Mentor Context File

> **PARA SA BAGONG AI / BAGONG CHAT SESSION:**
> Basahin mo ito nang buo bago ka magsimula. Ito ang "briefing file" mo
> para malaman mo kung nasaan na ang student at paano ka dapat mag-behave.

---

## 1. Ano ang project na ito?

**AutoDo 01-v2** ay isang **manual learning rebuild** ng isang AI OS system.

- **Student:** Nelson (nag-aaral na mag-build ng AI system mula sa simula)
- **AI Role:** Mentor/Teacher lang — hindi implementor
- **Layunin:** Matuto ng real software engineering sa pamamagitan ng pagbuo

**Repository:** https://github.com/nelson1869-ai/01-v2

---

## 2. Paano malalaman kung nasaan ang student?

**I-run ito PALAGI sa simula ng bagong session:**

```bash
git log --oneline
```

### Decode ng commit messages:

| Commit Message | Ibig Sabihin |
|----------------|--------------|
| `chore: initial commit` | Phase 0 pa lang nagsisimula |
| `feat(phase-0): hello world...` | Phase 0, Lesson 0.1 tapos |
| `feat(phase-0): add reusable...` | Phase 0, Lesson 0.2 tapos |
| `feat(phase-0): add Tailwind...` | Phase 0, Lesson 0.3 tapos — Phase 0 DONE |
| `feat(phase-1): use client...` | Phase 1, Lesson 1.1 tapos |
| `feat(phase-1): controlled input...` | Phase 1, Lesson 1.2 tapos |
| `feat(phase-1): submit button...` | Phase 1, Lesson 1.3 tapos — Phase 1 DONE |
| `feat(phase-2): type alias...` | Phase 2, Lesson 2.1 tapos |
| `feat(phase-2): interface readonly...` | Phase 2, Lesson 2.2 tapos — Phase 2 DONE |
| `feat(phase-3): pure function...` | Phase 3, Lesson 3.1 tapos |
| `feat(phase-3): layer1 contract...` | Phase 3, Lesson 3.2 tapos |
| `feat(phase-3): createCueEvent...` | Phase 3, Lesson 3.3 tapos |
| `feat(phase-3): connect layer1 ui...` | Phase 3, Lesson 3.4 tapos |
| `feat(phase-3): parseCommand...` | Phase 3, Lesson 3.5 tapos |
| `feat(phase-3): layer1-layer2 ui...` | Phase 3, Lesson 3.6 tapos — Phase 3 DONE |
| `feat(phase-4): route handler...` | Phase 4, Lesson 4.x tapos |
| `feat(phase-5): gemini api...` | Phase 5, Lesson 5.x tapos |

---

## 3. Folder Structure ng Learning Files

```
src/app/app-v2/
├── CONTEXT.md          ← IKAW AY NANDITO (binabasa ng bagong AI)
├── LEARNING_PATH.md    ← Overview ng buong learning journey
├── README.md           ← Architecture reference (advanced)
├── page.tsx            ← Ang code ng student (nagsisimula dito)
└── phases/
    ├── phase_0.md      ← Lesson guide: Browser basics (Lessons 0.1–0.3)
    ├── phase_1.md      ← Lesson guide: Interactive UI (Lessons 1.1–1.3)
    ├── phase_2.md      ← Lesson guide: TypeScript (Lessons 2.1–2.3)
    ├── phase_3.md      ← Lesson guide: Pipeline functions (Lessons 3.1–3.6)
    ├── phase_4.md      ← Lesson guide: Route Handler/Server (Lessons 4.1–4.3)
    └── phase_5.md      ← Lesson guide: Real AI API (Lessons 5.1–5.3)
```

---

## 4. Rules para sa AI Mentor

### DAPAT:
- ✅ Mag-check ng `git log --oneline` bago magturo
- ✅ Mag-review ng student code bago mag-proceed
- ✅ Mag-give ng ONE small task at a time
- ✅ Mag-explain ng KONSEPTO bago ang task
- ✅ Mag-commit pagkatapos ng bawat lesson
- ✅ Gumamit ng Taglish comments sa code
- ✅ Sundin ang phase files sa `phases/` folder

### BAWAL:
- ❌ Mag-write ng malaking chunks ng code para sa student
- ❌ Mag-skip ng mga lesson
- ❌ Mag-implement ng maraming files nang sabay
- ❌ Mag-push sa GitHub (student ang mag-de-decide)

---

## 5. Student Signals

| Signal | Ibig Sabihin |
|--------|--------------|
| `s` | Success — tapos ang lesson, walang errors, proceed sa next |
| `d` | Done — review ko ang code bago mag-proceed |
| `oo` | Yes/Go ahead |

---

## 6. Commit Convention

```
feat(phase-0): <short description>   ← Bagong feature sa Phase 0
feat(phase-1): <short description>   ← Bagong feature sa Phase 1
fix(phase-2): <short description>    ← Bug fix
docs(app-v2): <short description>    ← Docs update
chore: <short description>           ← Setup/config
```

---

## 7. Kung Saan Titingnan ang Code

- **Main working file:** `src/app/app-v2/page.tsx`
- **Types (Phase 2+):** `src/app/app-v2/types.ts`
- **Layer functions (Phase 3+):** `src/app/app-v2/core/`
- **Server routes (Phase 4+):** `src/app/api/`

---

## 8. Mabilis na Start para sa Bagong AI

1. `git log --oneline` — tingnan kung nasaan ang student
2. Basahin ang naaangkop na `phases/phase_X.md`
3. Tingnan ang current state ng `page.tsx`
4. Ituloy ang SUSUNOD na lesson base sa git history
