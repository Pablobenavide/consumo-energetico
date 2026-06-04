# EnergyHome - Wiki

¡Bienvenido a la documentación de **EnergyHome**! Esta wiki contiene toda la información necesaria para entender, instalar y contribuir al proyecto.

## 📱 Descripción General

**EnergyHome** es una aplicación web inteligente que permite a los usuarios registrar, analizar y visualizar el consumo energético de electrodomésticos en el hogar. Con esta herramienta podrás:

- 📊 Registrar y monitorear el consumo de tus electrodomésticos
- 📈 Visualizar gráficos detallados de consumo mensual
- 💡 Recibir recomendaciones personalizadas para ahorrar energía
- 👤 Gestionar múltiples dispositivos con un dashboard intuitivo

## 🏗️ Arquitectura Técnica

La aplicación sigue una **arquitectura cliente-servidor REST** con separación clara de capas:

### Stack Tecnológico

- **Frontend**: React 19, React Router, Axios, Material UI, Chart.js, Vite
- **Backend**: Node.js, Express.js, JWT, bcrypt, Swagger, Jest
- **Base de Datos**: PostgreSQL
- **DevOps**: Docker, Docker Compose, GitHub Actions

### Estructura del Proyecto

```
consumo-energetico/
├── frontend/          # Aplicación React
├── backend/           # API REST Node.js
├── database/          # Scripts de BD
├── docs/              # Documentación técnica
└── docker-compose.yml # Orquestación de servicios
```

## 📚 Contenido de la Wiki

Navega por las siguientes secciones para obtener más información:

### 🚀 **[Guía de Instalación](Guía-de-Instalación)**
Instrucciones paso a paso para configurar el proyecto en tu máquina local, incluyendo:
- Requisitos previos
- Instalación manual y con Docker
- Configuración de variables de entorno

### ⚙️ **[Documentación de Características](Documentación-de-Características)**
Descripción detallada de todas las funcionalidades del sistema:
- Autenticación y gestión de usuarios
- Gestión de electrodomésticos
- Cálculo y análisis de consumo
- Dashboard y recomendaciones
- API REST completa

### 🤝 **[Guía de Contribución](Guía-de-Contribución)**
Información para contribuidores:
- Cómo reportar problemas
- Proceso de contribución
- Estándares de código
- Testing y pruebas
- Flujo de CI/CD

## 🎯 Funcionalidades Principales

✅ Registro de usuarios con validación de correo y contraseña cifrada  
✅ Inicio de sesión seguro con JWT  
✅ Gestión completa de electrodomésticos (CRUD)  
✅ Cálculo automático de consumo mensual  
✅ Dashboard con KPI, gráficos y recomendaciones  
✅ API documentada con Swagger  
✅ Pruebas automáticas (Backend + Frontend)  
✅ Despliegue automatizado con Docker y GitHub Actions  

## 📊 Acceder a la Aplicación

Una vez levantado el proyecto:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000/api
- **Documentación Swagger**: http://localhost:4000/api-docs

## 🔗 Enlaces Útiles

- [Repositorio GitHub](https://github.com/Pablobenavide/consumo-energetico)
- [API Swagger](http://localhost:4000/api-docs) (disponible una vez desplegado)

---

¿Necesitas ayuda? Consulta la sección de **[Guía de Instalación](Guía-de-Instalación)** para empezar.