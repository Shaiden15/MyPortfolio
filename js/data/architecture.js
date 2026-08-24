/* Architecture layers per project, rendered top-down in the detail modal.

   Keyed by project slug (see lib/slug.js), so a card and its architecture
   stay linked without needing an id in the markup.

     fe  frontend        be  backend / services        db  data */

export const ARCHITECTURE = {
  'payitsmart': {
    fe: ['React 19', 'Vite', 'TanStack Query', 'MUI', 'WebSocket Client', 'Role-based Routing'],
    be: ['Node.js', 'Express', 'Socket.io', 'JWT', 'Passport.js', 'RBAC'],
    db: ['PostgreSQL', 'Prisma ORM'],
  },
  'biometrics24-7': {
    fe: ['React 19', 'Vite', 'WebSocket UI', 'Live Attendance Dashboard', 'Enrolment UI'],
    be: ['Node.js', 'Express', 'Socket.io', 'IoT Protocol', 'Fingerprint SDK', 'JWT'],
    db: ['PostgreSQL'],
  },
  'buzzticket': {
    fe: ['React 19', 'Vite', 'Paystack JS SDK', 'QR Code Display', 'Event Dashboard', 'Organiser Portal'],
    be: ['Node.js', 'Express', 'Paystack API', 'Subaccount Split', 'AWS S3', 'QR Generation', 'JWT'],
    db: ['PostgreSQL'],
  },
  'whizzfleet': {
    fe: ['React', 'TypeScript', 'TanStack Query', 'Custom DateTimePicker', 'Role-gated UI (Director / Controller)'],
    be: ['Express', 'Prisma ORM', 'Cache Invalidation', 'Alert System', 'Registration-expiry Cron', 'Vitest'],
    db: ['PostgreSQL'],
  },
  'awehpay': {
    fe: ['Flutter', 'Dart', 'Riverpod', 'GoRouter', 'Custom 7-day Bar Chart'],
    be: ['Firebase Auth', 'FieldValue.increment (atomic counters)', 'Node.js Analytics'],
    db: ['Firestore'],
  },
  'mediintel': {
    fe: ['React 19', 'Vite', 'Multi-branch Transfer UI', 'Prescription Workflows', 'Audit Log Viewer'],
    be: ['Node.js', 'Express', 'Audit Trail Middleware', 'Compliance Logging', 'JWT'],
    db: ['PostgreSQL', 'Prisma ORM'],
  },
  'govguide-sa': {
    fe: ['React 19', 'Supabase Auth Client', 'Document Upload', 'Full-text Search UI', 'Gemini Chat Interface'],
    be: ['Express', 'Supabase RLS', 'PostgreSQL FTS (tsvector)', 'Google Gemini Vision'],
    db: ['Supabase (PostgreSQL)', 'Row-level Security'],
  },
  'ai-learning-adventure': {
    fe: ['React', 'TypeScript', 'Zustand', 'Framer Motion', 'Admin CMS', 'Quiz Engine', '76 Vitest Tests'],
    be: ['AI Router (Groq / Gemini / Ollama / OpenAI)', 'Mock-mode Fallback', 'Provider-agnostic Interface'],
    db: ['Zustand Store (client-side)'],
  },
  'nexusos': {
    fe: ['React 19', 'TypeScript', 'Zustand', 'Vite', 'Feature-based Architecture', 'Centralized Routing', 'Lazy-loaded Modules', 'Reusable Layout System'],
  },
  'facial-recognition-attendance': {
    fe: ['Flask Templates', 'Webcam Feed (getUserMedia)', 'Real-time Face Detection UI', 'Role-based Views (Admin / Staff)'],
    be: ['Python', 'Flask', 'OpenCV', 'face_recognition Library', 'Attendance Logging'],
    db: ['SQLite'],
  },
  'svg-converter': {
    fe: ['React 19', 'Tailwind', 'Drag-and-drop Upload', 'Live SVG Preview'],
    be: ['Express', 'Custom Image Parser', 'SVG Generation Pipeline', 'Validated REST API'],
  },
  'peer-to-peer-tutoring': {
    fe: ['Android (Java)', 'MVVM Architecture', 'QR Scanner / Generator', 'Session Scheduling UI', 'Admin Workflows'],
    be: ['Firebase Auth', 'Firebase Cloud Messaging', 'Real-time Session Logic'],
    db: ['Firestore'],
  },
};
