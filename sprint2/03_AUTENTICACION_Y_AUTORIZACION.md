# EDUNOVA - SPRINT 2: DESARROLLO DE AUTENTICACIÓN Y AUTORIZACIÓN

**Entregable:** 3. Desarrollar autenticación y autorización  
**Mecanismo Criptográfico:** Bcryptjs (10 rondas de salt para contraseñas)  
**Mecanismo de Sesión:** JSON Web Tokens (JWT con algoritmo HS256)  
**Modelo de Autorización:** RBAC (Role-Based Access Control)  
**Roles Soportados:** `ADMIN`, `INSTRUCTOR`, `APRENDIZ`, `COORDINADOR`

---

## 1. Arquitectura de Seguridad

La seguridad de **EDUNOVA** está construida sobre dos pilares independientes y complementarios:

1. **Autenticación (¿Quién eres?):** Verifica la identidad del usuario mediante credenciales institucionales (correo y contraseña). Si son válidas y la cuenta está activa, se expide un token JWT firmado criptográficamente.
2. **Autorización (¿Qué puedes hacer?):** Intercepta cada solicitud mediante middlewares de Express para inspeccionar el token, decodificar el rol del usuario y determinar si tiene privilegios para acceder al recurso solicitado.

```
+---------------+     POST /api/auth/login     +-------------------------+
|    Cliente    | ───────────────────────────> |  auth.controller.js     |
| (Frontend/API)|                              |  1. Buscar por email    |
|               | <─────────────────────────── |  2. Comparar Bcrypt     |
+---------------+       Token JWT (24h)        |  3. Firmar Token JWT    |
        │                                      +-------------------------+
        │  GET /api/usuarios
        │  Header: "Authorization: Bearer <token>"
        ▼
+------------------------------------------------------------------------+
|                          PIPELINE DE SEGURIDAD                         |
|                                                                        |
|  1. auth.middleware.js                                                 |
|     - ¿Tiene header Authorization?          -> No  : 401 Unauthorized  |
|     - ¿Token tiene formato "Bearer <jwt>"?   -> No  : 401 Unauthorized  |
|     - ¿Firma secreta es válida y no expiró? -> No  : 401 Unauthorized  |
|     - ¿Usuario existe y estado === ACTIVO?   -> No  : 403 Forbidden     |
|     - Inyecta req.user = { id, email, rol, ... }                       |
|                                                                        |
|  2. roles.middleware.js ("ADMIN")                                      |
|     - ¿rolesPermitidos.includes(req.user.rol)?                         |
|       * Sí: next() -> Pasa al Controlador                              |
|       * No: 403 Forbidden ("Acceso no autorizado para este rol")      |
+------------------------------------------------------------------------+
```

---

## 2. Implementación de la Autenticación

### 2.1. Cifrado Seguro de Contraseñas con Bcrypt
Las contraseñas nunca se almacenan en texto plano en la base de datos MySQL. En el momento de la creación o actualización de un usuario, se aplica una función hash con sal:

```javascript
import bcrypt from 'bcryptjs';

// Hasheo de contraseña
const saltRounds = 10;
const hashedPassword = await bcrypt.hash(passwordTextoPlano, saltRounds);

// Comparación durante el login
const coincide = await bcrypt.compare(passwordIngresada, usuario.password);
if (!coincide) {
  return res.status(401).json({ ok: false, mensaje: 'Credenciales inválidas' });
}
```

### 2.2. Generación y Firma del Token JWT
Cuando las credenciales son válidas y el estado del usuario es `ACTIVO`, el controlador expide el token firmado con la clave secreta institucional:

```javascript
import jwt from 'jsonwebtoken';

const token = jwt.sign(
  {
    id: usuario.id,
    email: usuario.email,
    rol: usuario.rol,
    nombre: `${usuario.nombre} ${usuario.apellido}`
  },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);
```

---

## 3. Implementación de los Middlewares de Seguridad

### 3.1. Middleware de Autenticación (`auth.middleware.js`)
Intercepta las solicitudes entrantes, extrae el token de la cabecera HTTP y verifica su autenticidad:

```javascript
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';

export const verificarToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Acceso no autorizado: Token no proporcionado o formato inválido'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verificación de integridad con la base de datos
    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, rol: true, estado: true, nombre: true, apellido: true }
    });

    if (!usuario) {
      return res.status(401).json({ ok: false, mensaje: 'Usuario inexistente o eliminado' });
    }

    if (usuario.estado !== 'ACTIVO') {
      return res.status(403).json({
        ok: false,
        mensaje: `La cuenta de usuario se encuentra en estado: ${usuario.estado}`
      });
    }

    req.user = usuario;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ ok: false, mensaje: 'El token ha expirado. Inicie sesión nuevamente' });
    }
    return res.status(401).json({ ok: false, mensaje: 'Token inválido o corrupto' });
  }
};
```

### 3.2. Middleware de Autorización por Roles (`roles.middleware.js`)
Permite restringir endpoints a uno o varios roles específicos:

```javascript
export const autorizarRoles = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ ok: false, mensaje: 'Usuario no autenticado' });
    }

    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({
        ok: false,
        mensaje: `Acceso denegado: El rol '${req.user.rol}' no tiene permisos para realizar esta operación`
      });
    }

    next();
  };
};
```

---

## 4. Matriz de Control de Acceso por Roles (RBAC)

| Módulo / Recurso | Método HTTP | Endpoint | Roles Permitidos |
|---|:---:|---|---|
| Autenticación | `POST` | `/api/auth/login` | Público (Cualquiera) |
| Perfil Propio | `GET` | `/api/auth/perfil` | `ADMIN`, `INSTRUCTOR`, `APRENDIZ` |
| Gestión de Usuarios | `GET`, `POST`, `PUT`, `DELETE` | `/api/usuarios/*` | Exclusivo `ADMIN` |
| Programas y Cursos | `POST`, `PUT`, `DELETE` | `/api/academico/*` | Exclusivo `ADMIN` |
| Asignar Competencias | `POST`, `PUT` | `/api/competencias/*` | `ADMIN`, `INSTRUCTOR` |
| Crear Evidencias | `POST`, `PUT`, `DELETE` | `/api/evidencias` | `INSTRUCTOR`, `ADMIN` |
| Calificar Evidencias | `POST`, `PUT` | `/api/evidencias/:id/calificar` | `INSTRUCTOR` |
| Subir Evidencia | `POST` | `/api/evidencias/:id/entrega` | `APRENDIZ` |
| Tomar Asistencia | `POST`, `PUT` | `/api/asistencia` | `INSTRUCTOR` |
| Consultar Asistencia | `GET` | `/api/asistencia/aprendiz/:id` | `APRENDIZ` (Propia), `INSTRUCTOR`, `ADMIN` |
| Radicar Alerta Temprana| `POST` | `/api/alertas` | `INSTRUCTOR`, `ADMIN` |
| Reservar Ambientes | `POST`, `DELETE` | `/api/ambientes/reservas` | `INSTRUCTOR`, `ADMIN` |
| Solicitudes Aprendiz | `POST`, `GET` | `/api/solicitudes` | `APRENDIZ` (Radicar), `ADMIN` (Aprobar) |

---

## 5. Casos de Prueba de Seguridad Validados

1. **Intento de acceso sin cabecera `Authorization`:**
   - **Respuesta:** `401 Unauthorized`
   - **JSON:** `{"ok": false, "mensaje": "Acceso no autorizado: Token no proporcionado..."}`
2. **Token manipulado o con firma alterada:**
   - **Respuesta:** `401 Unauthorized`
   - **JSON:** `{"ok": false, "mensaje": "Token inválido o corrupto"}`
3. **Aprendiz intentando crear un nuevo usuario:**
   - **Respuesta:** `403 Forbidden`
   - **JSON:** `{"ok": false, "mensaje": "Acceso denegado: El rol 'APRENDIZ' no tiene permisos..."}`
4. **Usuario con estado `INACTIVO` intentando operar:**
   - **Respuesta:** `403 Forbidden`
   - **JSON:** `{"ok": false, "mensaje": "La cuenta de usuario se encuentra en estado: INACTIVO"}`
