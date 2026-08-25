/* File structures for the projects that publish one.

   Two spaces separate a path from its trailing note; the renderer splits
   on that and dims the note.

   Production systems are deliberately absent - their internal layout is
   not ours to publish. */

export const FILE_TREES = {
  'govguide-sa': `govguide-sa/
├─ client/
│  └─ src/
│     ├─ features/
│     │  ├─ search/         NSFAS rule lookup
│     │  ├─ checklist/      document requirements
│     │  ├─ analyser/       rejection-letter upload
│     │  └─ auth/           Supabase session
│     └─ lib/supabase.ts
├─ server/
│  └─ src/
│     ├─ routes/
│     │  ├─ search.ts       tsvector full-text query
│     │  └─ analyse.ts      Gemini vision call
│     ├─ services/
│     │  └─ gemini.ts       document checker
│     └─ index.ts
├─ supabase/
│  ├─ migrations/           tables + RLS policies
│  └─ seed/                 parsed policy documents
└─ package.json`,

  'ai-learning-adventure': `ai-learning-adventure/
├─ src/
│  ├─ features/
│  │  ├─ missions/          10-mission flow
│  │  ├─ quiz/              56 questions
│  │  ├─ flashcards/        30 cards
│  │  ├─ progress/          XP, badges
│  │  └─ admin/             content CMS
│  ├─ ai/
│  │  ├─ router.ts          provider selection
│  │  └─ providers/
│  │     ├─ groq.ts
│  │     ├─ gemini.ts
│  │     ├─ ollama.ts
│  │     ├─ openai.ts
│  │     └─ mock.ts         zero-config fallback
│  ├─ stores/
│  │  ├─ progress.ts        Zustand
│  │  └─ content.ts
│  ├─ components/
│  └─ main.tsx
├─ tests/                   76 specs
└─ vite.config.ts`,

  'nexusos': `nexusos/
├─ src/
│  ├─ app/
│  │  ├─ router.tsx         centralized route tree
│  │  ├─ providers.tsx      composed context
│  │  └─ layout/            shell, sidebar, topbar
│  ├─ features/             self-contained modules
│  │  ├─ dashboard/
│  │  │  ├─ components/
│  │  │  ├─ hooks/
│  │  │  ├─ store.ts        Zustand slice
│  │  │  └─ index.ts        public surface
│  │  ├─ analytics/
│  │  └─ settings/
│  ├─ shared/
│  │  ├─ ui/                design-system primitives
│  │  ├─ hooks/
│  │  └─ lib/
│  └─ main.tsx
└─ vite.config.ts           lazy-load chunk config`,

  'facial-recognition-attendance': `facial-recognition-attendance/
├─ app/
│  ├─ __init__.py           Flask app factory
│  ├─ routes/
│  │  ├─ auth.py            login, roles
│  │  ├─ attendance.py      mark, review
│  │  └─ admin.py           enrolment, reports
│  ├─ vision/
│  │  ├─ capture.py         webcam frame loop
│  │  ├─ encoder.py         face → 128-d encoding
│  │  └─ matcher.py         distance threshold
│  ├─ models.py             staff, attendance
│  ├─ templates/
│  └─ static/
├─ dataset/                 enrolled face images
├─ encodings.pickle         cached encodings
├─ requirements.txt
└─ run.py`,

  'svg-converter': `svg-converter/
├─ client/
│  └─ src/
│     ├─ components/
│     │  ├─ Dropzone.tsx    drag-and-drop upload
│     │  ├─ Preview.tsx     live SVG render
│     │  └─ Controls.tsx    threshold, palette
│     └─ lib/api.ts
├─ server/
│  └─ src/
│     ├─ routes/
│     │  └─ convert.ts      validated REST endpoint
│     ├─ tracer/
│     │  ├─ quantize.ts     colour reduction
│     │  ├─ contours.ts     edge → path points
│     │  └─ build.ts        paths → SVG document
│     ├─ validation/        schema + size guards
│     └─ index.ts
└─ package.json`,

  'peer-to-peer-tutoring': `peer-tutoring/
└─ app/src/main/
   ├─ java/com/peertutor/
   │  ├─ ui/                Activity + ViewModel
   │  │  ├─ auth/           login, register
   │  │  ├─ sessions/       browse, book, schedule
   │  │  ├─ scan/           QR attendance
   │  │  └─ admin/          approvals, reports
   │  ├─ data/
   │  │  ├─ repository/     single source of truth
   │  │  ├─ model/          Session, Tutor, User
   │  │  └─ firebase/       auth + Firestore
   │  └─ util/              QR gen, validators
   ├─ res/
   │  ├─ layout/
   │  └─ values/
   └─ AndroidManifest.xml`,
};
