# 14. TECNOLOGÍAS Y STACK TÉCNICO

EDUNOVA integra un ecosistema tecnológico contemporáneo, optimizado para ofrecer tiempos de respuesta ultrarrápidos, alta interactividad visual y estabilidad transaccional.

---

## 14.1 Arquitectura del Stack Tecnológico

```mermaid
flowchart TD
    subgraph PRESENTACION["Capa de Presentación (Frontend)"]
        REACT["React 18.3 (Componentes Funcionales + Hooks)"]
        VITE["Vite 5 (Bundler ultrarrápido con HMR)"]
        TAILWIND["Tailwind CSS (Factory System / Glassmorphism)"]
        THREE["Three.js / WebGL (Canvas 3D Interactivo en Hero)"]
        LUCIDE["Lucide React (Iconografía técnica vectorizada)"]
        AXIOS["Axios (Cliente HTTP con interceptores JWT)"]
    end

    subgraph LOGICA["Capa de Negocio (Backend)"]
        NODE["Node.js v24.x LTS (Motor de ejecución V8)"]
        EXPRESS["Express.js (Framework REST API)"]
        PRISMA_CLI["Prisma Client ORM (Abstracción tipada de datos)"]
        JWT_LIB["jsonwebtoken (Autenticación sin estado)"]
        BCRYPT["bcryptjs (Hashing de contraseñas de 10 rondas)"]
        TELEMETRY["OpenTelemetry & In-Memory Metrics Engine"]
    end

    subgraph DATOS["Capa de Datos"]
        MYSQL["MySQL 8 Community Server (Motor InnoDB)"]
    end

    PRESENTACION <-->|"REST API / JSON / SSE Stream"| LOGICA
    LOGICA <-->|"MySQL Protocol / Pool de Conexiones"| DATOS
```

---

## 14.2 Detalle de Tecnologías y Versiones

### 1. Frontend
* **React (`v18.3.1`):** Biblioteca estándar para interfaces basadas en componentes reactivos y gestión de ciclo de vida con Hooks (`useState`, `useEffect`, `useMemo`, `useCallback`).
* **Vite (`v5.4.2`):** Entorno de compilación moderno que utiliza Rollup y esbuild para ofrecer recarga de módulos en milisegundos.
* **Three.js (`v0.160+`):** Motor de gráficos WebGL que renderiza el Hero 3D con geometría poligonal y cálculo de sombras en tiempo real.
* **Tailwind CSS (`v3.4.10`):** Framework de utilidades CSS configurado con el tema de diseño **Ocean Tech Premium** y tokens del **Factory Design System** (paleta oscura Obsidian/Carbon y bordes hairline).
* **Lucide React (`v0.441.0`):** Set estandarizado de más de 200 iconos SVG ligeros.

### 2. Backend
* **Node.js (`v24.16.0`):** Plataforma de ejecución asíncrona basada en eventos, con soporte nativo de características modernas de ECMAScript.
* **Express (`v4.19.2`):** Enrutador HTTP robusto que maneja middlewares de autenticación, control de errores y controladores de dominio.
* **Prisma ORM (`v5.19.1`):** Mapeador objeto-relacional de siguiente generación que provee autocompletado tipado en consultas, migraciones automáticas y previene inyecciones SQL.
* **JSON Web Token (`v9.0.2`):** Estándar RFC 7519 para tokens portátiles y seguros de autenticación con firma HMAC-SHA256.
* **Bcryptjs (`v2.4.3`):** Función de derivación de claves basada en el cifrado Blowfish para el almacenamiento irreversible de credenciales.
* **CORS (`v2.8.5`):** Middleware de seguridad para autorización de peticiones entre orígenes cruzados.

### 3. Base de Datos
* **MySQL 8.0:** Motor relacional con soporte nativo de tipos JSON, transacciones ACID bajo InnoDB, índices B-Tree de alta eficiencia y optimizador de consultas basado en costo.
