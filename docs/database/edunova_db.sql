-- ==============================================================================
-- PROYECTO ADSO: EDUNOVA - Academic Management System
-- Base de Datos: edunova_db (MySQL 8.0+)
-- Desarrolladora: Anyely Valeria
-- Centro de Formación Industrial - SENA Regional Huila (Neiva)
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS edunova_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE edunova_db;

-- Desactivar chequeo de llaves foráneas para permitir creación y borrado seguro
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS OBSERVACION;
DROP TABLE IF EXISTS ASISTENCIA;
DROP TABLE IF EXISTS CALIFICACION;
DROP TABLE IF EXISTS EVIDENCIA;
DROP TABLE IF EXISTS INSCRIPCION;
DROP TABLE IF EXISTS CURSO_INSTRUCTOR;
DROP TABLE IF EXISTS CURSO;
DROP TABLE IF EXISTS PROGRAMA;
DROP TABLE IF EXISTS INSTRUCTOR;
DROP TABLE IF EXISTS APRENDIZ;
DROP TABLE IF EXISTS USUARIO;

SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------------------------
-- 1. TABLA: USUARIO
-- ------------------------------------------------------------------------------
CREATE TABLE USUARIO (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM('ADMIN', 'INSTRUCTOR', 'APRENDIZ') NOT NULL DEFAULT 'APRENDIZ',
    estado ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_usuario_correo (correo),
    INDEX idx_usuario_rol (rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 2. TABLA: APRENDIZ
-- ------------------------------------------------------------------------------
CREATE TABLE APRENDIZ (
    id_aprendiz INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL UNIQUE,
    documento VARCHAR(20) NOT NULL UNIQUE,
    telefono VARCHAR(20) NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_aprendiz_usuario FOREIGN KEY (id_usuario) 
        REFERENCES USUARIO(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_aprendiz_documento (documento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 3. TABLA: INSTRUCTOR
-- ------------------------------------------------------------------------------
CREATE TABLE INSTRUCTOR (
    id_instructor INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL UNIQUE,
    especialidad VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NULL,
    CONSTRAINT fk_instructor_usuario FOREIGN KEY (id_usuario) 
        REFERENCES USUARIO(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 4. TABLA: PROGRAMA
-- ------------------------------------------------------------------------------
CREATE TABLE PROGRAMA (
    id_programa INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT NULL,
    estado ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_programa_codigo (codigo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 5. TABLA: CURSO
-- ------------------------------------------------------------------------------
CREATE TABLE CURSO (
    id_curso INT AUTO_INCREMENT PRIMARY KEY,
    id_programa INT NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    estado ENUM('ACTIVO', 'FINALIZADO', 'CANCELADO') NOT NULL DEFAULT 'ACTIVO',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_curso_programa FOREIGN KEY (id_programa) 
        REFERENCES PROGRAMA(id_programa) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_curso_programa (id_programa),
    INDEX idx_curso_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 6. TABLA: CURSO_INSTRUCTOR
-- ------------------------------------------------------------------------------
CREATE TABLE CURSO_INSTRUCTOR (
    id_curso_instructor INT AUTO_INCREMENT PRIMARY KEY,
    id_curso INT NOT NULL,
    id_instructor INT NOT NULL,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ci_curso FOREIGN KEY (id_curso) 
        REFERENCES CURSO(id_curso) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_ci_instructor FOREIGN KEY (id_instructor) 
        REFERENCES INSTRUCTOR(id_instructor) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY uk_curso_instructor (id_curso, id_instructor)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 7. TABLA: INSCRIPCION
-- ------------------------------------------------------------------------------
CREATE TABLE INSCRIPCION (
    id_inscripcion INT AUTO_INCREMENT PRIMARY KEY,
    id_aprendiz INT NOT NULL,
    id_curso INT NOT NULL,
    fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('ACTIVO', 'RETIRADO', 'APROBADO', 'NO_APROBADO') NOT NULL DEFAULT 'ACTIVO',
    CONSTRAINT fk_inscripcion_aprendiz FOREIGN KEY (id_aprendiz) 
        REFERENCES APRENDIZ(id_aprendiz) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_inscripcion_curso FOREIGN KEY (id_curso) 
        REFERENCES CURSO(id_curso) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY uk_aprendiz_curso (id_aprendiz, id_curso),
    INDEX idx_inscripcion_aprendiz (id_aprendiz),
    INDEX idx_inscripcion_curso (id_curso)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 8. TABLA: EVIDENCIA
-- ------------------------------------------------------------------------------
CREATE TABLE EVIDENCIA (
    id_evidencia INT AUTO_INCREMENT PRIMARY KEY,
    id_curso INT NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT NULL,
    porcentaje DECIMAL(5,2) NOT NULL DEFAULT 100.00,
    fecha_limite DATE NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_evidencia_curso FOREIGN KEY (id_curso) 
        REFERENCES CURSO(id_curso) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_evidencia_curso (id_curso)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 9. TABLA: CALIFICACION
-- ------------------------------------------------------------------------------
CREATE TABLE CALIFICACION (
    id_calificacion INT AUTO_INCREMENT PRIMARY KEY,
    id_inscripcion INT NOT NULL,
    id_evidencia INT NOT NULL,
    nota DECIMAL(4,2) NOT NULL CHECK (nota >= 0.00 AND nota <= 5.00),
    observacion TEXT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_calificacion_inscripcion FOREIGN KEY (id_inscripcion) 
        REFERENCES INSCRIPCION(id_inscripcion) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_calificacion_evidencia FOREIGN KEY (id_evidencia) 
        REFERENCES EVIDENCIA(id_evidencia) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY uk_inscripcion_evidencia (id_inscripcion, id_evidencia),
    INDEX idx_calificacion_nota (nota)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 10. TABLA: ASISTENCIA
-- ------------------------------------------------------------------------------
CREATE TABLE ASISTENCIA (
    id_asistencia INT AUTO_INCREMENT PRIMARY KEY,
    id_inscripcion INT NOT NULL,
    fecha DATE NOT NULL,
    estado ENUM('PRESENTE', 'AUSENTE', 'TARDANZA', 'EXCUSA') NOT NULL DEFAULT 'PRESENTE',
    observacion TEXT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_asistencia_inscripcion FOREIGN KEY (id_inscripcion) 
        REFERENCES INSCRIPCION(id_inscripcion) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY uk_asistencia_dia (id_inscripcion, fecha),
    INDEX idx_asistencia_fecha (fecha),
    INDEX idx_asistencia_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 11. TABLA: OBSERVACION
-- ------------------------------------------------------------------------------
CREATE TABLE OBSERVACION (
    id_observacion INT AUTO_INCREMENT PRIMARY KEY,
    id_inscripcion INT NOT NULL,
    id_instructor INT NOT NULL,
    descripcion TEXT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_observacion_inscripcion FOREIGN KEY (id_inscripcion) 
        REFERENCES INSCRIPCION(id_inscripcion) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_observacion_instructor FOREIGN KEY (id_instructor) 
        REFERENCES INSTRUCTOR(id_instructor) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_observacion_inscripcion (id_inscripcion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- DATOS INICIALES DE PRUEBA (SEED DATA PARA SUSTENTACIÓN ADSO)
-- Contraseñas de prueba encriptadas con bcrypt para 'Admin123*' y 'User123*'
-- Hash bcrypt aproximado de prueba: $2a$10$w8T0G6z99bO1mR31hV7.euoR5Z19y709s4t2hYt02sI1bXvQ6n4jC
-- ==============================================================================

-- Usuarios de prueba
INSERT INTO USUARIO (id_usuario, nombre, apellido, correo, password_hash, rol, estado) VALUES
(1, 'Administrador', 'General', 'admin@edunova.edu.co', '$2a$10$w8T0G6z99bO1mR31hV7.euoR5Z19y709s4t2hYt02sI1bXvQ6n4jC', 'ADMIN', 'ACTIVO'),
(2, 'Carlos', 'Mendoza', 'carlos.mendoza@edunova.edu.co', '$2a$10$w8T0G6z99bO1mR31hV7.euoR5Z19y709s4t2hYt02sI1bXvQ6n4jC', 'INSTRUCTOR', 'ACTIVO'),
(3, 'Laura', 'Gómez', 'laura.gomez@edunova.edu.co', '$2a$10$w8T0G6z99bO1mR31hV7.euoR5Z19y709s4t2hYt02sI1bXvQ6n4jC', 'INSTRUCTOR', 'ACTIVO'),
(4, 'Anyely', 'Valeria', 'anyely.valeria@edunova.edu.co', '$2a$10$w8T0G6z99bO1mR31hV7.euoR5Z19y709s4t2hYt02sI1bXvQ6n4jC', 'APRENDIZ', 'ACTIVO'),
(5, 'David', 'Santiago', 'david.santiago@edunova.edu.co', '$2a$10$w8T0G6z99bO1mR31hV7.euoR5Z19y709s4t2hYt02sI1bXvQ6n4jC', 'APRENDIZ', 'ACTIVO'),
(6, 'Valentina', 'Rojas', 'valentina.rojas@edunova.edu.co', '$2a$10$w8T0G6z99bO1mR31hV7.euoR5Z19y709s4t2hYt02sI1bXvQ6n4jC', 'APRENDIZ', 'ACTIVO');

-- Perfiles de Instructores
INSERT INTO INSTRUCTOR (id_instructor, id_usuario, especialidad, telefono) VALUES
(1, 2, 'Ingeniería de Software & Arquitectura Web', '3104567890'),
(2, 3, 'Bases de Datos & Inteligencia Artificial', '3157891234');

-- Perfiles de Aprendices
INSERT INTO APRENDIZ (id_aprendiz, id_usuario, documento, telefono) VALUES
(1, 4, '1075689123', '3209876543'),
(2, 5, '1075890456', '3187654321'),
(3, 6, '1082456789', '3112345678');

-- Programas de formación
INSERT INTO PROGRAMA (id_programa, nombre, codigo, descripcion, estado) VALUES
(1, 'Análisis y Desarrollo de Software', 'ADSO-2026', 'Tecnólogo enfocado en metodologías ágiles, frontend, backend y arquitectura de software.', 'ACTIVO'),
(2, 'Gestión de Redes y Seguridad Informática', 'REDES-2026', 'Diseño, configuración y aseguramiento de infraestructura de redes.', 'ACTIVO');

-- Cursos
INSERT INTO CURSO (id_curso, id_programa, nombre, descripcion, fecha_inicio, fecha_fin, estado) VALUES
(1, 1, 'Desarrollo Web Frontend Moderno (React & Tailwind)', 'Construcción de interfaces de usuario reactivas, diseño responsive y consumo de APIs.', '2026-03-01', '2026-04-15', 'ACTIVO'),
(2, 1, 'Arquitectura Backend y APIs RESTful (Node & Express)', 'Diseño de microservicios, seguridad JWT, ORMs y bases de datos relacionales.', '2026-03-15', '2026-04-30', 'ACTIVO');

-- Asignación de Instructores a Cursos
INSERT INTO CURSO_INSTRUCTOR (id_curso, id_instructor) VALUES
(1, 1),
(2, 2);

-- Inscripciones
INSERT INTO INSCRIPCION (id_inscripcion, id_aprendiz, id_curso, estado) VALUES
(1, 1, 1, 'ACTIVO'),
(2, 2, 1, 'ACTIVO'),
(3, 3, 1, 'ACTIVO'),
(4, 1, 2, 'ACTIVO');

-- Evidencias de Aprendizaje
INSERT INTO EVIDENCIA (id_evidencia, id_curso, nombre, descripcion, porcentaje, fecha_limite) VALUES
(1, 1, 'Evidencia 1: Prototipo UI y Sistema de Diseño en Figma', 'Diseño interactivo del dashboard institucional.', 30.00, '2026-03-10'),
(2, 1, 'Evidencia 2: Maquetación con React y Tailwind CSS', 'Implementación de componentes visuales y paleta de colores.', 35.00, '2026-03-25'),
(3, 1, 'Evidencia 3: Integración de Consumo REST con Axios', 'Consumo dinámico de servicios del backend y manejo de estados.', 35.00, '2026-04-10');

-- Calificaciones
INSERT INTO CALIFICACION (id_inscripcion, id_evidencia, nota, observacion) VALUES
(1, 1, 4.80, 'Excelente trabajo en la elección de la paleta y usabilidad.'),
(2, 1, 4.20, 'Buen diseño, detalles menores en contraste de accesibilidad.'),
(3, 1, 3.50, 'Entrega a tiempo; requiere mayor detalle en las vistas mobile.');

-- Asistencias de Ejemplo
INSERT INTO ASISTENCIA (id_inscripcion, fecha, estado, observacion) VALUES
(1, '2026-03-02', 'PRESENTE', 'Participación activa en clase.'),
(2, '2026-03-02', 'PRESENTE', NULL),
(3, '2026-03-02', 'TARDANZA', 'Llegada con 15 minutos de retraso justificado.'),
(1, '2026-03-04', 'PRESENTE', NULL),
(2, '2026-03-04', 'AUSENTE', 'Inasistencia sin soporte médico aún.'),
(3, '2026-03-04', 'PRESENTE', NULL);

-- Observaciones Formativas
INSERT INTO OBSERVACION (id_inscripcion, id_instructor, descripcion) VALUES
(1, 1, 'Anyely demuestra liderazgo técnico y excelente dominio de diseño frontend.'),
(3, 1, 'Se sugiere reforzar los conceptos de Flexbox y Grid para el próximo taller.');

