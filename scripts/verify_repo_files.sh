#!/usr/bin/env bash
set -euo pipefail

required_files=(
  ".gitignore"
  "README.md"
  "REPO_FILES.md"
  "docker-compose.yml"
  "package.json"
  "backend/Dockerfile"
  "backend/package.json"
  "backend/src/index.ts"
  "backend/src/store.ts"
  "backend/src/types.ts"
  "backend/tsconfig.json"
  "frontend/Dockerfile"
  "frontend/nginx.conf"
  "frontend/index.html"
  "frontend/package.json"
  "frontend/src/App.tsx"
  "frontend/src/components/ContentForm.tsx"
  "frontend/src/components/Hero3D.tsx"
  "frontend/src/components/ParticleCanvas.tsx"
  "frontend/src/lib/config.ts"
  "frontend/src/main.tsx"
  "frontend/src/styles.css"
  "frontend/tsconfig.app.json"
  "frontend/tsconfig.json"
  "frontend/tsconfig.node.json"
  "frontend/vite.config.ts"
  "docs/implementation-blueprint.md"
)

missing=0
for file in "${required_files[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "MISSING: $file"
    missing=1
  fi
done

if [[ "$missing" -ne 0 ]]; then
  echo "One or more required files are missing."
  exit 1
fi

echo "All required files are present."
