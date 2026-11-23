# EDUNOVA - SPRINT 2: DOCUMENTACIÓN DE ENDPOINTS DE LA API REST

**Entregable:** 5. Documentar endpoints  
**URL Base de la API:** `http://localhost:4000/api`  
**Formato de Carga Útil:** JSON (`application/json`)  
**Autenticación en Cabecera:** `Authorization: Bearer <TOKEN_JWT>`  
**Colección de Postman:** Incluida en `docs/EDUNOVA_API.postman_collection.json`

---

## 1. Convenciones y Códigos de Respuesta

| Código HTTP | Significado | Escenario de Uso en EDUNOVA |
|:---:|---|---|
| `200 OK` | Petición exitosa | Consultas (`GET`), actualizaciones (`PUT`/`PATCH`) y autenticación. |
| `201 Created` | Recurso creado | Registro de usuarios, creación de cursos, evidencias y reservas. |
| `400 Bad Request` | Parámetros inválidos | Faltan campos obligatorios o formatos de datos erróneos. |
| `401 Unauthorized` | No autenticado | Token faltante, corrupto o expirado. |
| `403 Forbidden` | Acceso denegado | Token válido pero rol no autorizado para el recurso. |
| `404 Not Found` | No encontrado | El recurso o ID solicitado no existe en la base de datos. |
| `500 Internal Error` | Error de servidor | Excepción no controlada en la base de datos o el backend. |

---

## 2. Catálogo Detallado de Endpoints

### 2.1. Módulo: Autenticación (`/api/auth`)

#### `POST /api/auth/login`
Autentica a un usuario institucional y genera un token JWT.
- **Acceso:** Público
- **Headers:** `Content-Type: application/json`
- **Body de Entrada:**
  ```json
  {
    "email": "admin@edunova.edu.co",
    "password": "Password123!"
  }
  ```
- **Respuesta Exitosa (`200 OK`):**
  ```json
  {
    "ok": true,
    "mensaje": "Inicio de sesión exitoso",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "usuario": {
      "id": 1,
      "email": "admin@edunova.edu.co",
      "nombre": "Administrador",
      "apellido": "Sistema",
      "rol": "ADMIN",
      "avatar": "👨🏻‍💼"
    }
  }
  ```
- **Respuesta de Error (`401 Unauthorized`):**
  ```json
  {
    "ok": false,
    "mensaje": "Credenciales inválidas"
  }
  ```

#### `GET /api/auth/perfil`
Devuelve la información del usuario autenticado a partir del token.
- **Acceso:** Requiere Autenticación (`ADMIN`, `INSTRUCTOR`, `APRENDIZ`)
- **Headers:** `Authorization: Bearer <TOKEN_JWT>`
- **Respuesta Exitosa (`200 OK`):**
  ```json
  {
    "ok": true,
    "usuario": {
      "id": 1,
      "email": "admin@edunova.edu.co",
      "nombre": "Administrador",
      "apellido": "Sistema",
      "rol": "ADMIN",
      "tipoDocumento": "CC",
      "numeroDocumento": "1000000001",
      "estado": "ACTIVO"
    }
  }
  ```

---

### 2.2. Módulo: Usuarios (`/api/usuarios`)

#### `GET /api/usuarios`
Lista todos los usuarios con paginación y filtros.
- **Acceso:** Exclusivo `ADMIN`
- **Headers:** `Authorization: Bearer <TOKEN_JWT>`
- **Query Params:** `rol=APRENDIZ`, `estado=ACTIVO`, `page=1`, `limit=20`
- **Respuesta Exitosa (`200 OK`):**
  ```json
  {
    "ok": true,
    "total": 35,
    "pagina": 1,
    "data": [
      {
        "id": 3,
        "email": "anyely.aprendiz@edunova.edu.co",
        "nombre": "Anyely",
        "apellido": "Bautista",
        "rol": "APRENDIZ",
        "estado": "ACTIVO",
        "numeroDocumento": "1098765432"
      }
    ]
  }
  ```

#### `POST /api/usuarios`
Registra un nuevo usuario con su perfil asociado.
- **Acceso:** Exclusivo `ADMIN`
- **Headers:** `Authorization: Bearer <TOKEN_JWT>`
- **Body de Entrada:**
  ```json
  {
    "email": "nuevo.aprendiz@edunova.edu.co",
    "password": "Password123!",
    "nombre": "Juan",
    "apellido": "Pérez",
    "rol": "APRENDIZ",
    "tipoDocumento": "CC",
    "numeroDocumento": "1090123456",
    "telefono": "3101234567",
    "extraData": {
      "codigoMatricula": "MAT-2026-001",
      "jornada": "MANANA"
    }
  }
  ```
- **Respuesta Exitosa (`201 Created`):**
  ```json
  {
    "ok": true,
    "mensaje": "Usuario creado exitosamente",
    "data": { "id": 15, "email": "nuevo.aprendiz@edunova.edu.co", "rol": "APRENDIZ" }
  }
  ```

#### `PUT /api/usuarios/:id`
Actualiza la información de un usuario.
- **Acceso:** Exclusivo `ADMIN`
- **Headers:** `Authorization: Bearer <TOKEN_JWT>`
- **Respuesta Exitosa (`200 OK`):**
  ```json
  {
    "ok": true,
    "mensaje": "Usuario actualizado exitosamente",
    "data": { "id": 15, "nombre": "Juan Carlos", "telefono": "3209876543" }
  }
  ```

#### `PATCH /api/usuarios/:id/estado`
Cambia el estado de la cuenta (`ACTIVO`, `INACTIVO`, `BLOQUEADO`).
- **Acceso:** Exclusivo `ADMIN`
- **Headers:** `Authorization: Bearer <TOKEN_JWT>`
- **Body de Entrada:** `{ "estado": "INACTIVO" }`
- **Respuesta Exitosa (`200 OK`):**
  ```json
  {
    "ok": true,
    "mensaje": "Estado modificado a INACTIVO"
  }
  ```

---

### 2.3. Módulo: Gestión Académica (`/api/academico`)

#### `GET /api/academico/programas`
Lista los programas curriculares ofertados.
- **Acceso:** Autenticado
- **Respuesta Exitosa (`200 OK`):**
  ```json
  {
    "ok": true,
    "data": [
      {
        "id": 1,
        "codigo": "228106",
        "nombre": "Análisis y Desarrollo de Software",
        "nivel": "TECNOLOGO",
        "duracionMeses": 24,
        "totalCursos": 2
      }
    ]
  }
  ```

#### `GET /api/academico/cursos`
Lista las fichas de formación académica.
- **Acceso:** Autenticado
- **Respuesta Exitosa (`200 OK`):**
  ```json
  {
    "ok": true,
    "data": [
      {
        "id": 1,
        "codigoFicha": "3413988",
        "nombre": "ADSO - Ficha 3413988",
        "jornada": "MANANA",
        "programa": { "nombre": "Análisis y Desarrollo de Software" },
        "instructorLider": { "usuario": { "nombre": "Carlos", "apellido": "Rodríguez" } },
        "totalAprendices": 28
      }
    ]
  }
  ```

---

### 2.4. Módulo: Evidencias y Calificaciones (`/api/evidencias`)

#### `POST /api/evidencias`
Crea una nueva actividad evaluativa para una ficha.
- **Acceso:** `INSTRUCTOR`, `ADMIN`
- **Headers:** `Authorization: Bearer <TOKEN_JWT>`
- **Body de Entrada:**
  ```json
  {
    "cursoId": 1,
    "titulo": "Taller 02: API REST con Express y Prisma",
    "descripcion": "Implementar endpoints CRUD con JWT para la entrega de Sprint 2",
    "tipo": "PRODUCTO",
    "fechaLimite": "2026-12-05T23:59:59.000Z",
    "porcentaje": 20.0
  }
  ```
- **Respuesta Exitosa (`201 Created`):**
  ```json
  {
    "ok": true,
    "mensaje": "Evidencia creada correctamente",
    "data": { "id": 8, "titulo": "Taller 02: API REST con Express y Prisma" }
  }
  ```

#### `POST /api/evidencias/:id/calificar`
Registra el juicio evaluativo y retroalimentación de un aprendiz.
- **Acceso:** `INSTRUCTOR`
- **Headers:** `Authorization: Bearer <TOKEN_JWT>`
- **Body de Entrada:**
  ```json
  {
    "aprendizId": 3,
    "juicio": "APROBADO",
    "calificacionNumerica": 5.0,
    "retroalimentacion": "Excelente implementación de la arquitectura REST y seguridad con JWT."
  }
  ```
- **Respuesta Exitosa (`200 OK`):**
  ```json
  {
    "ok": true,
    "mensaje": "Calificación registrada exitosamente"
  }
  ```

---

### 2.5. Módulo: Asistencia (`/api/asistencia`)

#### `POST /api/asistencia/sesion`
Toma masiva de asistencia para una sesión de formación.
- **Acceso:** `INSTRUCTOR`
- **Headers:** `Authorization: Bearer <TOKEN_JWT>`
- **Body de Entrada:**
  ```json
  {
    "cursoId": 1,
    "fecha": "2026-11-23",
    "asistencias": [
      { "aprendizId": 3, "estado": "PRESENTE" },
      { "aprendizId": 4, "estado": "FALLA_JUSTIFICADA", "observacion": "Cita médica" }
    ]
  }
  ```
- **Respuesta Exitosa (`200 OK`):**
  ```json
  {
    "ok": true,
    "mensaje": "Asistencia registrada exitosamente para 28 aprendices"
  }
  ```

---

## 3. Uso de la Colección de Postman

Para facilitar la evaluación de los endpoints, se incluye la colección oficial de pruebas en:
`docs/EDUNOVA_API.postman_collection.json`

### Pasos para Ejecutar en Postman:
1. Abrir **Postman**.
2. Hacer clic en **Import** y seleccionar el archivo `EDUNOVA_API.postman_collection.json`.
3. Configurar la variable de entorno de colección:
   - `base_url`: `http://localhost:4000/api`
4. Ejecutar la petición **1. Auth - Iniciar Sesión (Admin)**.
5. Copiar el token generado y asignarlo a la variable `token` de Postman para probar el resto de peticiones con autorización automática.
