# EDUNOVA - SPRINT 2: IMPLEMENTACIÓN DE OPERACIONES CRUD

**Entregable:** 4. Implementar operaciones CRUD  
**Capa de Persistencia:** Prisma ORM Client sobre MySQL 8  
**Operaciones:** Create (Crear), Read (Consultar), Update (Actualizar), Delete (Eliminar / Inactivar)

---

## 1. Resumen de Implementación CRUD

En **EDUNOVA**, todas las operaciones CRUD están desacopladas en la capa de controladores (`/server/src/controllers/`), utilizando métodos asíncronos (`async/await`) con transacciones seguras de Prisma (`prisma.$transaction`) cuando se requiere consistencia multi-tabla (por ejemplo, crear un usuario y su perfil de aprendiz simultáneamente).

---

## 2. CRUD Módulo 1: Gestión de Usuarios (`usuarios.controller.js`)

Ruta base: `/api/usuarios` (Protegida para rol `ADMIN`)

### 2.1. CREATE (Crear Usuario con Perfil Específico)
Crea la cuenta en la tabla `usuarios` y, según el rol, genera automáticamente el registro dependiente en `aprendices` o `instructores` dentro de una transacción atómica:

```javascript
export const crearUsuario = async (req, res) => {
  try {
    const { email, password, nombre, apellido, rol, tipoDocumento, numeroDocumento, telefono, extraData } = req.body;

    // Validación de duplicados
    const existe = await prisma.usuario.findFirst({
      where: { OR: [{ email }, { numeroDocumento }] }
    });
    if (existe) {
      return res.status(400).json({ ok: false, mensaje: 'El correo o número de documento ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password || 'Password123!', 10);

    const nuevoUsuario = await prisma.$transaction(async (tx) => {
      const u = await tx.usuario.create({
        data: {
          email,
          password: hashedPassword,
          nombre,
          apellido,
          rol,
          tipoDocumento,
          numeroDocumento,
          telefono,
          estado: 'ACTIVO'
        }
      });

      if (rol === 'APRENDIZ') {
        await tx.aprendiz.create({
          data: {
            usuarioId: u.id,
            codigoMatricula: extraData?.codigoMatricula || `MAT-${Date.now()}`,
            jornada: extraData?.jornada || 'MANANA'
          }
        });
      } else if (rol === 'INSTRUCTOR') {
        await tx.instructor.create({
          data: {
            usuarioId: u.id,
            especialidad: extraData?.especialidad || 'Desarrollo de Software',
            sede: extraData?.sede || 'Sede Principal'
          }
        });
      }
      return u;
    });

    res.status(201).json({ ok: true, mensaje: 'Usuario creado exitosamente', data: nuevoUsuario });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al crear usuario', error: error.message });
  }
};
```

### 2.2. READ (Consultar Usuarios con Filtros y Paginación)
```javascript
export const obtenerUsuarios = async (req, res) => {
  try {
    const { rol, estado, q, limit = 50, page = 1 } = req.query;
    const where = {};

    if (rol) where.rol = rol;
    if (estado) where.estado = estado;
    if (q) {
      where.OR = [
        { nombre: { contains: q } },
        { apellido: { contains: q } },
        { email: { contains: q } },
        { numeroDocumento: { contains: q } }
      ];
    }

    const [total, usuarios] = await Promise.all([
      prisma.usuario.count({ where }),
      prisma.usuario.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        select: {
          id: true,
          email: true,
          nombre: true,
          apellido: true,
          rol: true,
          tipoDocumento: true,
          numeroDocumento: true,
          estado: true,
          telefono: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    res.json({ ok: true, total, pagina: Number(page), data: usuarios });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al obtener usuarios', error: error.message });
  }
};
```

### 2.3. UPDATE (Actualizar Datos de Usuario)
```javascript
export const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, telefono, estado, rol } = req.body;

    const actualizado = await prisma.usuario.update({
      where: { id: Number(id) },
      data: { nombre, apellido, telefono, estado, rol },
      select: { id: true, email: true, nombre: true, apellido: true, rol: true, estado: true }
    });

    res.json({ ok: true, mensaje: 'Usuario actualizado exitosamente', data: actualizado });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al actualizar usuario', error: error.message });
  }
};
```

### 2.4. DELETE (Borrado Lógico / Inactivación y Eliminación Definitiva)
Para proteger la integridad histórica de calificaciones y asistencias, el sistema implementa la desactivación de cuentas (`soft delete`), así como el borrado físico cuando no existen dependencias bloqueantes:

```javascript
export const cambiarEstadoUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body; // 'ACTIVO', 'INACTIVO', 'BLOQUEADO'

    const usuario = await prisma.usuario.update({
      where: { id: Number(id) },
      data: { estado }
    });

    res.json({ ok: true, mensaje: `Estado modificado a ${estado}`, data: usuario });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al cambiar estado', error: error.message });
  }
};
```

---

## 3. CRUD Módulo 2: Gestión Académica (`academico.controller.js`)

Ruta base: `/api/academico`

### Programas de Formación
- **Create:** `POST /api/academico/programas` (Código, nombre, nivel, duración).
- **Read:** `GET /api/academico/programas` (Lista programas activos con conteo de fichas).
- **Update:** `PUT /api/academico/programas/:id` (Modifica nombre o duración).
- **Delete:** `DELETE /api/academico/programas/:id` (Inactivación o eliminación si no tiene fichas asociadas).

### Cursos / Fichas
- **Create:** `POST /api/academico/cursos` (Código de ficha, programaId, instructorLiderId, cupos).
- **Read:** `GET /api/academico/cursos` y `GET /api/academico/cursos/:id` (Incluye datos del programa, instructor líder y total de aprendices).
- **Update:** `PUT /api/academico/cursos/:id` (Reasignación de instructor líder o cambio de jornada).
- **Delete:** `DELETE /api/academico/cursos/:id` (Finalización o cancelación de ficha).

---

## 4. CRUD Módulo 3: Evidencias y Calificaciones (`evidencias.controller.js`)

Ruta base: `/api/evidencias`

| Operación | Método | Endpoint | Descripción |
|---|:---:|---|---|
| **Create** | `POST` | `/api/evidencias` | El instructor crea una nueva actividad o taller evaluativo. |
| **Read** | `GET` | `/api/evidencias/curso/:cursoId` | Lista las evidencias programadas para la ficha. |
| **Read Detalle** | `GET` | `/api/evidencias/:id` | Consulta la descripción, fecha límite y ponderación de la evidencia. |
| **Update** | `PUT` | `/api/evidencias/:id` | Modifica título, instrucciones o prórroga de fecha límite. |
| **Delete** | `DELETE` | `/api/evidencias/:id` | Elimina la evidencia y sus calificaciones en cascada. |
| **Entrega** | `POST` | `/api/evidencias/:id/entrega` | El aprendiz adjunta su archivo o enlace de solución. |
| **Calificar** | `POST` | `/api/evidencias/:id/calificar` | El instructor emite el juicio evaluativo (`APROBADO` / `NO_APROBADO`) con retroalimentación. |

---

## 5. CRUD Módulo 4: Asistencia y Novedades (`asistencia.controller.js`)

Ruta base: `/api/asistencia`

- **Create (Toma Masiva de Lista):** `POST /api/asistencia/sesion`  
  Registra la asistencia de todos los aprendices de una ficha para una fecha dada en una sola transacción.
- **Read:** `GET /api/asistencia/curso/:cursoId?fecha=YYYY-MM-DD`  
  Obtiene la lista de verificación del día.
- **Update:** `PUT /api/asistencia/:id`  
  Modifica el estado de una asistencia específica (por ejemplo, cambiar de `FALLA_INJUSTIFICADA` a `FALLA_JUSTIFICADA` tras entrega de soporte médico).
- **Reporte:** `GET /api/asistencia/aprendiz/:aprendizId/resumen`  
  Calcula el porcentaje de asistencia acumulada para prevención de deserción.

---

## 6. CRUD Módulo 5: Ambientes de Aprendizaje y Reservas (`ambientes.controller.js`)

Ruta base: `/api/ambientes`

- **Create Ambiente:** `POST /api/ambientes` (Registra aula, taller o laboratorio).
- **Read Ambientes:** `GET /api/ambientes` (Consulta disponibilidad por sede y tipo).
- **Create Reserva:** `POST /api/ambientes/reservas` (Valida que el ambiente no se encuentre reservado en la misma franja horaria).
- **Delete Reserva:** `DELETE /api/ambientes/reservas/:id` (Cancela una reserva previa liberando el espacio).
