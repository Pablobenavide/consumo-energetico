# EnergyHome

EnergyHome es una aplicación web para registrar, analizar y visualizar el consumo energético de electrodomésticos en el hogar.

## Arquitectura

La solución sigue una arquitectura cliente-servidor REST con separación clara entre frontend, backend, base de datos y documentación.

- Frontend: React 19, React Router, Axios, Material UI, Chart.js y Vite.
- Backend: Node.js, Express, JWT, bcrypt, Swagger y Jest.
- Base de datos: PostgreSQL.
- DevOps: Docker, Docker Compose y GitHub Actions.

## Estructura

```text
/frontend
/backend
/database
/docs
```

## Funcionalidades

- Registro de usuarios con validación de correo y contraseña cifrada.
- Inicio de sesión con JWT.
- Gestión completa de electrodomésticos: crear, editar, eliminar y listar.
- Cálculo automático de consumo mensual.
- Dashboard con KPI, gráficos y recomendaciones.
- API documentada con Swagger en `/api-docs`.

## Endpoints principales

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/profile`
- `GET /api/appliances`
- `GET /api/appliances/:id`
- `POST /api/appliances`
- `PUT /api/appliances/:id`
- `DELETE /api/appliances/:id`
- `GET /api/consumption`
- `GET /api/consumption/summary`
- `GET /api/recommendations`

## Base de datos

El script principal se encuentra en [database/schema.sql](database/schema.sql).

Tablas:

- `users`
- `appliances`
- `consumption_history`

## Variables de entorno

### Backend

```bash
PORT=4000
JWT_SECRET=change-me
DB_HOST=localhost
DB_PORT=5433
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=energyhome
```

### Frontend

```bash
VITE_API_URL=http://localhost:4000/api
VITE_USE_MOCKS=true
```

## Instalación

1. Instala dependencias en la raíz:

```bash
npm install
```

2. Inicia PostgreSQL y aplica el esquema:

```bash
psql -h localhost -U postgres -d energyhome -f database/schema.sql
```

3. Levanta el backend:

```bash
npm run dev --workspace backend
```

4. Levanta el frontend:

```bash
npm run dev --workspace frontend
```

## Docker

Levantar todo el stack:

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- Swagger: http://localhost:4000/api-docs

## Pruebas

### Backend

```bash
npm run test --workspace backend
```

### Frontend E2E

```bash
npm run test --workspace frontend
```

## Swagger

La documentación OpenAPI está disponible en:

- [docs/api/swagger.yaml](docs/api/swagger.yaml)
- `/api-docs` en el backend

## CI/CD

- `ci.yml`: corre en cada Pull Request con install, lint, test y build.
- `deploy.yml`: corre en cada merge a `main` y ejecuta el flujo de build y empaquetado Docker.

## Notas de implementación

- El backend usa un factory de aplicación para facilitar pruebas y aislación de dependencias.
- El frontend puede operar con mock mode para pruebas E2E sin backend real.
- El cálculo de consumo usa la fórmula:

$$
kWh = \frac{potencia\_watts \times horas\_uso \times 30}{1000}
$$# consumo-energetico