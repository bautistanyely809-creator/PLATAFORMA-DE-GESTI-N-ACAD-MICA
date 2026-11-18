# 05. ALCANCE Y LÍMITES DEL SISTEMA

## 5.1 Delimitación Espacial y Contextual
El sistema EDUNOVA está concebido para operar en entornos educativos del Servicio Nacional de Aprendizaje (SENA) a nivel regional (Regional Huila, Centro de Formación Industrial) y es extensible a instituciones de educación técnica y superior que operen bajo el enfoque de formación basada en competencias.

---

## 5.2 Funcionalidades Implementadas (Rama DEV - 100% Operativas)

Las siguientes funcionalidades se encuentran plenamente codificadas, conectadas a la base de datos MySQL 8 y verificadas en la rama `DEV`:

| Módulo / Componente | Funcionalidad Específica | Estado en Código |
| :--- | :--- | :--- |
| **Seguridad y Perfiles** | Login con JWT, logout seguro, edición de perfil y control de rutas RBAC | Implementado |
| **Administración Base** | Gestión CRUD de Usuarios, Programas de Formación y Fichas/Cursos | Implementado |
| **Inscripciones** | Matrícula de aprendices en cursos y asignación de instructores | Implementado |
| **M1: Competencias** | Catálogo de competencias y RAPs, avance porcentual, historial inmutable | Implementado |
| **M2: Evidencias** | Creación de evidencias, entregas versionadas (`v1, v2...`), calificación y feedback | Implementado |
| **M3: Recuperaciones**| Identificación de refuerzos, asignación de planes, entrega y auto-acreditación | Implementado |
| **M4: Asistencia** | Sesiones de clase, planilla en vivo, cálculo < 85%, justificaciones con soporte | Implementado |
| **M5: Reportes** | Expediente individual PDF, Dossier grupal PDF, exportación Excel CSV UTF-8 | Implementado |
| **M6: Notificaciones** | Disparador de eventos, bandeja filtrable por categoría, marcado de leídas | Implementado |
| **M7: EDUNOVA AI** | Consultas contextuales conectadas a MySQL 8 y streaming reactivo token a token | Implementado |
| **Frontend 3D** | Hero Banner animado e interactivo con WebGL / Three.js | Implementado |

---

## 5.3 Funcionalidades Pendientes y Propuestas Futuras
Para mantener absoluta transparencia con respecto al estado real del desarrollo, las siguientes características no están en el código y se catalogan como **Propuestas / Pendientes**:

| Característica Propuesta | Justificación del Estado Pendiente | Clasificación |
| :--- | :--- | :--- |
| **Integración con SOFIA Plus / Zajuna** | Requiere APIs oficiales gubernamentales o web scraping con credenciales institucionales no provistas. | Propuesta Externa |
| **Firma Digital Biométrica** | Depende de hardware capturador de huellas o certificados digitales de entidades de certificación cerrada. | Propuesta Futura |
| **Aplicación Móvil Nativa (Android/iOS)** | El diseño actual es una SPA Web Responsive altamente adaptable; la app compilada en Flutter queda como fase posterior. | Pendiente Fase 2 |
| **Recuperación de Contraseña por Correo SMTP**| Actualmente se simula vía consola/mock en desarrollo; el envío real requiere configurar pasarela SMTP corporativa (SendGrid/AWS SES). | Pendiente Configuración |

---

## 5.4 Criterios de Aceptación Globales
1. Toda transacción de modificación de estado pedagógico queda registrada en auditoría.
2. Los aprendices solo tienen acceso de lectura a sus propios datos e historial.
3. El cálculo de porcentajes de inasistencia es consistente y automático sin intervención manual del usuario.
4. Las contraseñas de los usuarios nunca se transmiten en texto plano ni se guardan sin hash Bcrypt.


### 5.2.8 Módulo 8: Calendario Académico Centralizado
- Matriz interactiva mensual, semanal y de agenda.
- Agendamiento de clases, evaluaciones, entregas de aula y comités.
- Cancelación con motivo justificado y notificación a fichas.

### 5.2.9 Módulo 9: Perfil Académico 360° del Aprendiz
- Expediente digital formativo integral sin duplicidad de fuentes de datos.
- Cálculo de 6 indicadores en tiempo real (% avance competencias, % asistencia, evidencias aprobadas, recuperaciones, alertas y solicitudes).
- 7 Pestañas de detalle académico y registro de tutorías/acompañamiento.

### 5.2.10 Módulo 10: Sistema de Alertas Tempranas
- Motor automático de reglas preventivas para detección de inasistencias (> 2 ausencias) y evidencias vencidas.
- Clasificación por 5 niveles de criticidad e historial inmutable de trazabilidad.
- Gestión de estado con obligatoriedad de justificación de cierre.

### 5.2.11 Módulo 11: Aula Virtual LMS Integrada
- Creación de unidades didácticas ordenadas por curso.
- Publicación de recursos educativos (PDF, documentos, enlaces).
- Asignación de actividades evaluables con proyección automática al Calendario Académico.
- Recepción de entregas y calificación docente de 0.0 a 5.0 con retroalimentación.

### 5.2.12 Módulo 12: Programación y Gestión de Ambientes
- Catálogo de laboratorios, talleres y auditorios con aforo y equipamiento.
- Detección estricta de conflictos de programación y reservas concurrentes (HTTP 409).
- Generación automática de eventos en el calendario institucional.

### 5.2.13 Módulo 13: Centro de Solicitudes Institucionales
- Radicación digital con consecutivo único anual oficial (`SOL-2026-XXXX`).
- Clasificación temática (Académica, Certificados, Asistencia, Soporte).
- Asignación de funcionarios responsables, emisión de respuestas oficiales e historial inmutable.
