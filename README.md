# EDUNOVA · Academic Management System 🎓⚡
> **"Transformando la gestión académica en una experiencia inteligente, tecnológica y centralizada."**

[![Proyecto ADSO](https://img.shields.io/badge/SENA-ADSO_2026-39A900?style=for-the-badge&logo=sena&logoColor=white)](#)
[![Estándar IEEE 830](https://img.shields.io/badge/Documentación-SRS_IEEE_830-19B5A5?style=for-the-badge)](#)
[![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](#)
[![Node.js](https://img.shields.io/badge/Node.js_24-43853D?style=for-the-badge&logo=node.js&logoColor=white)](#)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](#)
[![MySQL 8](https://img.shields.io/badge/MySQL_8-005C84?style=for-the-badge&logo=mysql&logoColor=white)](#)
[![Prisma](https://img.shields.io/badge/Prisma_ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](#)

---

## 📑 Documentación Oficial del Proyecto (SRS en GitHub)

Toda la especificación técnica formal y viva de este proyecto se encuentra documentada en la carpeta [`/documentos`](documentos/):

👉 **[Acceder al Documento SRS de EDUNOVA (IEEE 830 / ISO/IEC/IEEE 29148)](documentos/SRS_EDUNOVA.md)**

> **⚡ Política de Trazabilidad Continua:** Cada modificación, nuevo componente, endpoint o actualización visual en el código fuente de EDUNOVA se refleja directamente en el documento **`SRS_EDUNOVA.md`**, garantizando que el repositorio conserve coherencia técnica entre los requisitos y la implementación.

---

## 📌 Información Institucional del Proyecto
- **Nombre Oficial:** EDUNOVA – Academic Management System
- **Aprendiz / Desarrolladora:** Anyely Valeria Bautista
- **Programa de Formación:** Tecnólogo en Análisis y Desarrollo de Software (ADSO) – Ficha 2874102
- **Centro de Formación:** Centro de Formación Industrial – SENA Regional Huila
- **Ubicación:** Neiva, Huila, Colombia
- **Versión del Sistema:** v1.2 (Ocean Tech Premium)
- **Duración Estimada:** 4 Semanas (1 Mes · Metodología Ágil Scrum)
- **Modalidad:** Desarrollo individual asistido por Inteligencia Artificial

---

## 💡 Propósito y Visión
**EDUNOVA** es una plataforma web integral diseñada para sustituir el manejo manual y fragmentado de la información académica (hojas de cálculo, libretas y documentos dispersos). Centraliza el registro de aprendices, instructores, programas de formación, cursos, calificaciones y asistencia en tiempo real, integrando un **módulo asistente con inteligencia artificial (EDUNOVA AI)** para ofrecer recomendaciones preventivas y formativas adaptadas al ritmo de cada aprendiz.

---

## 🎨 Identidad Visual Oficial: Ocean Tech Premium

La interfaz de EDUNOVA utiliza un diseño moderno de **Glassmorphism**, tarjetas flotantes, iluminación ambiental sutil y una paleta cromática tecnológica:

| Color | Código HEX | Rol en la Interfaz | Aplicación Visual |
| :--- | :--- | :--- | :--- |
| **Azul Petróleo** | `#123B50` | Base institucional, inicio de gradientes y encabezados | `rgb(18, 59, 80)` |
| **Azul Profundo** | `#17365D` | Navegación, fondo del Sidebar y serie de datos | `rgb(23, 54, 93)` |
| **Azul Noche** | `#102A43` | Superficie de EDUNOVA AI y tarjetas de alto contraste | `rgb(16, 42, 67)` |
| **Turquesa** | `#19B5A5` | Acentos interactivos, estados activos y aprobaciones | `rgb(25, 181, 165)` |
| **Cian** | `#48BFE3` | Destellos tecnológicos, métricas y badges | `rgb(72, 191, 227)` |
| **Azul Hielo** | `#DCEEF5` | Orbes de luz ambiental y contenedores suaves | `rgb(220, 238, 245)` |
| **Verde Menta** | `#70D6B3` | Barras de progreso formativo y estado sobresaliente | `rgb(112, 214, 179)` |
| **Ámbar** | `#E9B949` | Control de asistencia, alertas y pendientes | `rgb(233, 185, 73)` |
| **Gris Azulado** | `#EDF2F7` | Bordes delicados de cristal y fondos auxiliares | `rgb(237, 242, 247)` |
| **Fondo Canvas** | `#F4F7FA` | Superficie limpia, profesional y luminosa | `rgb(244, 247, 250)` |
| **Texto Principal** | `#263746` | Tipografía principal de alta legibilidad | `rgb(38, 55, 70)` |
| **Texto Secundario** | `#718096` | Subtítulos, metadatos y fechas | `rgb(113, 128, 150)` |

---

## 🏗️ Arquitectura de Software (Tres Capas)

EDUNOVA implementa una arquitectura modular de tres capas que garantiza la separación estricta de responsabilidades:

```
[ FRONTEND - React 18 + Tailwind CSS + Recharts ]
                     ▲
                     │ (HTTP / REST API + JWT)
                     ▼
[ BACKEND - Node.js + Express.js + Prisma ORM ] ──► [ Módulo EDUNOVA AI ]
                     ▲
                     │ (TCP / MySQL Protocol)
                     ▼
[ BASE DE DATOS - MySQL 8.0 (13 Entidades Relacionales) ]
```

1. **Capa de Presentación (Frontend):** React 18, Vite, Tailwind CSS, Lucide Icons y Recharts (Donut Chart de rendimiento).
2. **Capa Lógica de Negocio (Backend):** Node.js, Express.js, JWT, Bcrypt y Prisma ORM.
3. **Capa de Datos:** MySQL 8 con 13 entidades normalizadas en 3FN e integridad referencial.

---

## 📊 Modelo Entidad-Relación (MER)

La base de datos cuenta con **13 entidades interconectadas**:

```mermaid
erDiagram
    ROL ||--o{ USUARIO : asigna
    USUARIO ||--o| APRENDIZ : perfil_aprendiz
    USUARIO ||--o| INSTRUCTOR : perfil_instructor
    PROGRAMA ||--o{ GRUPO : contiene
    PROGRAMA ||--o{ CURSO : ofrece
    GRUPO ||--o{ GRUPO_INSTRUCTOR : asigna_docente
    INSTRUCTOR ||--o{ GRUPO_INSTRUCTOR : imparte
    APRENDIZ ||--o{ MATRICULA : cursa
    GRUPO ||--o{ MATRICULA : inscribe
    GRUPO ||--o{ ACTIVIDAD : programa
    GRUPO ||--o{ SESION : agenda
    MATRICULA ||--o{ CALIFICACION : obtiene
    ACTIVIDAD ||--o{ CALIFICACION : califica
    MATRICULA ||--o{ ASISTENCIA : registra
    SESION ||--o{ ASISTENCIA : verifica
```

* Script SQL ejecutable en **MySQL Workbench**:  
  👉 [`docs/database/edunova_db.sql`](docs/database/edunova_db.sql)  
* Esquema para **Prisma ORM**:  
  👉 [`server/prisma/schema.prisma`](server/prisma/schema.prisma)

---

## 🌿 Estrategia de Ramas en Git

El proyecto sigue una estrategia basada en Git Flow simplificado:

- **`Main`**: Rama de producción y versiones estables para sustentación.
- **`DEV`**: Rama principal de desarrollo donde se integran las nuevas características.
- **`QA`**: Rama de pruebas de integración, validación de historias de usuario y control de calidad.

---

## 📁 Estructura del Repositorio

```text
PLATAFORMA-DE-GESTI-N-ACAD-MICA/
├── client/                      # Frontend (React 18 + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/          # Sidebar, Header, ApprenticeDashboard, Auth, etc.
│   │   ├── App.jsx              # Enrutador y control de sesión
│   │   ├── main.jsx             # Punto de entrada de React
│   │   └── index.css            # Tokens Ocean Tech y estilos Glassmorphism
│   ├── index.html               # Plantilla HTML con fuente Plus Jakarta Sans
│   ├── tailwind.config.js       # Tokens de color y sombras Ocean Tech
│   └── vite.config.js           # Configuración de Vite & Hot Module Reload (HMR)
├── server/                      # Backend (Node.js + Express + Prisma)
│   ├── prisma/
│   │   └── schema.prisma        # Modelo de datos Prisma para MySQL
│   ├── src/
│   │   ├── controllers/         # Controladores de lógica de negocio
│   │   ├── middlewares/         # Validación JWT y control de roles (RBAC)
│   │   ├── routes/              # Endpoints REST (/api/auth, /api/usuarios, etc.)
│   │   └── index.js             # Servidor Express principal
│   ├── .env.example             # Plantilla de variables de entorno
│   └── package.json             # Dependencias del backend
├── documentos/                  # Documentación Técnica Formal Viva
│   └── SRS_EDUNOVA.md           # Especificación de Requisitos de Software (IEEE 830)
├── docs/                        # Recursos de Base de Datos y Diagramas
│   └── database/
│       └── edunova_db.sql       # Script DDL y DML (Seeders) para MySQL 8
├── .gitignore                   # Exclusión de node_modules, .env, dist
└── README.md                    # Identidad y manual general del proyecto
```

---

## 🚀 Guía de Instalación y Ejecución Local

### 1. Clonar el repositorio y ubicarse en la rama de desarrollo
```bash
git clone https://github.com/bautistanyely809-creator/PLATAFORMA-DE-GESTI-N-ACAD-MICA.git
cd PLATAFORMA-DE-GESTI-N-ACAD-MICA
git checkout DEV
```

### 2. Configurar la Base de Datos (MySQL)
1. Abrir **MySQL Workbench**.
2. Cargar y ejecutar el script [`docs/database/edunova_db.sql`](docs/database/edunova_db.sql).
3. Esto creará la base de datos `edunova_db` con sus 13 tablas e insertará los registros de prueba para la sustentación.

### 3. Configurar y Ejecutar el Backend
```bash
cd server
npm install
cp .env.example .env
# Ajustar DATABASE_URL en .env con tus credenciales locales de MySQL
npm run dev
```
*El servidor iniciará en `http://localhost:4000`.*

### 4. Configurar y Ejecutar el Frontend
```bash
cd ../client
npm install
npm run dev
```
*La interfaz estará disponible en `http://localhost:3000`.*

---

## 🗓️ Cronograma de Desarrollo (4 Semanas – Scrum)

| Semana | Enfoque | Entregables Principales |
| :---: | :--- | :--- |
| **Semana 1** | **Análisis, Requisitos y MER** | SRS IEEE 830, historias de usuario HU01-HU16, script SQL de 13 tablas, arquitectura en capas. |
| **Semana 2** | **Backend Core & Base de Datos** | API REST en Express, Prisma ORM, autenticación JWT, RBAC, CRUD de aprendices e instructores. |
| **Semana 3** | **Frontend & Experiencia de Usuario** | Interfaces React Ocean Tech, autenticación por 3 roles, Hero Banner, Donut Chart y tutor EDUNOVA AI. |
| **Semana 4** | **QA, Pruebas y Sustentación** | Casos de prueba CP01-CP12, validaciones de seguridad, sincronización del SRS y sustentación final. |

---

## 👩‍💻 Créditos y Autora
- **Anyely Valeria Bautista** – Desarrolladora Líder Full Stack
- **Programa:** Análisis y Desarrollo de Software (ADSO) · Ficha 2874102
- **Centro:** Centro de Formación Industrial – SENA Regional Huila (Neiva)
