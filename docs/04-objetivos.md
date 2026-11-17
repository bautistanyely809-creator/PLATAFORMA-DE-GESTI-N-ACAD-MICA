# 04. OBJETIVOS DEL SISTEMA

## 4.1 Objetivo General
Desarrollar, implementar y documentar la plataforma web **EDUNOVA – Academic Management System**, con el fin de centralizar, automatizar y auditar la administración académica de aprendices, instructores, programas de formación, competencias, evidencias, recuperaciones y control de asistencia en centros de formación técnica y tecnológica, incorporando herramientas de análisis de datos y asistencia pedagógica mediante Inteligencia Artificial.

---

## 4.2 Objetivos Específicos

1. **Diseñar e Implementar la Capa de Seguridad y Autenticación:**
   Establecer un esquema de control de acceso basado en roles (RBAC) para perfiles `ADMIN`, `INSTRUCTOR` y `APRENDIZ`, empleando tokens criptográficos JWT y hashing de contraseñas con Bcrypt.

2. **Desarrollar el Módulo de Seguimiento por Competencias (Módulo 1):**
   Gestionar la estructura de competencias laborales y Resultados de Aprendizaje (RAPs) por programa, permitiendo la asignación a fichas y aprendices con cálculo automático de avance porcentual y registro inmutable en el historial de seguimiento.

3. **Construir el Módulo de Gestión Completa de Evidencias (Módulo 2):**
   Implementar el ciclo de vida de evidencias de aprendizaje (publicación por instructor, radicación con versionamiento progresivo por aprendiz y calificación cuantitativa/cualitativa con retroalimentación).

4. **Implementar el Sistema de Recuperación de Competencias (Módulo 3):**
   Facilitar la identificación de aprendices con competencias en estado "Requiere Refuerzo", asignando planes de mejoramiento con entrega digital y habilitando la auto-acreditación de la competencia al aprobar la actividad de refuerzo.

5. **Automatizar el Control de Asistencia y Novedades (Módulo 4):**
   Registrar la asistencia por sesiones de clase, calculando de forma acumulativa el porcentaje por aprendiz, emitiendo alertas por ausencias consecutivas ($ge 3$) y alertando el umbral crítico de inasistencia ($< 85\%$), con radicación digital de justificaciones médicas.

6. **Generar Reportes Académicos Oficiales y Dossiers (Módulo 5):**
   Proveer la generación dinámica de expedientes individuales de aprendices y dossiers consolidados de fichas en formatos imprimibles PDF y hojas de cálculo Excel (.csv UTF-8 con delimitación estándar).

7. **Crear el Centro de Notificaciones en Tiempo Real (Módulo 6):**
   Diseñar un bus de eventos y notificaciones internas categorizadas (Evidencias, Calificaciones, Asistencia, Recuperaciones, Alertas) con opciones de lectura individual y masiva.

8. **Integrar el Asistente Contextual EDUNOVA AI (Módulo 7):**
   Conectar un agente inteligente que consume la telemetría y datos reales de la base de datos MySQL 8 para emitir recomendaciones académicas personalizadas mediante streaming de texto en tiempo real.

9. **Garantizar la Calidad, Rendimiento y Usabilidad:**
   Asegurar tiempos de respuesta inferiores a 500 ms mediante indexación en MySQL 8, diseño responsivo adaptativo bajo el sistema de diseño Factory / Ocean Tech Premium y cobertura técnica documentada bajo IEEE 830.
