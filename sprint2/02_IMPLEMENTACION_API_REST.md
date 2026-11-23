# EDUNOVA - SPRINT 2: IMPLEMENTACIÓN DE API REST

**Entregable:** 2. Implementar API REST  
**Tecnología Base:** Node.js (Entorno de Ejecución v18+) & Express.js (Framework HTTP)  
**Protocolo:** HTTP/1.1 RESTful  
**Formato de Intercambio:** JSON (`application/json`)  
**Puerto de Servicio:** `4000` (Prefijo Base: `http://localhost:4000/api`)

---

## 1. Arquitectura de la API REST

La API REST de **EDUNOVA** sigue una arquitectura limpia orientada a componentes y por capas (Layered Architecture):

```
                     PETICIÓN HTTP CLIENTE (Frontend / Postman)
                                       │
                                       ▼
                   ┌────────────────────────────────────────┐
                   │           server.js (Express)          │
                   │  - CORS, JSON Parser, Helmet, Logs     │
                   └───────────────────┬────────────────────┘
                                       │
                                       ▼
                   ┌────────────────────────────────────────┐
                   │           Rutas (/src/routes)          │
                   │   Enrutamiento semántico por entidad   │
                   └───────────────────┬────────────────────┘
                                       │
                   ┌───────────────────┴────────────────────┐
                   ▼                                        ▼
    ┌─────────────────────────────┐         ┌─────────────────────────────┐
    │     auth.middleware.js      │         │     roles.middleware.js     │
    │  Verificación de Token JWT  │         │  Validación de Permisos RBAC│
    └──────────────┬──────────────┘         └──────────────┬──────────────┘
                   │                                        │
                   └───────────────────┬────────────────────┘
                                       │
                                       ▼
                   ┌────────────────────────────────────────┐
                   │       Controladores (/src/controllers) │
                   │    Lógica de negocio y validaciones    │
                   └───────────────────┬────────────────────┘
                                       │
                                       ▼
                   ┌────────────────────────────────────────┐
                   │        Prisma Client (Data Layer)      │
                   │    Consultas parametrizadas a MySQL    │
                   └───────────────────┬────────────────────┘
                                       │
                                       ▼
                                 [MySQL 8.0]
```

---

## 2. Principios de Diseño RESTful Aplicados

1. **Arquitectura Sin Estado (Stateless):** Cada solicitud contiene toda la información necesaria para ser procesada. La sesión del cliente se valida exclusivamente mediante el token JWT enviado en la cabecera `Authorization: Bearer <token>`.
2. **Identificación de Recursos Mediante URIs Uniformes:**
   - Recursos en plural: `/api/usuarios`, `/api/cursos`, `/api/evidencias`.
   - Relaciones anidadas semánticas: `/api/academico/cursos/:id/aprendices`.
3. **Uso Semántico de Verbos HTTP:**
   - `GET`: Recuperación segura e idempotente de datos (listados y detalles).
   - `POST`: Creación de nuevos recursos y generación de sesiones (login).
   - `PUT`: Actualización completa de registros existentes.
   - `PATCH`: Modificación parcial (por ejemplo, cambio de estado de un usuario).
   - `DELETE`: Eliminación física o marcado de borrado lógico.
4. **Códigos de Estado HTTP Estándar:**
   - `200 OK`: Petición procesada exitosamente.
   - `201 Created`: Recurso creado exitosamente.
   - `400 Bad Request`: Error en parámetros o cuerpo de la petición.
   - `401 Unauthorized`: Falta de token o token inválido/expirado.
   - `403 Forbidden`: Token válido pero rol sin permisos suficientes.
   - `404 Not Found`: Recurso no encontrado.
   - `500 Internal Server Error`: Excepción no controlada en el servidor.

---

## 3. Estructura de Módulos del Backend

El código fuente del backend se organiza bajo la carpeta `server/src/` de la siguiente manera:

```text
server/
├── prisma/
│   ├── schema.prisma        # Modelo declarativo de la base de datos
│   ├── seed.js              # Semillas maestras iniciales
│   └── seed_expansion.js    # Semillas extendidas de la cohorte ADSO
├── src/
│   ├── config/
│   │   ├── prisma.js        # Instancia singleton de PrismaClient
│   │   └── env.js           # Variables de entorno validadas
│   ├── controllers/         # 17 Controladores con la lógica del negocio
│   │   ├── auth.controller.js
│   │   ├── usuarios.controller.js
│   │   ├── academico.controller.js
│   │   ├── competencias.controller.js
│   │   ├── evidencias.controller.js
│   │   ├── asistencia.controller.js
│   │   ├── recuperaciones.controller.js
│   │   ├── alertas.controller.js
│   │   ├── ambientes.controller.js
│   │   ├── aula.controller.js
│   │   ├── calendario.controller.js
│   │   ├── perfil360.controller.js
│   │   ├── solicitudes.controller.js
│   │   ├── reportes.controller.js
│   │   ├── dashboard.controller.js
│   │   ├── notificaciones.controller.js
│   │   └── ai.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js   # Interceptor de autenticación JWT
│   │   ├── roles.middleware.js  # Interceptor de autorización RBAC
│   │   └── error.middleware.js  # Capturador global de excepciones
│   ├── routes/              # 17 Archivos de rutas Express
│   │   ├── auth.routes.js
│   │   ├── usuarios.routes.js
│   │   ├── academico.routes.js
│   │   └── ...
│   └── server.js            # Punto de entrada principal de la aplicación
├── .env                     # Cadena de conexión y credenciales
└── package.json             # Dependencias y scripts de ejecución
```

---

## 4. Configuración Central del Servidor (`server.js`)

El archivo [server.js](file:///c:/Users/FABIAN%20CASTELLANOS/Downloads/Gestion%20Academica/PLATAFORMA-DE-GESTI-N-ACAD-MICA/server/src/server.js) inicializa el framework Express con las mejores prácticas de seguridad e integración:

```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import academicoRoutes from './routes/academico.routes.js';
// ... importación del resto de rutas modulares

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares globales
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Montaje de rutas modularizadas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/academico', academicoRoutes);
app.use('/api/competencias', competenciasRoutes);
app.use('/api/evidencias', evidenciasRoutes);
app.use('/api/asistencia', asistenciaRoutes);
app.use('/api/alertas', alertasRoutes);
app.use('/api/recuperaciones', recuperacionesRoutes);
app.use('/api/ambientes', ambientesRoutes);
app.use('/api/solicitudes', solicitudesRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notificaciones', notificacionesRoutes);

// Manejador centralizado de errores
app.use((err, req, res, next) => {
  console.error('[ERROR HANDLER]:', err);
  res.status(err.status || 500).json({
    ok: false,
    mensaje: err.message || 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err : undefined
  });
});

app.listen(PORT, () => {
  console.log(`[API REST] Servidor EDUNOVA activo en http://localhost:${PORT}/api`);
});
```

---

## 5. Módulos de la API REST Expuestos

| Módulo | Prefijo URI | Descripción | Control de Acceso |
|--------|-------------|-------------|-------------------|
| **Auth** | `/api/auth` | Login, renovación de token, perfil activo y recuperación de clave. | Público / Autenticado |
| **Usuarios** | `/api/usuarios` | CRUD integral de usuarios, asignación de roles y estados. | `ADMIN` |
| **Académico** | `/api/academico` | Gestión de Programas de formación y Fichas/Cursos. | `ADMIN`, `INSTRUCTOR` |
| **Competencias** | `/api/competencias` | Catálogo de competencias y resultados de aprendizaje (RAP). | Todos (Lectura) / `ADMIN` |
| **Evidencias** | `/api/evidencias` | Publicación de actividades, entregas y juicios evaluativos. | `INSTRUCTOR`, `APRENDIZ` |
| **Asistencia** | `/api/asistencia` | Toma de listas, novedades de inasistencia y porcentajes. | `INSTRUCTOR` |
| **Alertas** | `/api/alertas` | Detección y radicación de alertas tempranas de deserción. | `INSTRUCTOR`, `ADMIN` |
| **Recuperaciones**| `/api/recuperaciones` | Planes de mejoramiento y actividades de nivelación. | `INSTRUCTOR`, `APRENDIZ` |
| **Ambientes** | `/api/ambientes` | Inventario de ambientes de aprendizaje y reservas horarias. | `INSTRUCTOR`, `ADMIN` |
| **Solicitudes** | `/api/solicitudes` | Trámites institucionales (certificados, traslados, etc.). | `APRENDIZ`, `ADMIN` |
| **Reportes** | `/api/reportes` | Consolidación estadística y reportes académicos. | `ADMIN`, `INSTRUCTOR` |
| **Dashboard** | `/api/dashboard` | Métricas agregadas en tiempo real para paneles principales. | Autenticado |
| **Notificaciones**| `/api/notificaciones`| Mensajería interna y avisos automáticos a usuarios. | Autenticado |

---

## 6. Verificación y Arranque

Para iniciar la API REST en el entorno de desarrollo:
```bash
cd server
npm install
npm run dev
```
La salida de consola confirmará la conexión a la base de datos MySQL y la escucha en el puerto `4000`.
