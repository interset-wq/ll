# AGENTS.md

## Project structure

Multi-project repo with no shared build system or root package.json. Each sub-project is independent.

```
backend/          Django 6.0.7 + DRF, Python 3.14, SQLite, managed with uv
frontend/react/   Vite + React 19 + TypeScript
frontend/vue/     Vite + Vue 3 + TypeScript
frontend/reactnative/  Expo SDK 54 (React Native 0.81)
frontend/uniapp/  uni-app (Vue 3, cross-platform: H5, WeChat mini-program, etc.)
```

## Backend

- **Package manager**: `uv` (lockfile: `uv.lock`, config: `pyproject.toml`)
- **Python version**: 3.14 (pinned in `.python-version`)
- **Run server**: `cd backend && uv run python manage.py runserver`
- **Migrations**: `cd backend && uv run python manage.py migrate`
- **Admin credentials**: admin / admin123 (admin@example.com)
- **Settings module**: `config.settings` (set via `manage.py`)
- **Timezone**: Asia/Shanghai
- **Apps**: `learning_logs` (Topic/Entry CRUD), `accounts` (auth + registration)
- **No tests, linting, or CI configured** for backend currently

## Frontend

### React (`frontend/react/`)
- Vite + React 19 + TypeScript 6.0
- `pnpm dev` to run, `pnpm lint` for ESLint, `pnpm build` for production

### Vue (`frontend/vue/`)
- Vite + Vue 3 + TypeScript 6.0
- `pnpm dev` to run, `pnpm build` for production

### React Native (`frontend/reactnative/`)
- Expo SDK 54, React 19.1, React Native 0.81
- `pnpm start` (or `pnpm ios`, `pnpm android`, `pnpm web`)
- **Expo APIs changed in SDK 54** — read versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing Expo-related code
- See `frontend/reactnative/AGENTS.md` for additional guidance

### UniApp (`frontend/uniapp/`)
- uni-app cross-platform framework (Vue 3 based)
- `pnpm dev:h5` for web, `pnpm dev:mp-weixin` for WeChat mini-program
- Targets: H5, WeChat/Alipay/Baidu/other mini-programs, HarmonyOS, QuickApp

## API Design

- Create a new Django app (e.g. `api/`) to host DRF RESTful endpoints, separate from the existing template-based apps
- Register `rest_framework`, `drf_spectacular`, and the new `api` app in `INSTALLED_APPS`
- API versioning uses URL path: `/api/v1/`, `/api/v2/`, etc. — version bumps when breaking changes are introduced
- Current version: **v1**
- `learning_logs` models (Topic, Entry) need full CRUD API
- `accounts` needs API-based auth (login/logout/register/me)
- The backend is currently minimal and needs expansion: pagination, filtering, throttling, proper error responses, and permission classes should be added as the project grows

## Frontend language rules

- **Vue** and **React**: use **TypeScript** (`.ts`, `.tsx`)
- **React Native** and **UniApp**: use **JavaScript** (`.js`, `.jsx`)

## Git conventions

- **Commit message style**: `feat(scope): description` (e.g. `feat(backend): create accounts app`, `feat(frontend/react): add login page`)
- Other prefixes: `fix`, `update`, `init`, `add`, `remove` — match existing history
- Description should briefly summarize what was done, not be too generic
- **Never use `git add .`** — stage files atomically: `git add AGENTS.md`, `git add frontend/vue/src/`

## Gotchas

- No shared dependency management — each frontend project has its own `node_modules` and lockfile
- Backend uses SQLite (`db.sqlite3`) committed to repo; no separate DB setup needed
- The backend has `djangorestframework` and `drf-spectacular` in dependencies but they are not registered in `INSTALLED_APPS` yet
- URL routing: both `learning_logs` and `accounts` mount at root (`/`) with namespaced URLs (`app_name`)
- Backend `LOGIN_URL` is `accounts:login`
