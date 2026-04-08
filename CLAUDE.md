# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server
npm run build     # Type-check + build for production (tsc -b && vite build)
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

There are no tests in this project.

## Architecture

This is a React 19 + TypeScript + Vite ed-tech SPA. The backend URL is configured via `VITE_BACKEND_URL` and Google OAuth via `VITE_GOOGLE_CLIENT_ID`.

### Auth

Auth state lives in `src/auth/AuthProvider.tsx`. Token and user object are persisted to `localStorage`. `useAuth()` hook (`src/auth/useAuth.ts`) accesses the context. `ProtectedRoute` wraps all authenticated pages and optionally renders `<Header>` and `<Footer>` (both default to `true`; onboarding disables them).

### API

All HTTP calls go through the single axios instance in `src/lib/api.ts` (sets `baseURL` to `VITE_BACKEND_URL`, `withCredentials: true`). Route-specific API helpers live in `src/api/` (e.g. `auth.ts`, `user.ts`).

### State Management

Redux Toolkit store (`src/store/store.ts`) has two slices:
- `course` — fetches subjects/topics from `/course/subjects`
- `quiz` — fetches quiz questions by topicId via `/course/quiz/:topicId` then `/course/question/:quizId`

Use `useAppDispatch` and `useAppSelector` (typed wrappers exported from `store.ts`) instead of raw `useDispatch`/`useSelector`.

### Routing

Routes are defined in `src/App.tsx`. The nested course path pattern is:
```
/courses/:courseId/:topicId/quiz
```

### UI Components

shadcn/ui components live in `src/components/ui/`. Feature-specific components are colocated in subdirectories (`src/components/home/`, `src/components/Login/`). Tailwind CSS v4 is used for styling; `cn()` utility is in `src/lib/utils.ts`.

### Pages

| Page | Route | Notes |
|------|-------|-------|
| Login | `/login` | Student + teacher tabs, Google OAuth, OTP forgot-password flow |
| OnBoarding | `/onboarding` | Post-login profile setup |
| Home | `/` | Dashboard with multiple home sections |
| Courses | `/courses` | Subject listing |
| Course | `/courses/:courseId` | Topics for a subject |
| Topic | `/courses/:courseId/:topicId` | Video + content |
| Quiz | `/courses/:courseId/:topicId/quiz` | Quiz from Redux quiz slice |
| Progress | `/progress` | Learning progress |
| Ranks | `/ranks` | Leaderboard |
| Stats | `/stats` | Analytics |
| TeacherDashboard | (no route in App.tsx yet) | Teacher view |
