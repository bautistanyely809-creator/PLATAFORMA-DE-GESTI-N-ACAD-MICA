# 📘 DOCUMENTACIÓN TÉCNICA DE ENDPOINTS — API REST EDUNOVA
**Sistema:** EDUNOVA · Academic Management System  
**Ficha ADSO:** 3413988 · SENA Regional Huila  
**Versión API:** v1.0.0 · Formato: JSON (`application/json`)  
**Servidor Base Local:** `http://localhost:4000/api`  
**Autenticación:** Bearer Token JWT en cabecera `Authorization: Bearer <TOKEN>`

---

## 📌 TABLA DE CONTENIDO DE LA API

1. [Módulo de Autenticación y Perfil (`/api/auth`)](#1-módulo-de-autenticación-y-perfil-apiauth)
2. [Módulo de Competencias y RAPs (`/api/competencias`)](#2-módulo-de-competencias-y-raps-apicompetencias)
3. [Módulo de Evidencias de Aprendizaje (`/api/evidencias`)](#3-módulo-de-evidencias-de-aprendizaje-apievidencias)
4. [Módulo de Control de Asistencia (`/api/asistencia`)](#4-módulo-de-control-de-asistencia-apiasistencia)
5. [Módulo de Planes de Recuperación (`/api/recuperaciones`)](#5-módulo-de-planes-de-recuperación-apirecuperaciones)
6. [Módulo de Calendario Académico (`/api/calendario`)](#6-módulo-de-calendario-académico-apicalendario)
7. [Módulo de Perfil Académico 360° (`/api/perfil-360`)](#7-módulo-de-perfil-académico-360-apiperfil-360)
8. [Módulo de Alertas Tempranas (`/api/alertas`)](#8-módulo-de-alertas-tempranas-apialertas)
9. [Módulo de Aula Virtual LMS (`/api/aula`)](#9-módulo-de-aula-virtual-lms-apiaula)
10. [Módulo de Gestión de Ambientes (`/api/ambientes`)](#10-módulo-de-gestión-de-ambientes-apiambientes)
11. [Módulo de Solicitudes Institucionales (`/api/solicitudes`)](#11-módulo-de-solicitudes-institucionales-apisolicitudes)
12. [Módulo de Notificaciones (`/api/notificaciones`)](#12-módulo-de-notificaciones-apinotificaciones)
13. [Módulo de Métricas y Dashboard (`/api/dashboard`)](#13-módulo-de-métricas-y-dashboard-apidashboard)
14. [Módulo de Reportes Oficiales (`/api/reportes`)](#14-módulo-de-reportes-oficiales-apireportes)
15. [Módulo de Directorio de Usuarios (`/api/usuarios`)](#15-módulo-de-directorio-de-usuarios-apiusuarios)
16. [Módulo de Gestión Académica y Fichas (`/api/academico`)](#16-módulo-de-gestión-académica-y-fichas-apiacademico)

---

## 1. MÓDULO DE AUTENTICACIÓN Y PERFIL (`/api/auth`)

### 1.1. Iniciar Sesión (Login)
* **Método:** `POST`
* **Ruta:** `/auth/login`
* **Permisos:** Público (Sin token)
* **Descripción:** Autentica a un usuario mediante correo y contraseña. Retorna token JWT con rol codificado.
* **Cuerpo de la Petición (JSON):**
```json
{
  "correo": "admin@edunova.edu.co",
  "password": "edunova2026"
}
```
* **Códigos de Respuesta:**
  * `200 OK`: Credenciales válidas. Retorna `{ token, usuario: { id_usuario, nombre, apellido, correo, rol } }`.
  * `400 Bad Request`: Faltan campos obligatorios.
  * `401 Unauthorized`: Contraseña o correo incorrectos.
  * `403 Forbidden`: Usuario en estado `INACTIVO`.

### 1.2. Registro de Nuevo Aprendiz
* **Método:** `POST`
* **Ruta:** `/auth/registro`
* **Permisos:** Público
* **Cuerpo de la Petición (JSON):**
```json
{
  "nombre": "Carlos",
  "apellido": "Díaz",
  "correo": "carlos.diaz@edunova.edu.co",
  "password": "MiPasswordSeguro2026*",
  "documento": "1075889900",
  "telefono": "3159988776"
}
```
* **Códigos de Respuesta:**
  * `201 Created`: Aprendiz registrado exitosamente en `USUARIO` y `APRENDIZ`.
  * `409 Conflict`: El correo institucional o documento ya se encuentra registrado.

### 1.3. Consulta de Perfil del Usuario Autenticado
* **Método:** `GET`
* **Ruta:** `/auth/perfil`
* **Permisos:** Privado (`ADMIN`, `INSTRUCTOR`, `APRENDIZ`)
* **Cabecera requerida:** `Authorization: Bearer <TOKEN>`
* **Respuesta Exitosa (`200 OK`):**
```json
{
  "id_usuario": 1,
  "nombre": "Administrador",
  "apellido": "General",
  "correo": "admin@edunova.edu.co",
  "rol": "ADMIN",
  "estado": "ACTIVO"
}
```

---

## 2. MÓDULO DE COMPETENCIAS Y RAPs (`/api/competencias`)

### 2.1. Listar Competencias por Programa Formativo
* **Método:** `GET`
* **Ruta:** `/competencias/programa/:id_programa`
* **Permisos:** Público / Aprendiz / Instructor
* **Parámetro URL:** `id_programa` (ej: `1` para ADSO).
* **Respuesta (`200 OK`):** Array con competencias y Resultados de Aprendizaje (RAPs) anidados.

### 2.2. Seguimiento de Competencias por Ficha de Caracterización
* **Método:** `GET`
* **Ruta:** `/competencias/ficha/:id_curso`
* **Permisos:** Instructor / Admin
* **Parámetro URL:** `id_curso` (ej: `1` para la Ficha 3413988).
* **Respuesta (`200 OK`):** Matriz de aprendices con estado de cada competencia (`APROBADO`, `EN_PROCESO`, `REQUIERE_REFUERZO`).

### 2.3. Evaluar Competencia con Historial Inmutable
* **Método:** `POST`
* **Ruta:** `/competencias/evaluar`
* **Permisos:** Privado (`INSTRUCTOR`, `ADMIN`)
* **Cuerpo (JSON):**
```json
{
  "id_inscripcion": 1,
  "id_resultado": 3,
  "juicio": "APROBADO",
  "observacion": "Demuestra dominio completo de consultas SQL y modelado relacional."
}
```
* **Respuestas:** `200 OK` (Actualizado y auditado en `HISTORIAL_COMPETENCIA`), `403 Forbidden` (Si no es docente asignado o admin).

---

## 3. MÓDULO DE EVIDENCIAS DE APRENDIZAJE (`/api/evidencias`)

### 3.1. Listar Evidencias por Ficha
* **Método:** `GET`
* **Ruta:** `/evidencias/curso/:id_curso`
* **Respuesta (`200 OK`):** Listado de evidencias programadas, fechas límite y porcentaje de ponderación.

### 3.2. Publicar Nueva Evidencia
* **Método:** `POST`
* **Ruta:** `/evidencias`
* **Permisos:** `INSTRUCTOR`, `ADMIN`
* **Cuerpo (JSON):**
```json
{
  "id_curso": 1,
  "id_rap": 3,
  "titulo": "Taller: Normalización de Base de Datos a 3FN",
  "descripcion": "Diseñar el esquema relacional con claves primarias y foráneas.",
  "fecha_limite": "2026-12-01T23:59:59.000Z",
  "ponderacion": 25.0
}
```
* **Respuesta:** `201 Created`. Dispara notificación automática a los aprendices matriculados.

### 3.3. Radicar Entrega de Evidencia con Versionamiento
* **Método:** `POST`
* **Ruta:** `/evidencias/:id_evidencia/entregar`
* **Permisos:** `APRENDIZ`
* **Cuerpo (JSON):**
```json
{
  "id_inscripcion": 1,
  "archivo_url": "https://github.com/aprendiz/taller-sql",
  "comentario": "Entrega inicial con script DDL y diagramas entidad-relación."
}
```
* **Respuesta:** `201 Created` con versión autoincrementada (`version: 1`, `version: 2`...).

### 3.4. Calificar Entrega
* **Método:** `POST`
* **Ruta:** `/evidencias/entregas/:id_entrega/calificar`
* **Permisos:** `INSTRUCTOR`, `ADMIN`
* **Cuerpo (JSON):**
```json
{
  "calificacion": 4.8,
  "retroalimentacion": "Excelente modelo relacional, cumple con integridad referencial."
}
```

---

## 4. MÓDULO DE CONTROL DE ASISTENCIA (`/api/asistencia`)

### 4.1. Listar Sesiones de Clase por Ficha
* **Método:** `GET`
* **Ruta:** `/asistencia/sesiones/:id_curso`
* **Respuesta:** Array de sesiones con fecha, tema e instructor.

### 4.2. Crear Nueva Sesión de Formación
* **Método:** `POST`
* **Ruta:** `/asistencia/sesiones`
* **Permisos:** `INSTRUCTOR`, `ADMIN`
* **Cuerpo (JSON):**
```json
{
  "id_curso": 1,
  "fecha": "2026-11-20",
  "tema": "Desarrollo de APIs RESTful con Node.js y Express",
  "horas": 4
}
```

### 4.3. Registrar Planilla de Asistencia
* **Método:** `POST`
* **Ruta:** `/asistencia/registrar`
* **Permisos:** `INSTRUCTOR`, `ADMIN`
* **Cuerpo (JSON):**
```json
{
  "id_sesion": 1,
  "registros": [
    { "id_inscripcion": 1, "estado": "PRESENTE", "observacion": "" },
    { "id_inscripcion": 2, "estado": "RETARDO", "observacion": "Ingresó 20 min tarde" }
  ]
}
```
* **Respuesta:** `200 OK`. Evalúa reglas de alerta si un aprendiz supera el umbral crítico (< 85%).

---

## 5. MÓDULO DE PLANES DE RECUPERACIÓN (`/api/recuperaciones`)

### 5.1. Consultar Planes por Ficha
* **Método:** `GET`
* **Ruta:** `/recuperaciones/ficha/:id_curso`
* **Respuesta:** `{ casosCriticos: [...], recuperacionesActivas: [...] }`.

### 5.2. Asignar Plan de Mejoramiento
* **Método:** `POST`
* **Ruta:** `/recuperaciones/asignar`
* **Permisos:** `INSTRUCTOR`, `ADMIN`
* **Cuerpo (JSON):**
```json
{
  "id_inscripcion": 2,
  "id_rap": 3,
  "actividad_refuerzo": "Resolver laboratorio práctico de consultas multitabla y transacciones ACID.",
  "fecha_limite": "2026-12-10T23:59:59.000Z",
  "observacion": "Debe sustentar en sesión sincrónica."
}
```

### 5.3. Evaluar y Auto-acreditar Refuerzo
* **Método:** `POST`
* **Ruta:** `/recuperaciones/:id_recuperacion/evaluar`
* **Permisos:** `INSTRUCTOR`, `ADMIN`
* **Cuerpo (JSON):** `{ "calificacion": 4.0, "observacion": "Sustentación aprobada." }`
* **Efecto:** Si `calificacion >= 3.5`, el sistema actualiza automáticamente la competencia a `APROBADA`.

---

## 6. MÓDULO DE CALENDARIO ACADÉMICO (`/api/calendario`)

### 6.1. Listar Eventos
* **Método:** `GET`
* **Ruta:** `/calendario`
* **Parámetros Query (Opcionales):** `?categoria=CLASE&id_curso=1`

### 6.2. Crear Evento
* **Método:** `POST`
* **Ruta:** `/calendario`
* **Permisos:** `INSTRUCTOR`, `ADMIN`
* **Cuerpo (JSON):**
```json
{
  "titulo": "Sustentación Proyecto Formativo Fase 3",
  "descripcion": "Demostración en vivo de endpoints y base de datos.",
  "categoria": "EVALUACION",
  "fecha_inicio": "2026-11-25T08:00:00.000Z",
  "fecha_fin": "2026-11-25T12:00:00.000Z",
  "hora_inicio": "08:00",
  "hora_fin": "12:00",
  "ubicacion": "Ambiente 204 / Meet",
  "id_curso": 1
}
```

### 6.3. Cancelar Evento con Historial
* **Método:** `PATCH`
* **Ruta:** `/calendario/:id_evento/cancelar`
* **Cuerpo (JSON):** `{ "motivo": "Reprogramación por evento institucional SENA" }`

---

## 7. MÓDULO DE PERFIL ACADÉMICO 360° (`/api/perfil-360`)

### 7.1. Consulta Consolidada 360°
* **Método:** `GET`
* **Ruta:** `/perfil-360/:id_aprendiz`
* **Respuesta (`200 OK`):**
```json
{
  "perfil": { "id_aprendiz": 1, "nombre": "Anyely Valeria", "documento": "1075321890" },
  "indicadores": {
    "porcentajeAvanceCompetencias": 100,
    "porcentajeAsistencia": 100,
    "promedioEvidencias": 4.9,
    "estadoAcademico": "DESTACADO"
  },
  "secciones": {
    "competencias": [...],
    "evidencias": [...],
    "asistencias": [...],
    "accionesAcompanamiento": [...]
  }
}
```

### 7.2. Registrar Acción de Acompañamiento Formativo
* **Método:** `POST`
* **Ruta:** `/perfil-360/:id_aprendiz/accion`
* **Permisos:** `INSTRUCTOR`, `ADMIN`
* **Cuerpo (JSON):**
```json
{
  "tipo_accion": "TUTORIA",
  "descripcion": "Asesoría en diseño de arquitectura MVC y seguridad JWT.",
  "compromiso": "Subir repositorio antes del viernes."
}
```

---

## 8. MÓDULO DE ALERTAS TEMPRANAS (`/api/alertas`)

### 8.1. Listar Alertas Activas
* **Método:** `GET`
* **Ruta:** `/alertas`
* **Respuesta:** Alertas catalogadas por severidad (`CRITICA`, `ALTA`, `MEDIA`, `BAJA`).

### 8.2. Disparar Motor Automático de Reglas
* **Método:** `POST`
* **Ruta:** `/alertas/evaluar-reglas`
* **Permisos:** `ADMIN`, `INSTRUCTOR`
* **Efecto:** Analiza ausencias y notas reprobadas en la base de datos generando alertas preventivas.

### 8.3. Actualizar Estado de Alerta
* **Método:** `PATCH`
* **Ruta:** `/alertas/:id_alerta/estado`
* **Cuerpo (JSON):**
```json
{
  "nuevo_estado": "EN_SEGUIMIENTO",
  "comentario": "Aprendiz citado a reunión con el instructor vocero."
}
```

---

## 9. MÓDULO DE AULA VIRTUAL LMS (`/api/aula`)

### 9.1. Listar Aulas por Ficha
* **Método:** `GET`
* **Ruta:** `/aula`
* **Respuesta:** Aulas virtuales con unidades didácticas, materiales y actividades vinculadas.

### 9.2. Crear Actividad en Unidad
* **Método:** `POST`
* **Ruta:** `/aula/actividad`
* **Permisos:** `INSTRUCTOR`, `ADMIN`
* **Cuerpo (JSON):**
```json
{
  "id_unidad": 1,
  "titulo": "Laboratorio: Autenticación con JWT",
  "descripcion": "Construir middleware de protección de rutas.",
  "fecha_limite": "2026-11-28T23:59:59.000Z"
}
```

---

## 10. MÓDULO DE GESTIÓN DE AMBIENTES (`/api/ambientes`)

### 10.1. Listar Ambientes de Formación
* **Método:** `GET`
* **Ruta:** `/ambientes`
* **Respuesta:** Ambientes físicos y virtuales con equipamiento y capacidad.

### 10.2. Reservar Ambiente con Detección de Conflictos
* **Método:** `POST`
* **Ruta:** `/ambientes/reservas`
* **Permisos:** `INSTRUCTOR`, `ADMIN`
* **Cuerpo (JSON):**
```json
{
  "id_ambiente": 1,
  "id_curso": 1,
  "motivo": "Taller presencial de desarrollo backend",
  "fecha": "2026-11-24",
  "hora_inicio": "08:00",
  "hora_fin": "12:00"
}
```
* **Códigos de Respuesta:**
  * `201 Created`: Reserva aprobada.
  * `409 Conflict`: El ambiente ya se encuentra ocupado en esa franja horaria.

---

## 11. MÓDULO DE SOLICITUDES INSTITUCIONALES (`/api/solicitudes`)

### 11.1. Radicar Solicitud / PQRS
* **Método:** `POST`
* **Ruta:** `/solicitudes`
* **Permisos:** `APRENDIZ`, `INSTRUCTOR`, `ADMIN`
* **Cuerpo (JSON):**
```json
{
  "categoria": "CERTIFICADO",
  "asunto": "Constancia de estudio para empresa patrocinadora",
  "descripcion": "Requiero constancia académica oficial con número de ficha 3413988.",
  "prioridad": "ALTA"
}
```
* **Respuesta (`201 Created`):** Retorna `{ radicado: "SOL-2026-0010", solicitud: { ... } }`.

### 11.2. Responder y Gestionar Solicitud
* **Método:** `PATCH`
* **Ruta:** `/solicitudes/:id_solicitud/responder`
* **Permisos:** `ADMIN`, `INSTRUCTOR`
* **Cuerpo (JSON):**
```json
{
  "respuesta": "Documento firmado digitalmente expedido y adjuntado.",
  "nuevo_estado": "CERRADA",
  "comentario": "Trámite finalizado exitosamente."
}
```

---

## 12. MÓDULO DE NOTIFICACIONES (`/api/notificaciones`)

* `GET /notificaciones`: Retorna lista de alertas y contador `{ totalNoLeidas, notificaciones: [...] }`.
* `PATCH /notificaciones/:id_notificacion/leida`: Marca notificación como leída.
* `PATCH /notificaciones/marcar-todas`: Marca masivamente todas las notificaciones del usuario como leídas.

---

## 13. MÓDULO DE MÉTRICAS Y DASHBOARD (`/api/dashboard`)

* `GET /dashboard/stats`: Retorna KPIs institucionales en tiempo real (Total de aprendices, fichas activas, instructores, porcentaje de asistencia promedio y estado del asistente EDUNOVA AI).

---

## 14. MÓDULO DE REPORTES OFICIALES (`/api/reportes`)

* `GET /reportes/ficha/:id_curso/csv`: Genera descarga directa en streaming de la sábana de notas y asistencias en formato CSV con cabeceras UTF-8.
* `GET /reportes/aprendiz/:id_aprendiz/pdf`: Genera expediente individual formateado con membrete SENA para impresión o guardado en PDF.

---

## 15. MÓDULO DE DIRECTORIO DE USUARIOS (`/api/usuarios`)

* **Base:** `/usuarios`
* **Permisos Generales:** Requiere rol `ADMIN` con autenticación Bearer JWT.

### 15.1. Listar Directorio de Usuarios
* **Método:** `GET`
* **Ruta:** `/usuarios`
* **Parámetros de Consulta (Opcionales):** `?rol=INSTRUCTOR&estado=ACTIVO&busqueda=Carlos`
* **Respuesta (`200 OK`):**
```json
{
  "total": 35,
  "usuarios": [
    {
      "id_usuario": 1,
      "nombre": "Carlos",
      "apellido": "Mendoza",
      "correo": "carlos.mendoza@edunova.edu.co",
      "rol": "INSTRUCTOR",
      "estado": "ACTIVO",
      "fecha_creacion": "2026-11-23T11:32:00.000Z"
    }
  ]
}
```

### 15.2. Crear Usuario Institucional (HU-06)
* **Método:** `POST`
* **Ruta:** `/usuarios`
* **Cuerpo (JSON):**
```json
{
  "nombre": "Andrés",
  "apellido": "Rojas",
  "correo": "andres.rojas@edunova.edu.co",
  "password": "PasswordSeguro2026*",
  "rol": "INSTRUCTOR",
  "documento": "1085203040",
  "telefono": "3119876543"
}
```
* **Respuesta (`201 Created`):** Retorna `{ message: "Usuario creado exitosamente", usuario: { id_usuario, nombre, rol, estado } }`.

### 15.3. Suspender o Reactivar Cuenta (HU-07)
* **Método:** `PATCH`
* **Ruta:** `/usuarios/:id/estado`
* **Cuerpo (JSON):**
```json
{
  "estado": "INACTIVO"
}
```
* **Respuesta (`200 OK`):** Retorna `{ message: "Estado de usuario actualizado", usuario: { ... } }`.
* **Regla de Seguridad:** Bloquea la auto-suspensión de la cuenta de administrador activa (`400 Bad Request`).

---

## 16. MÓDULO DE GESTIÓN ACADÉMICA Y FICHAS (`/api/academico`)

### 16.1. Programas de Formación (HU-08)
* `GET /academico/programas`: Consulta catálogo de programas técnicos y tecnológicos.
* `POST /academico/programas`: Crea un nuevo programa formativo con validación de código único.

### 16.2. Apertura de Fichas de Caracterización (HU-09)
* `GET /academico/fichas`: Consulta fichas activas con cupos y programa asociado.
* `POST /academico/fichas`: Crea ficha de caracterización con validación de fechas (`fecha_fin > fecha_inicio`) y código único.

### 16.3. Asignación de Instructores (HU-10)
* `GET /academico/instructores-fichas`: Lista asignaciones vigentes.
* `POST /academico/asignar-instructor`: Asigna un instructor a una cohorte con control de asignación previa no duplicada.

### 16.4. Matrícula de Aprendices (HU-11)
* `GET /academico/aprendices-matriculados/:fichaId`: Consulta aprendices enrolados en la ficha.
* `POST /academico/matricular-aprendiz`: Matricula un aprendiz con control de cupo máximo institucional (hasta 35 aprendices).
