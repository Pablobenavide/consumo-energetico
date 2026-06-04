# Guía de Contribución

¡Gracias por tu interés en contribuir a **EnergyHome**! Esta guía te ayudará a entender el proceso de contribución.

## 🤝 Cómo Contribuir

### Reportar Bugs

Si encuentras un error, por favor abre un [issue en GitHub](https://github.com/Pablobenavide/consumo-energetico/issues) con la siguiente información:

1. **Título descriptivo**: Sé específico sobre el problema
2. **Descripción detallada**: Explica qué sucedió y qué esperabas que sucediera
3. **Pasos para reproducir**: Proporciona pasos específicos para reproducir el problema
4. **Captura de pantalla**: Si es aplicable
5. **Información del entorno**:
   - Sistema operativo
   - Versión de Node.js
   - Navegador (si es un problema del frontend)
   - Versión de Docker (si lo estás usando)

**Ejemplo de issue**:
```
Título: El dashboard no carga los gráficos en Firefox

Descripción:
Los gráficos de consumo no se muestran correctamente en Firefox, 
aunque funcionan bien en Chrome.

Pasos para reproducir:
1. Abre la aplicación en Firefox
2. Inicia sesión con una cuenta que tenga electrodomésticos
3. Ve al dashboard
4. Los gráficos no se renderizan

Información del entorno:
- OS: Ubuntu 22.04
- Node.js: v18.16.0
- Navegador: Firefox 115
```

### Solicitar Nuevas Características

¿Tienes una idea para mejorar EnergyHome? Abre un [issue](https://github.com/Pablobenavide/consumo-energetico/issues) con:

1. **Descripción clara**: ¿Cuál es la nueva funcionalidad?
2. **Justificación**: ¿Por qué sería útil?
3. **Casos de uso**: Ejemplos específicos
4. **Propuesta de implementación**: Cómo podrías hacerlo (opcional)

---

## 🔧 Proceso de Contribución

### Paso 1: Fork el Repositorio

Haz un fork del repositorio en tu cuenta de GitHub.

```bash
# Tu fork estará en: github.com/tuusuario/consumo-energetico
```

### Paso 2: Clona tu Fork

```bash
git clone https://github.com/tuusuario/consumo-energetico.git
cd consumo-energetico
```

### Paso 3: Añade el Repositorio Original como Remote

```bash
git remote add upstream https://github.com/Pablobenavide/consumo-energetico.git
```

### Paso 4: Crea una Rama para tu Feature

Usa un nombre descriptivo para la rama:

```bash
# Para una nueva característica
git checkout -b feature/descripcion-feature

# Para un bug fix
git checkout -b fix/descripcion-bug

# Ejemplos:
git checkout -b feature/export-csv-consumption
git checkout -b fix/login-validation-error
```

### Paso 5: Realiza tus Cambios

- Edita los archivos necesarios
- Sigue los [Estándares de Código](#estándares-de-código)
- Escribe pruebas para tu código

### Paso 6: Commit tus Cambios

Usa mensajes de commit claros y descriptivos:

```bash
git commit -m "feat: agregar exportación de consumo en CSV"
git commit -m "fix: corregir validación de login"
git commit -m "docs: actualizar guía de instalación"
```

**Formato de commits** (Conventional Commits):
- `feat:` Para nuevas características
- `fix:` Para correcciones de bugs
- `docs:` Para cambios en documentación
- `style:` Para cambios de formato/estilo
- `refactor:` Para refactorización de código
- `test:` Para pruebas
- `ci:` Para cambios en CI/CD

### Paso 7: Sincroniza con el Repositorio Original

Antes de enviar tu PR, actualiza tu rama con los últimos cambios:

```bash
git fetch upstream
git rebase upstream/main
```

### Paso 8: Push a tu Fork

```bash
git push origin feature/descripcion-feature
```

### Paso 9: Crea un Pull Request

1. Ve a tu fork en GitHub
2. Haz clic en "Compare & pull request"
3. Completa la descripción del PR siguiendo la plantilla
4. Haz clic en "Create Pull Request"

**Plantilla de PR**:
```markdown
## Descripción
Breve descripción de los cambios

## Tipo de cambio
- [ ] Bug fix
- [ ] Nueva característica
- [ ] Cambio que rompe compatibilidad

## ¿Cómo se probó?
Describe cómo probaste tus cambios

## Checklist
- [ ] Mi código sigue los estándares del proyecto
- [ ] He actualizado la documentación si es necesario
- [ ] He añadido pruebas para mis cambios
- [ ] Las pruebas existentes aún pasan
- [ ] No hay conflictos de merge

## Issues relacionados
Cierra #123
```

---

## 📋 Estándares de Código

### Frontend (React)

**Estructura de carpetas**:
```
frontend/src/
├── components/    # Componentes reutilizables
├── pages/         # Componentes de página
├── hooks/         # Custom React hooks
├── services/      # Servicios (API, etc.)
├── styles/        # Estilos globales
└── utils/         # Funciones utilitarias
```

**Reglas de código**:
- Usa funcionales components con hooks
- Nombres descriptivos para variables y funciones
- Máximo 2 niveles de nesting
- Comenta código complejo
- Usa PropTypes o TypeScript para props

**Ejemplo de componente**:
```javascript
import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ApplianceCard = ({ appliance, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="appliance-card">
      <h3>{appliance.name}</h3>
      <p>Potencia: {appliance.power}W</p>
      {/* ... más contenido ... */}
    </div>
  );
};

ApplianceCard.propTypes = {
  appliance: PropTypes.shape({
    id: PropTypes.number.required,
    name: PropTypes.string.required,
    power: PropTypes.number.required,
  }).required,
  onEdit: PropTypes.func.required,
  onDelete: PropTypes.func.required,
};

export default ApplianceCard;
```

### Backend (Node.js/Express)

**Estructura de carpetas**:
```
backend/src/
├── routes/        # Rutas de la API
├── controllers/   # Lógica de negocio
├── models/        # Modelos de datos
├── middleware/    # Middleware personalizado
├── services/      # Servicios
├── utils/         # Funciones utilitarias
└── config/        # Configuración
```

**Reglas de código**:
- Usa ES6+
- Función flecha para callbacks
- Nombres descriptivos en inglés
- Error handling con try-catch
- Validación de entrada en todos los endpoints
- Logger para debugging

**Ejemplo de ruta**:
```javascript
// routes/appliances.js
import express from 'express';
import { 
  getAllAppliances, 
  createAppliance,
  updateAppliance,
  deleteAppliance 
} from '../controllers/applianceController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getAllAppliances);
router.post('/', authenticate, createAppliance);
router.put('/:id', authenticate, updateAppliance);
router.delete('/:id', authenticate, deleteAppliance);

export default router;
```

---

## 🧪 Pruebas

### Backend con Jest

```bash
npm run test --workspace backend
```

**Escribir pruebas**:
```javascript
// __tests__/auth.test.js
import request from 'supertest';
import app from '../src/app';

describe('POST /api/auth/register', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should reject invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'invalid-email',
        password: 'password123'
      });
    
    expect(res.statusCode).toBe(400);
  });
});
```

### Frontend E2E

```bash
npm run test --workspace frontend
```

---

## ✅ Checklist antes de enviar un PR

- [ ] Código sigue los estándares del proyecto
- [ ] He ejecutado `npm run lint` sin errores
- [ ] He ejecutado las pruebas y todas pasan
- [ ] He actualizado la documentación si es necesario
- [ ] Mi rama está actualizada con `upstream/main`
- [ ] El commit message sigue Conventional Commits
- [ ] No hay console.logs o código debug
- [ ] Los cambios son específicos a mi issue/feature

---

## 🔄 Proceso de Revisión

1. **Análisis automático**: GitHub Actions ejecutará:
   - Lint del código
   - Pruebas unitarias
   - Build del proyecto

2. **Revisión manual**: Un mantenedor revisará:
   - Calidad del código
   - Adherencia a estándares
   - Pruebas coverage
   - Documentación

3. **Feedback**: Se proporcionarán comentarios. Por favor:
   - Responde constructivamente
   - Implementa los cambios sugeridos
   - Marca las conversaciones como resueltas

4. **Merge**: Una vez aprobado, tu PR se fusionará con `main`

---

## 📚 Recursos Útiles

### Documentación del Proyecto
- [README.md](https://github.com/Pablobenavide/consumo-energetico#readme)
- [Guía de Instalación](Guía-de-Instalación)
- [Documentación de Características](Documentación-de-Características)

### Tecnologías
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Jest Testing](https://jestjs.io/)

### Git & GitHub
- [Git Basics](https://git-scm.com/doc)
- [GitHub Fork & PR](https://docs.github.com/en/get-started/quickstart/fork-a-repo)

---

## 💬 Preguntas o Dudas

- Abre una [discussion en GitHub](https://github.com/Pablobenavide/consumo-energetico/discussions)
- Comenta en el issue relacionado
- Contacta directamente al autor

---

## 📄 Licencia

Al contribuir al proyecto, aceptas que tu código será bajo la licencia del proyecto. Consulta el archivo LICENSE para más detalles.

---

¡Gracias nuevamente por contribuir a EnergyHome! 🎉