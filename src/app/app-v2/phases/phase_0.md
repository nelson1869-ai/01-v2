# Phase 0 — Makita Mo Muna ang Browser

> **Layunin:** Bago mag-isip ng architecture o TypeScript, kailangan mong  
> makita ang kahit na isang bagay sa browser. Ito ang pinaka-natural na simula.

> **Gabay sa Git:** Pagkatapos ng bawat lesson, may `git` command na dapat  
> i-run mo. Ito ang paraan natin para ma-track ang progress.

---

## Ano ang Git? (Mabilis na Paliwanag)

```
Ang git ay parang "save button" para sa buong folder.

git add .              ← i-stage lahat ng changes (ilipat sa "basurahan bago ihulog")
git commit -m "..."    ← i-save nang permanente kasama ang mensahe
git push               ← i-upload sa GitHub
```

```
Working Directory  →  git add  →  Staging  →  git commit  →  Local Repo  →  git push  →  GitHub
(mga files mo)                                 (naka-save)                              (online)
```

---

## Lesson 0.1 — Hello World sa Browser

### Ano ang gagawin?

Ang pinaka-simpleng Next.js page — isang function na nag-rereturn ng JSX.

### Buksan ang file:

`src/app/app-v2/page.tsx`

### I-type ito:

```tsx
export default function Page() {
  return <h1>Hello, AutoDo!</h1>;
}
```

### Subukan:

1. I-run sa terminal:
   ```bash
   npm run dev
   ```
2. Buksan ang browser: `http://localhost:3000/app-v2`
3. Makikita mo ang: **Hello, AutoDo!**

### Ano ang natutunan mo?

| Konsepto | Paliwanag |
|----------|-----------|
| `page.tsx` | Ang filename ang nagiging URL path (`/app-v2`) |
| `export default` | Ito ang lalabas sa browser — required sa bawat page |
| `function Page()` | Isang React Server Component — nagre-render sa server |
| `return (...)` | Ang JSX na lalabas bilang HTML sa browser |
| `<h1>` | Heading HTML tag — makikita mo bilang malaking text |

### 📝 Git Commit pagkatapos ng Lesson 0.1:

```bash
git add src/app/app-v2/page.tsx
git commit -m "feat(phase-0): hello world page at /app-v2 route"
```

---

## Lesson 0.2 — Gumawa ng Sariling Component

### Ano ang gagawin?

Ang component ay isang function na pwede mong gamitin ulit-ulit tulad ng HTML tag.

### I-update ang `src/app/app-v2/page.tsx`:

```tsx
// Ito ay isang component — function na may CAPITAL na unang letra
function StatusBadge() {
  return <span>🟢 Live</span>;
}

// Ang main page component — ginagamit niya ang StatusBadge
export default function Page() {
  return (
    <main>
      <h1>AutoDo</h1>
      <StatusBadge />
      <StatusBadge />
    </main>
  );
}
```

### Subukan:

Refresh ang browser. Makikita mo ang "🟢 Live" dalawang beses.

### Ano ang natutunan mo?

| Konsepto | Paliwanag |
|----------|-----------|
| `function StatusBadge()` | Isang component — kailangang may capital letter |
| `<StatusBadge />` | Paggamit ng component — parang custom HTML tag |
| Self-closing tag | Kapag walang laman, pwede `<StatusBadge />` |
| Composition | Pwede mag-lagay ng component sa loob ng component |

### 📝 Git Commit pagkatapos ng Lesson 0.2:

```bash
git add src/app/app-v2/page.tsx
git commit -m "feat(phase-0): add reusable StatusBadge component"
```

---

## Lesson 0.3 — Magdagdag ng Styling (Tailwind CSS)

### Ano ang gagawin?

Sa Next.js + Tailwind, hindi tayo gumagawa ng CSS files.  
Ginagamit natin ang `className` at ready-made na classes ng Tailwind.

### I-update ang `src/app/app-v2/page.tsx`:

```tsx
function StatusBadge() {
  // inline-flex = parang flex pero inline
  // items-center = align sa gitna
  // gap-1.5 = espasyo sa pagitan
  // text-sm = maliit na text
  // text-emerald-400 = berdeng kulay
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-emerald-400">
      <span className="size-2 rounded-full bg-emerald-400"></span>
      Live
    </span>
  );
}

export default function Page() {
  // min-h-screen = buong taas ng screen
  // bg-[#050711] = custom dark na kulay (hex color)
  // text-white = puting text
  // p-8 = padding sa lahat ng sides
  return (
    <main className="min-h-screen bg-[#050711] text-white p-8">

      {/* mt-0 mb-2 = walang margin sa itaas, maliit sa baba */}
      <h1 className="text-2xl font-bold text-indigo-400">
        AutoDo 01-v2
      </h1>

      <p className="text-gray-400 text-sm mb-4">
        Personal AI OS — Phase 0
      </p>

      <StatusBadge />

    </main>
  );
}
```

### Subukan:

Refresh ang browser. Makikita mo ang dark background, indigo title, at green badge.

### Ano ang natutunan mo?

| Konsepto | Paliwanag |
|----------|-----------|
| `className` | Sa JSX, hindi `class` kundi `className` |
| Tailwind classes | Pre-built na CSS utilities — hindi na kailangan ng CSS file |
| `bg-[#050711]` | Pwede ring gumamit ng arbitrary hex colors sa Tailwind |
| `{/* comment */}` | Ganito mag-lagay ng comment sa loob ng JSX |
| Nesting | Pwede mag-nest ng components — `<main>` > `<h1>` > etc. |

### 📝 Git Commit pagkatapos ng Lesson 0.3:

```bash
git add src/app/app-v2/page.tsx
git commit -m "feat(phase-0): add Tailwind styling — dark theme and green status badge"
```

---

## Phase 0 Completion Test

Gawin lamang ito pagkatapos ma-complete at ma-commit ang Lessons 0.1–0.3.

### 1. Automated validation

Sa project root, i-run:

```bash
npm run lint && npx tsc --noEmit
```

Expected:

- Walang ESLint error.
- Walang TypeScript error.
- Karaniwang walang output ang `npx tsc --noEmit` kapag successful.
- Kapag may warning, i-copy ang warning at ipakita sa mentor para ma-review.

### 2. Run the app

```bash
npm run dev
```

Pagkatapos, buksan ang `http://localhost:3000/app-v2`.

### 3. Check the final Phase 0 page

Expected visual flow:

```text
Next.js dev server
        │
        ▼
   /app-v2 route
        │
        ▼
page.tsx + StatusBadge
        │
        ▼
Styled page in browser
```

Kapag successful, ito ang dapat mong **OBSERVE** sa browser:

- Dark background.
- Indigo na `AutoDo 01-v2` heading.
- `Personal AI OS — Phase 0` subtitle.
- Green dot at `Live` status badge.

Wala pang required F12 Console log sa Phase 0. Ang browser page mismo ang runtime output.
Ang listahan sa itaas ay expected guide; ang page na talagang nakikita mo sa browser ang actual **OBSERVED output**.

### 4. Ipakita ang output sa mentor

Kapag magre-review gamit ang `d`, puwedeng ipakita ang:

1. Output ng `npm run lint && npx tsc --noEmit`.
2. Screenshot ng buong `/app-v2` page.
3. Exact terminal o browser error kung may hindi gumana.

Huwag isama sa screenshot ang passwords, tokens, private tabs, o personal information.

### 5. Failure indicators

- `404` ang `/app-v2` route.
- Blank page o may red browser error.
- May ESLint o TypeScript error sa terminal.
- Hindi dark ang background o hindi visible ang `Live` badge.

### 6. Verify the lesson commits

```bash
git log --oneline
```

Expected: makikita ang exact commit message ng bawat lesson:

```text
feat(phase-0): hello world page at /app-v2 route
feat(phase-0): add reusable StatusBadge component
feat(phase-0): add Tailwind styling — dark theme and green status badge
```

Kapag may nawawalang required commit, huwag munang pumunta sa Phase 1.

---

## Summary ng Phase 0

| Lesson | Natututo | Commit |
|--------|----------|--------|
| 0.1 | Next.js page, routing, JSX, export default | `feat(phase-0): hello world page at /app-v2 route` |
| 0.2 | React Component, composition, reusability | `feat(phase-0): add reusable StatusBadge component` |
| 0.3 | Tailwind CSS, className, dark theme | `feat(phase-0): add Tailwind styling — dark theme and green status badge` |

---

## Kapag tapos na ang Phase 0, ang `page.tsx` mo ay ganito:

```
✅ Visible sa browser: http://localhost:3000/app-v2
✅ May sariling component (StatusBadge)
✅ May dark theme gamit ang Tailwind
✅ 3 commits na sa git history
```

**Next:** [Phase 1 — Gawing Interactive](./phase_1.md)
