# EDUNOVA - SPRINT 2: RESUMEN EJECUTIVO Y ENTREGABLES

**Proyecto:** Plataforma de Gestión Académica EDUNOVA  
**Ficha:** ADSO 3413988  
**Etapa:** Sprint 2 - Backend Funcional y Base de Datos Relacional  
**Tecnologías Principales:** Node.js, Express.js, Prisma ORM, MySQL 8, JWT, Bcrypt.

---

## 1. Presentación del Sprint 2

El presente paquete documental consolida de forma exhaustiva los 5 requerimientos fundamentales definidos para el **Sprint 2** en el marco del desarrollo de la plataforma de gestión académica **EDUNOVA**:

1. **Creación de la Base de Datos:** Modelado relacional, integridad referencial, entidades, enumeraciones y migraciones en MySQL 8 mediante Prisma ORM.
2. **Implementación de la API REST:** Arquitectura por capas (Rutas, Controladores, Middlewares), principios RESTful, códigos de estado HTTP semánticos y servidor Express.
3. **Autenticación y Autorización:** Cifrado con Bcrypt, tokens JWT (JSON Web Tokens), control de acceso basado en roles (RBAC: `ADMIN`, `INSTRUCTOR`, `APRENDIZ`) y gestión de sesiones.
4. **Implementación de Operaciones CRUD:** Operaciones Crear, Leer, Actualizar y Eliminar/Inactivar en los módulos centrales (Usuarios, Formación Académica, Competencias, Evidencias, Calificaciones, Asistencias, Ambientes y Solicitudes).
5. **Documentación de Endpoints:** Catálogo técnico pormenorizado de endpoints, parámetros, cabeceras, cargas útiles (payloads) JSON, códigos de respuesta y colección de pruebas para Postman.

---

## 2. Índice de Documentos del Sprint 2

| # | Documento | Archivo | Descripción |
|---|-----------|---------|-------------|
| 1 | **Creación de Base de Datos** | `01_CREACION_BASE_DE_DATOS.md` | Modelos Prisma, diagrama entidad-relación, llaves foráneas, tablas MySQL, seeds y diccionario resumido. |
| 2 | **Implementación de API REST** | `02_IMPLEMENTACION_API_REST.md` | Estructura modular del backend Express, configuración de middlewares, manejo de errores y arquitectura de servicios. |
| 3 | **Autenticación y Autorización** | `03_AUTENTICACION_Y_AUTORIZACION.md` | Flujo de login, firmas JWT, cifrado Bcrypt, middlewares de seguridad, protección de rutas y matriz de permisos por rol. |
| 4 | **Operaciones CRUD** | `04_OPERACIONES_CRUD.md` | Métodos implementados para Create, Read, Update y Delete con validaciones de negocio e integridad en Prisma. |
| 5 | **Documentación de Endpoints** | `05_DOCUMENTACION_ENDPOINTS.md` | Guía de referencia técnica HTTP para todos los endpoints expuestos, ejemplos de requests/responses y guía de Postman. |

---

## 3. Instrucciones Rápidas para el Evaluador / Instructor

### A. Requisitos Previos
- Node.js (v18.0.0 o superior).
- MySQL Server 8.0 (ejecutándose en `localhost:3306`).
- Base de datos configurada en `server/.env`:
  ```env
  DATABASE_URL="mysql://root:root123@localhost:3306/edunova_db"
  PORT=4000
  JWT_SECRET="edunova_super_secret_jwt_key_2026"
  ```

### B. Inicialización de Base de Datos y Semillas
Desde la carpeta `server/`:
```bash
# Sincronizar esquema Prisma con MySQL
npx prisma db push

# Poblar datos iniciales y datos de prueba de la ficha ADSO
npx prisma db seed
```

### C. Visualizador Gráfico de Base de Datos (Prisma Studio)
```bash
npx prisma studio
# Se abre automáticamente en http://localhost:5555
```

### D. Ejecución del Servidor Backend
```bash
cd server
npm run dev
# Servidor escuchando en http://localhost:4000/api
```

### E. Verificación Automática de Flujos (Suite de Pruebas QA)
Desde la raíz del proyecto:
```bash
node scripts/test_full_functionality_flows.js
# Valida automáticamente 23 flujos completos de autenticación, CRUD y seguridad
```
