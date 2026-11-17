# 08. REQUISITOS NO FUNCIONALES (RNF)

## 8.1 Catálogo de Requisitos No Funcionales (RNF-001 a RNF-015)

| Código | Categoría | Nombre del Requisito | Métrica / Criterio de Medición |
| :--- | :--- | :--- | :--- |
| **RNF-001** | Rendimiento | Tiempo de Respuesta de la API | El 95% de las consultas debe responder en $< 500\text{ ms}$ en condiciones normales. |
| **RNF-002** | Rendimiento | Optimización de Base de Datos | Todas las claves foráneas y campos de búsqueda frecuente cuentan con índices compuestos B-Tree en MySQL 8. |
| **RNF-003** | Rendimiento | Optimización del Frontend | Implementación de debounce en inputs de búsqueda (300 ms), lazy loading y compresión Brotli/Gzip en servidor. |
| **RNF-004** | Rendimiento | Telemetría Token a Token | El asistente IA entrega flujo continuo de tokens por Server-Sent Events con primer byte $< 800\text{ ms}$. |
| **RNF-005** | Seguridad | Cifrado y Hashing de Credenciales | Contraseñas protegidas mediante algoritmo Bcrypt con factor de costo 10 (`salt rounds`). |
| **RNF-006** | Seguridad | Autenticación Stateless JWT | Sesiones administradas por JSON Web Tokens firmados criptográficamente mediante clave privada en variable de entorno. |
| **RNF-007** | Seguridad | Prevención de Inyecciones | Sanitización absoluta de consultas SQL mediante el cliente parametrizado de Prisma ORM. |
| **RNF-008** | Seguridad | Control de Acceso por Rol (RBAC) | Middlewares dedicados en backend verifican permisos por endpoint impidiendo escalamiento de privilegios. |
| **RNF-009** | Usabilidad | Sistema de Diseño Factory / Glassmorphism | Estética moderna de alto contraste, tipografía Geist, bordes hairline y paleta Ocean Tech Premium sin saturaciones. |
| **RNF-010** | Usabilidad | Diseño Web Adaptativo (Responsive) | Visualización fluida garantizada en pantallas de escritorio ($> 1280\text{px}$), tablets ($768\text{px}$) y móviles ($< 480\text{px}$). |
| **RNF-011** | Confiabilidad | Integridad Referencial | Restricciones de integridad `CASCADE` y `SET NULL` que previenen registros huérfanos ante eliminaciones. |
| **RNF-012** | Confiabilidad | Trazabilidad e Inmutabilidad | Los cambios de estado de competencias se respaldan en `HISTORIAL_SEGUIMIENTO` sin posibilidad de borrado directo. |
| **RNF-013** | Disponibilidad | Tolerancia a Fallos | Mecanismos de recuperación automática y control global de excepciones en el servidor Express. |
| **RNF-014** | Mantenibilidad | Arquitectura Modular Desacoplada | Código organizado en capas independientes (Rutas, Middlewares, Controladores, Servicios, Esquemas). |
| **RNF-015** | Portabilidad | Compatibilidad Multi-navegador | Funcionamiento verificado en Google Chrome ($ge 110$), Mozilla Firefox ($ge 115$), Microsoft Edge y Safari ($ge 16$). |
