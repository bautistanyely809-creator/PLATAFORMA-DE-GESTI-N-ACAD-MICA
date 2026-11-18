# 12. MODELO ENTIDAD-RELACIÓN (MER)

## 12.1 Descripción General
La base de datos de EDUNOVA (`edunova_db`) está modelada en **Tercera Forma Normal (3FN)** sobre el motor transaccional **InnoDB** de **MySQL 8**. El esquema se compone de **22 tablas relacionales** rigurosamente acopladas mediante claves foráneas con reglas de integridad referencial (`ON DELETE CASCADE` y `ON DELETE SET NULL`).

---

## 12.2 Diagrama Entidad-Relación Completo (Mermaid)

```mermaid
erDiagram
    USUARIO ||--o| APRENDIZ : "es"
    USUARIO ||--o| INSTRUCTOR : "es"
    USUARIO ||--o{ NOTIFICACION : "recibe"
    USUARIO ||--o{ HISTORIAL_AUDITORIA : "origina"

    PROGRAMA ||--o{ CURSO : "contiene"
    PROGRAMA ||--o{ COMPETENCIA : "estructura"

    CURSO ||--o{ CURSO_INSTRUCTOR : "asigna"
    INSTRUCTOR ||--o{ CURSO_INSTRUCTOR : "orienta"

    CURSO ||--o{ INSCRIPCION : "matricula"
    APRENDIZ ||--o{ INSCRIPCION : "cursa"

    CURSO ||--o{ EVIDENCIA : "publica"
    CURSO ||--o{ SESION_CLASE : "programa"

    COMPETENCIA ||--o{ RESULTADO_APRENDIZAJE : "desglosa"
    COMPETENCIA ||--o{ SEGUIMIENTO_COMPETENCIA : "evalua"

    INSCRIPCION ||--o{ SEGUIMIENTO_COMPETENCIA : "registra_avance"
    SEGUIMIENTO_COMPETENCIA ||--o{ HISTORIAL_SEGUIMIENTO : "audita"

    RESULTADO_APRENDIZAJE ||--o{ EVIDENCIA : "asocia"
    RESULTADO_APRENDIZAJE ||--o{ RECUPERACION : "mejora"

    INSCRIPCION ||--o{ ENTREGA_EVIDENCIA : "radica"
    EVIDENCIA ||--o{ ENTREGA_EVIDENCIA : "recibe"
    INSCRIPCION ||--o{ CALIFICACION : "obtiene"
    EVIDENCIA ||--o{ CALIFICACION : "evalua"

    INSCRIPCION ||--o{ RECUPERACION : "asigna_a"
    INSTRUCTOR ||--o{ RECUPERACION : "tutoriza"

    SESION_CLASE ||--o{ REGISTRO_ASISTENCIA : "detalla"
    INSCRIPCION ||--o{ REGISTRO_ASISTENCIA : "asiste"
    REGISTRO_ASISTENCIA ||--o{ JUSTIFICACION_ASISTENCIA : "soporta"

    INSCRIPCION ||--o{ ASISTENCIA : "resumen_diario"
    INSCRIPCION ||--o{ OBSERVACION : "observa"
    INSTRUCTOR ||--o{ OBSERVACION : "emite"

    USUARIO {
        int id_usuario PK
        string nombre
        string apellido
        string correo UK
        string password_hash
        enum rol
        enum estado
        datetime fecha_creacion
    }

    APRENDIZ {
        int id_aprendiz PK
        int id_usuario FK,UK
        string documento UK
        string telefono
        datetime fecha_registro
    }

    INSTRUCTOR {
        int id_instructor PK
        int id_usuario FK,UK
        string especialidad
        string telefono
    }

    PROGRAMA {
        int id_programa PK
        string nombre
        string codigo UK
        text descripcion
        enum estado
    }

    CURSO {
        int id_curso PK
        int id_programa FK
        string nombre
        date fecha_inicio
        date fecha_fin
        enum estado
    }

    INSCRIPCION {
        int id_inscripcion PK
        int id_aprendiz FK
        int id_curso FK
        datetime fecha_inscripcion
        enum estado
    }

    COMPETENCIA {
        int id_competencia PK
        int id_programa FK
        string codigo UK
        string nombre
        int horas_duracion
    }

    RESULTADO_APRENDIZAJE {
        int id_rap PK
        int id_competencia FK
        string codigo
        text descripcion
    }

    SEGUIMIENTO_COMPETENCIA {
        int id_seguimiento PK
        int id_inscripcion FK
        int id_competencia FK
        int id_instructor FK
        enum estado
        decimal porcentaje_avance
    }

    HISTORIAL_SEGUIMIENTO {
        int id_historial PK
        int id_seguimiento FK
        string estado_anterior
        string estado_nuevo
        string usuario_responsable
        datetime fecha
    }

    EVIDENCIA {
        int id_evidencia PK
        int id_curso FK
        int id_rap FK
        string nombre
        decimal porcentaje
        date fecha_limite
        enum estado
    }

    ENTREGA_EVIDENCIA {
        int id_entrega PK
        int id_evidencia FK
        int id_inscripcion FK
        int version
        string archivo_url
        enum estado
        decimal calificacion
    }

    RECUPERACION {
        int id_recuperacion PK
        int id_inscripcion FK
        int id_rap FK
        int id_instructor FK
        text actividad_refuerzo
        date fecha_limite
        enum estado
    }

    SESION_CLASE {
        int id_sesion PK
        int id_curso FK
        int id_instructor FK
        date fecha
        string tema
    }

    REGISTRO_ASISTENCIA {
        int id_registro PK
        int id_sesion FK
        int id_inscripcion FK
        enum estado
        text observacion
    }

    JUSTIFICACION_ASISTENCIA {
        int id_justificacion PK
        int id_registro FK
        text motivo
        string soporte_url
        string estado
    }
```


### 12.3 Extensiones del Modelo Relacional — Expansión Integral (13 Nuevas Entidades)
A continuación se especifican las 13 entidades incorporadas en MySQL 8 para soportar los 6 nuevos módulos:

```mermaid
erDiagram
    USUARIO ||--o{ EVENTO_CALENDARIO : crea
    USUARIO ||--o{ HISTORIAL_ALERTA : audita
    USUARIO ||--o{ SOLICITUD_INSTITUCIONAL : radica
    USUARIO ||--o{ SOLICITUD_INSTITUCIONAL : atiende
    USUARIO ||--o{ HISTORIAL_SOLICITUD : registra

    APRENDIZ ||--o{ ALERTA_TEMPRANA : recibe
    APRENDIZ ||--o{ ACCION_ACOMPANAMIENTO : participa

    INSTRUCTOR ||--o{ EVENTO_CALENDARIO : programa
    INSTRUCTOR ||--o{ ALERTA_TEMPRANA : atiende
    INSTRUCTOR ||--o{ AULA_VIRTUAL : lidera
    INSTRUCTOR ||--o{ RESERVA_AMBIENTE : agenda
    INSTRUCTOR ||--o{ ACCION_ACOMPANAMIENTO : imparte

    CURSO ||--o{ EVENTO_CALENDARIO : asigna
    CURSO ||--o{ ALERTA_TEMPRANA : asocia
    CURSO ||--o{ AULA_VIRTUAL : alberga
    CURSO ||--o{ RESERVA_AMBIENTE : convoca

    AULA_VIRTUAL ||--|{ UNIDAD_AULA : contiene
    UNIDAD_AULA ||--o{ MATERIAL_AULA : publica
    UNIDAD_AULA ||--o{ ACTIVIDAD_AULA : asigna
    ACTIVIDAD_AULA ||--o{ ENTREGA_ACTIVIDAD_AULA : recibe
    INSCRIPCION ||--o{ ENTREGA_ACTIVIDAD_AULA : efectua

    AMBIENTE ||--o{ RESERVA_AMBIENTE : hospeda
    AMBIENTE ||--o{ EVENTO_CALENDARIO : ubica

    ALERTA_TEMPRANA ||--|{ HISTORIAL_ALERTA : traza
    SOLICITUD_INSTITUCIONAL ||--|{ HISTORIAL_SOLICITUD : traza
```
