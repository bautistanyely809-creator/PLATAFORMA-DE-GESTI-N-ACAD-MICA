# 03. JUSTIFICACIÓN Y VIGILANCIA TECNOLÓGICA

## 3.1 Justificación Institucional y Académica
La implementación de **EDUNOVA** es crucial para robustecer los procesos de aseguramiento de la calidad educativa en la formación profesional integral. Al automatizar la captura de evidencias, el cómputo de asistencias y la evaluación por competencias, el sistema democratiza el acceso a la información para los aprendices, quienes disponen de visibilidad inmediata de su progreso, garantizando el principio de debido proceso y transparencia evaluativa.

Asimismo, alinea las directrices pedagógicas del modelo SENA (basado en Resultados de Aprendizaje - RAPs y Juicios Evaluativos) con una herramienta moderna que minimiza el error humano en la generación de comités y actas de seguimiento.

---

## 3.2 Justificación Técnica
Desde la perspectiva de la ingeniería de software, EDUNOVA implementa un stack tecnológico contemporáneo y de alto rendimiento:

1. **Arquitectura Desacoplada y Modular:** Frontend reactivo construido en **React 18** y **Vite**, separado de una API RESTful en **Node.js (v24)** y **Express**, permitiendo escalabilidad horizontal y mantenimiento independiente.
2. **Modelo Relacional Transaccional:** Base de datos **MySQL 8** modelada bajo la Tercera Forma Normal (3FN), garantizando integridad referencial, transacciones ACID mediante **Prisma ORM** y optimización con índices compuestos para consultas de alto tráfico.
3. **Seguridad y Control de Acceso (RBAC):** Cifrado robusto de contraseñas con **Bcrypt (10 salt rounds)** y autenticación sin estado mediante tokens **JWT (JSON Web Token)** con discriminación de roles (`ADMIN`, `INSTRUCTOR`, `APRENDIZ`).
4. **Innovación Visual y Telemetría:** Integración de un Hero Canvas 3D interactivo en **Three.js**, diseño con paleta tecnológica **Ocean Tech Premium / Factory System** con efecto Glassmorphism optimizado, y endpoints de inteligencia artificial con streaming reactivo de respuestas token a token.

---

## 3.3 Vigilancia Tecnológica y Comparativa de Mercado

| Criterio / Plataforma | Moodle LMS | Canvas LMS | Territorio / Zajuna (SENA) | EDUNOVA (Propuesta) |
| :--- | :--- | :--- | :--- | :--- |
| **Enfoque Pedagógico** | Modular genérico | Cursos universitarios | Formación técnica SENA | Competencias SENA + RAPs + Evidencias |
| **Curva de Aprendizaje** | Alta (Interfaz densa) | Media | Media-Alta | Baja (UX moderna, Glassmorphism) |
| **Control de Asistencia** | Plugin de terceros | Básico | Módulo externo | Automatizado (alertas 85% y faltas) |
| **Versionamiento de Entregas**| No nativo (sobreescritura)| Historial básico | Historial básico | Versionamiento automático (v1, v2...) |
| **Planes de Refuerzo** | Tarea manual adicional | Manual | Manual en acta externa | Integrado con auto-acreditación |
| **Asistente de IA Académica** | No nativo | Complemento de pago | No disponible | Asistente contextual con datos reales |
| **Consumo de Recursos** | Alto (PHP/Apache) | Muy Alto (Ruby/Cloud) | Alto | Muy Bajo (Node.js/React/MySQL 8) |
