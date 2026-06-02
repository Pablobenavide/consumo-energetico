# EnergyHome Architecture

EnergyHome follows a client-server REST architecture.

## Layers

- Frontend: React 19 + Vite + Material UI + Chart.js.
- Backend: Node.js + Express + JWT + bcrypt.
- Data: PostgreSQL with repository-based access.
- Docs: OpenAPI documentation exposed at `/api-docs`.

## Backend Flow

1. Request enters an Express route.
2. JWT middleware validates authentication.
3. Controller delegates to service.
4. Service applies business rules.
5. Repository persists or reads data.
6. Central error handler formats responses.