# Project Conventions

## Type Structure (Mirrored Pattern)

### Rules

1. **Backend types** go in `/backend/src/types/` with subfolders mirroring src structure:
   - `/backend/src/types/controllers/` → types used by controllers
   - `/backend/src/types/services/` → types used by services
   - `/backend/src/types/middleware/` → types used by middleware

2. **Frontend types** go in `/frontend/src/types/` with subfolders mirroring src structure:
   - `/frontend/src/types/components/` → types used by components
   - `/frontend/src/types/hooks/` → types used by hooks
   - etc.

3. **Shared types** (API request/response shapes used by both FE and BE) go in `/shared/types/`

4. Each type file is named after its corresponding source file:
   - `upload.controller.ts` → `types/controllers/upload.types.ts`
   - `upload.service.ts` → `types/services/upload.types.ts`

5. Export all types from an `index.ts` in each subfolder, and re-export from the root `types/index.ts`

### Example Structure

```
backend/src/types/
├── services/
│   ├── upload.types.ts
│   └── index.ts
├── controllers/
│   └── index.ts
└── index.ts

frontend/src/types/
├── components/
│   ├── app.types.ts
│   └── index.ts
└── index.ts

shared/types/
├── api/
│   ├── upload.types.ts
│   └── index.ts
└── index.ts
```

## Architecture Pattern

- Follow note-search patterns: https://github.com/Aseelaldallal/note-search
- Inversify for dependency injection
- Controller-Service separation (controllers handle HTTP, services handle business logic)
- Routes only define routes, middleware handles cross-cutting concerns
