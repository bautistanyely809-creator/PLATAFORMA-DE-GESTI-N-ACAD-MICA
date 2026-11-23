# EDUNOVA - SPRINT 2: CREACIÓN Y MODELADO DE BASE DE DATOS

**Entregable:** 1. Crear base de datos  
**Motor de Base de Datos:** MySQL 8.0  
**Motor de Almacenamiento:** InnoDB (Soporte ACID, Foreign Keys y Transacciones)  
**ORM / Data Layer:** Prisma ORM v5+  
**Codificación:** `utf8mb4` / Collation: `utf8mb4_unicode_ci`  
**Nombre de Base de Datos:** `edunova_db`

---

## 1. Arquitectura y Enfoque del Modelo de Datos

La base de datos de **EDUNOVA** fue diseñada bajo la tercera forma normal (3NF) para garantizar la integridad referencial, eliminar la redundancia y optimizar el rendimiento de consultas analíticas y transaccionales para el entorno institucional del SENA.

### Aspectos Técnicos Destacados
1. **Modelado Declarativo con Prisma:** Permite control de tipos estricto en tiempo de compilación y migraciones consistentes.
2. **Integridad Referencial:** Restricciones de llave foránea explícitas con políticas de eliminación en cascada (`ON DELETE CASCADE`) en dependencias subordinadas y de protección en entidades maestras (`ON DELETE RESTRICT`).
3. **Manejo de Estados con Enums:** Tipificación nativa para roles, estados de usuario, tipos de documento, juicios evaluativos y estados de asistencia.
4. **Trazabilidad:** Marcas de tiempo automáticas (`createdAt` y `updatedAt`) en todas las tablas del sistema.

---

## 2. Diagrama Entidad-Relación y Estructura de Tablas

El modelo está compuesto por **16 modelos relacionales** principales:

```
[Usuario] ──1:1──┬── [Aprendiz] ─────1:N─── [CalificacionEvidencia]
                 │        │
                 │        └──1:N─── [Asistencia]
                 │        │
                 │        └──1:N─── [AlertaTemprana] ──1:1── [PlanRecuperacion]
                 │        │
                 │        └──1:N─── [SolicitudInstitucional]
                 │
                 └──1:1──── [Instructor] ──1:N─── [ReservaAmbiente]
                                │
                                └──1:N─── [Curso] (Ficha) ──1:N── [Evidencia]
                                            │                      │
                                            └──N:M── [Aprendiz]    └──1:N── [CalificacionEvidencia]
                                            │
                                            └──N:1── [Programa]

[Competencia] ──1:N── [SeguimientoCompetencia] ──N:1── [Curso]
[Ambiente] ────1:N── [ReservaAmbiente]
[Notificacion] ─N:1── [Usuario]
```

---

## 3. Catálogo de Modelos y Tablas en MySQL

### 3.1. Módulo de Identidad y Usuarios

#### `Usuario` (`usuarios`)
Almacena las credenciales principales, estado de autenticación y rol asignado.
- `id` (INT, PK, Auto-Increment)
- `email` (VARCHAR(191), UNIQUE, Not Null): Correo institucional.
- `password` (VARCHAR(255), Not Null): Hash Bcrypt con 10 rondas de salt.
- `nombre` (VARCHAR(100), Not Null)
- `apellido` (VARCHAR(100), Not Null)
- `rol` (ENUM: `ADMIN`, `INSTRUCTOR`, `APRENDIZ`, `COORDINADOR`)
- `tipoDocumento` (ENUM: `CC`, `TI`, `CE`, `PASAPORTE`, `PEP`)
- `numeroDocumento` (VARCHAR(50), UNIQUE, Not Null)
- `telefono` (VARCHAR(20), Nullable)
- `avatar` (VARCHAR(255), Nullable): Ruta de avatar o emoji.
- `estado` (ENUM: `ACTIVO`, `INACTIVO`, `BLOQUEADO`)
- `resetToken` / `resetTokenExpires` (VARCHAR/DATETIME, Nullable): Recuperación de clave.
- `createdAt` / `updatedAt` (DATETIME)

#### `Aprendiz` (`aprendices`)
Extensión del perfil para estudiantes/aprendices.
- `id` (INT, PK, Auto-Increment)
- `usuarioId` (INT, UNIQUE, FK -> Usuario.id ON DELETE CASCADE)
- `codigoMatricula` (VARCHAR(50), UNIQUE, Not Null)
- `jornada` (ENUM: `MANANA`, `TARDE`, `NOCHE`, `MIXTA`)
- `promedio` (DECIMAL(4,2), Default 0.00)
- `estadoFormacion` (ENUM: `EN_FORMACION`, `CONDICIONADO`, `CANCELADO`, `GRADUADO`)

#### `Instructor` (`instructores`)
Extensión del perfil para docentes/instructores.
- `id` (INT, PK, Auto-Increment)
- `usuarioId` (INT, UNIQUE, FK -> Usuario.id ON DELETE CASCADE)
- `especialidad` (VARCHAR(150), Not Null)
- `tipoContrato` (ENUM: `PLANTA`, `CONTRATISTA`)
- `sede` (VARCHAR(100), Not Null)

---

### 3.2. Módulo de Gestión Académica

#### `Programa` (`programas`)
Programas de formación técnica y tecnológica.
- `id` (INT, PK, Auto-Increment)
- `codigo` (VARCHAR(50), UNIQUE, Not Null): Código curricular nacional.
- `nombre` (VARCHAR(200), Not Null): Ejemplo: "ADSO - Análisis y Desarrollo de Software".
- `nivel` (ENUM: `TECNICO`, `TECNOLOGO`, `ESPECIALIZACION`, `CURSO_CORTO`)
- `duracionMeses` (INT, Not Null)
- `version` (VARCHAR(20), Default '1')
- `estado` (ENUM: `ACTIVO`, `INACTIVO`)

#### `Curso` (`cursos` / Fichas)
Fichas académicas correspondientes a cohortes de formación.
- `id` (INT, PK, Auto-Increment)
- `codigoFicha` (VARCHAR(50), UNIQUE, Not Null): Ejemplo: "3413988".
- `nombre` (VARCHAR(200), Not Null)
- `jornada` (ENUM: `MANANA`, `TARDE`, `NOCHE`, `MIXTA`)
- `fechaInicio` / `fechaFin` (DATETIME)
- `programaId` (INT, FK -> Programa.id ON DELETE RESTRICT)
- `instructorLiderId` (INT, Nullable, FK -> Instructor.id ON DELETE SET NULL)
- `cupoMaximo` (INT, Default 30)
- `estado` (ENUM: `ACTIVO`, `FINALIZADO`, `CANCELADO`)

#### Tabla Intermedia `_AprendicesEnCursos`
Relación N:M entre `Aprendiz` y `Curso` para soporte de matriculaciones múltiples y traslados.

---

### 3.3. Módulo de Evaluación, Evidencias y Calificaciones

#### `Evidencia` (`evidencias`)
Actividades y talleres evaluativos programados por los instructores.
- `id` (INT, PK, Auto-Increment)
- `titulo` (VARCHAR(200), Not Null)
- `descripcion` (TEXT, Not Null)
- `tipo` (ENUM: `CONOCIMIENTO`, `PRODUCTO`, `DESEMPENO`)
- `fechaLimite` (DATETIME, Not Null)
- `porcentaje` (DECIMAL(5,2), Default 10.00): Ponderación sobre el resultado.
- `cursoId` (INT, FK -> Curso.id ON DELETE CASCADE)
- `instructorId` (INT, FK -> Instructor.id ON DELETE RESTRICT)
- `competenciaId` (INT, Nullable, FK -> Competencia.id)

#### `CalificacionEvidencia` (`calificaciones_evidencias`)
Entregas y juicios evaluativos SENA.
- `id` (INT, PK, Auto-Increment)
- `evidenciaId` (INT, FK -> Evidencia.id ON DELETE CASCADE)
- `aprendizId` (INT, FK -> Aprendiz.id ON DELETE CASCADE)
- `juicio` (ENUM: `APROBADO`, `NO_APROBADO`, `PENDIENTE`)
- `calificacionNumerica` (DECIMAL(4,2), Nullable): Escala numérica (0.0 a 5.0 o 0 a 100).
- `retroalimentacion` (TEXT, Nullable)
- `fechaCalificacion` (DATETIME, Nullable)
- `archivoUrl` (VARCHAR(255), Nullable): Evidencia adjunta por el aprendiz.

---

### 3.4. Módulo de Asistencia, Seguimiento y Alertas

#### `Asistencia` (`asistencias`)
Control de asistencia por sesión y fecha.
- `id` (INT, PK, Auto-Increment)
- `aprendizId` (INT, FK -> Aprendiz.id ON DELETE CASCADE)
- `cursoId` (INT, FK -> Curso.id ON DELETE CASCADE)
- `fecha` (DATE, Not Null)
- `estado` (ENUM: `PRESENTE`, `FALLA_JUSTIFICADA`, `FALLA_INJUSTIFICADA`, `RETARDO`)
- `observacion` (TEXT, Nullable)

#### `AlertaTemprana` (`alertas_tempranas`)
Detección de riesgo de deserción o bajo rendimiento.
- `id` (INT, PK, Auto-Increment)
- `aprendizId` (INT, FK -> Aprendiz.id ON DELETE CASCADE)
- `cursoId` (INT, FK -> Curso.id ON DELETE CASCADE)
- `tipoAlerta` (ENUM: `ASISTENCIA`, `ACADEMICA`, `DISCIPLINARIA`, `DESERCION`)
- `nivel` (ENUM: `BAJO`, `MEDIO`, `ALTO`, `CRITICO`)
- `descripcion` (TEXT, Not Null)
- `estado` (ENUM: `ABIERTA`, `EN_PROCESO`, `RESUELTA`)

#### `PlanRecuperacion` (`planes_recuperacion`)
Planes de mejoramiento para aprendices con juicios "No Aprobado" o alertas.
- `id` (INT, PK, Auto-Increment)
- `alertaId` (INT, UNIQUE, FK -> AlertaTemprana.id ON DELETE CASCADE)
- `actividades` (TEXT, Not Null)
- `fechaCompromiso` (DATETIME, Not Null)
- `estado` (ENUM: `PENDIENTE`, `CUMPLIDO`, `INCUMPLIDO`)

---

### 3.5. Módulo de Infraestructura y Gestión Institucional

#### `Ambiente` (`ambientes`)
Aulas, laboratorios de cómputo y talleres de formación.
- `id` (INT, PK, Auto-Increment)
- `nombre` (VARCHAR(100), Not Null): Ejemplo: "Laboratorio TIC 402".
- `tipo` (ENUM: `AULA`, `LABORATORIO_COMPUTO`, `TALLER_PRACTICO`, `AUDITORIO`)
- `capacidad` (INT, Not Null)
- `sede` (VARCHAR(100), Not Null)
- `equipamiento` (TEXT, Nullable)
- `estado` (ENUM: `DISPONIBLE`, `MANTENIMIENTO`, `OCUPADO`)

#### `ReservaAmbiente` (`reservas_ambientes`)
Agenda de reservas horarias.
- `id` (INT, PK, Auto-Increment)
- `ambienteId` (INT, FK -> Ambiente.id ON DELETE CASCADE)
- `instructorId` (INT, FK -> Instructor.id ON DELETE RESTRICT)
- `fecha` (DATE, Not Null)
- `horaInicio` / `horaFin` (TIME, Not Null)
- `motivo` (VARCHAR(200), Not Null)
- `estado` (ENUM: `CONFIRMADA`, `CANCELADA`)

#### `SolicitudInstitucional` (`solicitudes_institucionales`)
Certificaciones, traslados, aplazamientos y paz y salvos.
- `id` (INT, PK, Auto-Increment)
- `usuarioId` (INT, FK -> Usuario.id ON DELETE CASCADE)
- `tipoSolicitud` (VARCHAR(100), Not Null)
- `detalles` (TEXT, Not Null)
- `estado` (ENUM: `PENDIENTE`, `EN_REVISION`, `APROBADA`, `RECHAZADA`)
- `respuesta` (TEXT, Nullable)

---

## 4. Script de Inicialización y Poblado de Datos

El repositorio incluye dos mecanismos para recrear la base de datos de manera inmediata:

### Opción A: Mediante Prisma ORM (Recomendado)
```bash
# 1. Empujar el esquema declarativo a MySQL
cd server
npx prisma db push

# 2. Generar el cliente de acceso de datos
npx prisma generate

# 3. Ejecutar los scripts de semillas
npx prisma db seed
```

### Opción B: Mediante Script SQL Puro (DDL)
Se encuentra disponible el archivo `docs/database/edunova_db.sql` el cual puede ser ejecutado directamente en MySQL Workbench o phpMyAdmin:
```bash
mysql -u root -p edunova_db < docs/database/edunova_db.sql
```

---

## 5. Datos Semilla (Seeds) Incluidos
La base de datos cuenta con datos de prueba realistas para la validación de Sprint 2:
- **Administrador:** `admin@edunova.edu.co` (Rol: `ADMIN`).
- **Instructor Líder:** `carlos.instructor@edunova.edu.co` (Rol: `INSTRUCTOR`, Especialidad: Arquitectura de Software).
- **Aprendiz:** `anyely.aprendiz@edunova.edu.co` (Rol: `APRENDIZ`, Ficha: ADSO 3413988).
- **Ficha Académica:** Ficha `3413988` asociada al programa *Análisis y Desarrollo de Software*.
- **Contraseña universal para todas las cuentas de prueba:** `Password123!` (hasheada con Bcrypt).
