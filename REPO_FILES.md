# Repository File Manifest

This file lists the currently committed project files so they are easy to verify in the repo UI.

## Root
- `.gitignore`
- `.gitkeep`
- `README.md`
- `package.json`
- `docker-compose.yml`
- `docs/implementation-blueprint.md`
- `REPO_FILES.md`
- `PUSH_TO_GITHUB.md`

## Backend (`backend/`)
- `backend/Dockerfile`
- `backend/package.json`
- `backend/tsconfig.json`
- `backend/src/index.ts`
- `backend/src/store.ts`
- `backend/src/types.ts`

## Frontend (`frontend/`)
- `frontend/Dockerfile`
- `frontend/nginx.conf`
- `frontend/index.html`
- `frontend/package.json`
- `frontend/eslint.config.js`
- `frontend/tsconfig.json`
- `frontend/tsconfig.app.json`
- `frontend/tsconfig.node.json`
- `frontend/vite.config.ts`
- `frontend/src/main.tsx`
- `frontend/src/App.tsx`
- `frontend/src/styles.css`
- `frontend/src/components/ParticleCanvas.tsx`
- `frontend/src/components/Hero3D.tsx`
- `frontend/src/components/ContentForm.tsx`
- `frontend/src/lib/config.ts`

## Verification command used

```bash
find . -maxdepth 3 -type f | sed 's#^./##' | sort
```
