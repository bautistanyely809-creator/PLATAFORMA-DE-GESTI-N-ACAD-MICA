import os
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import math

WIDTH = 1920
HEIGHT = 1080
FPS = 24

FONT_PATH_BOLD = r"C:\Windows\Fonts\segoeuib.ttf"
FONT_PATH_REG = r"C:\Windows\Fonts\segoeui.ttf"

def get_font(size, bold=False):
    path = FONT_PATH_BOLD if bold else FONT_PATH_REG
    try:
        return ImageFont.truetype(path, size)
    except:
        return ImageFont.load_default()

FONT_TITLE = get_font(52, True)
FONT_SUBTITLE = get_font(28, False)
FONT_HEADING = get_font(36, True)
FONT_BODY = get_font(24, False)
FONT_BADGE = get_font(18, True)
FONT_CODE = get_font(20, True)
FONT_BIG_KPI = get_font(44, True)

# Color Palette (Ocean Tech / Factory)
C_OBSIDIAN = (16, 16, 16)
C_PETROL = (18, 59, 80)
C_DEEP_BLUE = (23, 54, 93)
C_TURQUOISE = (25, 181, 165)
C_CYAN = (72, 191, 227)
C_ICE_BLUE = (220, 238, 245)
C_AMBER = (233, 185, 73)
C_MINT = (112, 214, 179)
C_CARD_BG = (24, 30, 38)
C_BORDER = (42, 60, 78)
C_WHITE = (255, 255, 255)
C_TEXT_MUTED = (140, 160, 175)

def draw_header(draw, active_profile="EDUNOVA ACADEMIC MANAGEMENT"):
    # Header Bar
    draw.rectangle([(0, 0), (WIDTH, 70)], fill=(12, 24, 36))
    draw.line([(0, 70), (WIDTH, 70)], fill=C_TURQUOISE, width=2)
    
    # Logo text
    draw.text((60, 18), "EDUNOVA", font=get_font(26, True), fill=C_CYAN)
    draw.text((195, 22), "· Sistema Inteligente de Gestión Académica", font=get_font(19, False), fill=C_TEXT_MUTED)
    
    # Active Profile Badge
    draw.rounded_rectangle([(WIDTH - 420, 16), (WIDTH - 60, 54)], radius=4, fill=(23, 54, 93), outline=C_TURQUOISE, width=1)
    draw.text((WIDTH - 400, 24), f"MODO: {active_profile}", font=FONT_BADGE, fill=C_CYAN)

def draw_footer_progress(draw, current_frame, total_frames, scene_name=""):
    progress = current_frame / total_frames
    bar_width = int(WIDTH * progress)
    # Background footer
    draw.rectangle([(0, HEIGHT - 50), (WIDTH, HEIGHT)], fill=(10, 14, 20))
    draw.line([(0, HEIGHT - 50), (WIDTH, HEIGHT - 50)], fill=C_BORDER, width=1)
    # Progress line
    draw.rectangle([(0, HEIGHT - 6), (bar_width, HEIGHT)], fill=C_TURQUOISE)
    # Status text
    draw.text((60, HEIGHT - 38), f"ESCENA ACTUAL: {scene_name}", font=get_font(16, True), fill=C_CYAN)
    seconds_curr = current_frame // FPS
    seconds_tot = total_frames // FPS
    time_str = f"{seconds_curr//60:02d}:{seconds_curr%60:02d} / {seconds_tot//60:02d}:{seconds_tot%60:02d} · 1080p 60fps Ready"
    draw.text((WIDTH - 380, HEIGHT - 38), time_str, font=get_font(16, False), fill=C_TEXT_MUTED)

def draw_card(draw, box, title="", subtitle="", badge="", badge_color=C_TURQUOISE):
    draw.rounded_rectangle(box, radius=8, fill=C_CARD_BG, outline=C_BORDER, width=1)
    (x1, y1), (x2, y2) = box
    if title:
        draw.text((x1 + 25, y1 + 20), title, font=FONT_HEADING, fill=C_WHITE)
    if subtitle:
        draw.text((x1 + 25, y1 + 65), subtitle, font=FONT_SUBTITLE, fill=C_TEXT_MUTED)
    if badge:
        tw = draw.textlength(badge, font=FONT_BADGE)
        bx1 = x2 - tw - 40
        draw.rounded_rectangle([(bx1, y1 + 20), (x2 - 20, y1 + 50)], radius=4, fill=(18, 59, 80), outline=badge_color, width=1)
        draw.text((bx1 + 10, y1 + 26), badge, font=FONT_BADGE, fill=badge_color)

def render_scene_1(frame_idx, n_frames):
    img = Image.new("RGB", (WIDTH, HEIGHT), C_OBSIDIAN)
    draw = ImageDraw.Draw(img)
    
    # Animated cyber grid and glowing sphere
    t = frame_idx / n_frames
    cx, cy = WIDTH // 2, 420
    
    # Concentric pulsing rings
    for r in [280, 220, 160, 100]:
        pulse = int(15 * math.sin(t * math.pi * 4 + r))
        draw.ellipse([(cx - r - pulse, cy - r - pulse), (cx + r + pulse, cy + r + pulse)], outline=(20, int(50 + 20 * math.sin(t*5)), int(75 + 25*math.sin(t*5))), width=2)
    
    # 3D Wireframe Core simulation
    nodes = 12
    points = []
    angle_offset = t * math.pi * 2
    for i in range(nodes):
        ang = angle_offset + i * (2 * math.pi / nodes)
        rad = 120 + 20 * math.sin(t * 8 + i)
        px = cx + int(rad * math.cos(ang))
        py = cy + int((rad * 0.6) * math.sin(ang))
        points.append((px, py))
    
    for i in range(nodes):
        p1 = points[i]
        p2 = points[(i + 1) % nodes]
        draw.line([p1, p2], fill=C_CYAN, width=2)
        draw.line([p1, (cx, cy)], fill=C_TURQUOISE, width=1)
        draw.ellipse([(p1[0]-5, p1[1]-5), (p1[0]+5, p1[1]+5)], fill=C_WHITE)
    
    draw.ellipse([(cx-12, cy-12), (cx+12, cy+12)], fill=C_TURQUOISE)
    
    # Main Titles
    title = "EDUNOVA"
    tw = draw.textlength(title, font=get_font(72, True))
    draw.text(((WIDTH - tw)//2, 630), title, font=get_font(72, True), fill=C_CYAN)
    
    sub1 = "Academic Management System · EdTech SENA ADSO 2026"
    tw1 = draw.textlength(sub1, font=FONT_HEADING)
    draw.text(((WIDTH - tw1)//2, 730), sub1, font=FONT_HEADING, fill=C_WHITE)
    
    sub2 = "Transformando la formación por competencias en una experiencia visual, centralizada e inteligente."
    tw2 = draw.textlength(sub2, font=FONT_SUBTITLE)
    draw.text(((WIDTH - tw2)//2, 790), sub2, font=FONT_SUBTITLE, fill=C_TEXT_MUTED)
    
    # Badges
    badges = ["React 18 + Vite", "Three.js 3D WebGL", "Node.js 24 + Express", "MySQL 8 (22 Tablas)", "Prisma ORM", "EDUNOVA AI"]
    total_w = sum([draw.textlength(b, font=FONT_BADGE) + 36 for b in badges])
    start_x = (WIDTH - total_w) // 2
    cur_x = start_x
    for b in badges:
        bw = draw.textlength(b, font=FONT_BADGE) + 30
        draw.rounded_rectangle([(cur_x, 860), (cur_x + bw, 898)], radius=4, fill=(18, 45, 65), outline=C_TURQUOISE, width=1)
        draw.text((cur_x + 15, 870), b, font=FONT_BADGE, fill=C_CYAN)
        cur_x += bw + 10
        
    draw_footer_progress(draw, frame_idx, n_frames, "INTRODUCCIÓN & IDENTIDAD VISUAL")
    return img

def render_scene_2(frame_idx, n_frames):
    img = Image.new("RGB", (WIDTH, HEIGHT), C_OBSIDIAN)
    draw = ImageDraw.Draw(img)
    draw_header(draw, "ARQUITECTURA DE TRES CAPAS")
    
    # Left Card: Presentation Layer
    draw_card(draw, [(80, 110), (620, 960)], "1. Capa de Presentación", "Frontend SPA React 18 & WebGL", "Vite 5.4", C_CYAN)
    draw.text((110, 200), "• React 18.3 con Functional Hooks", font=FONT_BODY, fill=C_WHITE)
    draw.text((110, 245), "• Núcleo 3D en Three.js con WebGL", font=FONT_BODY, fill=C_TURQUOISE)
    draw.text((110, 290), "• Factory Design System & Glassmorphism", font=FONT_BODY, fill=C_WHITE)
    draw.text((110, 335), "• Streaming en tiempo real de IA", font=FONT_BODY, fill=C_WHITE)
    draw.text((110, 380), "• Debounce en búsquedas (300 ms)", font=FONT_BODY, fill=C_WHITE)
    draw.text((110, 425), "• Paginación y skeletons de carga", font=FONT_BODY, fill=C_WHITE)
    
    # Middle Card: Business Logic
    draw_card(draw, [(680, 110), (1220, 960)], "2. Lógica de Negocio", "Backend REST API Node.js v24", "Express.js", C_MINT)
    draw.text((710, 200), "• Node.js v24.16 LTS con Express", font=FONT_BODY, fill=C_WHITE)
    draw.text((710, 245), "• Prisma ORM Client Tipado Seguro", font=FONT_BODY, fill=C_MINT)
    draw.text((710, 290), "• Autenticación Stateless JWT (HS256)", font=FONT_BODY, fill=C_WHITE)
    draw.text((710, 335), "• Hashing Bcrypt (10 salt rounds)", font=FONT_BODY, fill=C_WHITE)
    draw.text((710, 380), "• Middlewares RBAC de autorización", font=FONT_BODY, fill=C_WHITE)
    draw.text((710, 425), "• Bus de Notificaciones & Auditoría", font=FONT_BODY, fill=C_WHITE)
    
    # Right Card: Persistence
    draw_card(draw, [(1280, 110), (1840, 960)], "3. Capa de Datos", "Motor Relacional Transaccional", "MySQL 8.0", C_AMBER)
    draw.text((1310, 200), "• 22 Tablas Relacionales en 3FN", font=FONT_BODY, fill=C_WHITE)
    draw.text((1310, 245), "• Motor InnoDB con Transacciones ACID", font=FONT_BODY, fill=C_AMBER)
    draw.text((1310, 290), "• Índices compuestos para alto tráfico", font=FONT_BODY, fill=C_WHITE)
    draw.text((1310, 335), "• Integridad referencial CASCADE", font=FONT_BODY, fill=C_WHITE)
    draw.text((1310, 380), "• Historial inmutable de auditoría", font=FONT_BODY, fill=C_WHITE)
    draw.text((1310, 425), "• Pool de conexiones optimizado", font=FONT_BODY, fill=C_WHITE)
    
    # Arrows connecting cards
    draw.line([(620, 500), (680, 500)], fill=C_CYAN, width=4)
    draw.polygon([(675, 492), (690, 500), (675, 508)], fill=C_CYAN)
    draw.text((630, 460), "HTTP/JWT", font=FONT_BADGE, fill=C_CYAN)
    
    draw.line([(1220, 500), (1280, 500)], fill=C_MINT, width=4)
    draw.polygon([(1275, 492), (1290, 500), (1275, 508)], fill=C_MINT)
    draw.text((1230, 460), "TCP:3306", font=FONT_BADGE, fill=C_MINT)
    
    draw_footer_progress(draw, frame_idx, n_frames, "ARQUITECTURA DE SOFTWARE (3 CAPAS)")
    return img

def render_scene_3(frame_idx, n_frames):
    img = Image.new("RGB", (WIDTH, HEIGHT), C_OBSIDIAN)
    draw = ImageDraw.Draw(img)
    draw_header(draw, "PERFIL 1: APRENDIZ")
    
    # Hero Welcome Banner for Student
    draw.rounded_rectangle([(80, 100), (1840, 230)], radius=8, fill=(18, 59, 80), outline=C_CYAN, width=1)
    draw.text((115, 120), "¡Bienvenido, Aprendiz Carlos Mendoza!", font=FONT_HEADING, fill=C_WHITE)
    draw.text((115, 168), "Programa: Tecnólogo en Análisis y Desarrollo de Software · Ficha: 2874102 · SENA Regional Huila", font=FONT_SUBTITLE, fill=C_ICE_BLUE)
    
    # 4 Metric Cards
    metrics = [
        ("Competencias Aprobadas", "4 / 5", "80.0%", C_MINT),
        ("Asistencia Acumulada", "88.5%", "Óptimo", C_TURQUOISE),
        ("Evidencias Pendientes", "1 Actividad", "Vence en 2 días", C_AMBER),
        ("Tutor EDUNOVA AI", "En Línea", "Streaming Activo", C_CYAN),
    ]
    card_w = 415
    for i, (title, val, status, color) in enumerate(metrics):
        cx1 = 80 + i * (card_w + 26)
        cx2 = cx1 + card_w
        draw.rounded_rectangle([(cx1, 260), (cx2, 400)], radius=6, fill=C_CARD_BG, outline=C_BORDER, width=1)
        draw.text((cx1 + 20, 280), title, font=get_font(20, False), fill=C_TEXT_MUTED)
        draw.text((cx1 + 20, 315), val, font=FONT_BIG_KPI, fill=C_WHITE)
        draw.text((cx1 + 20, 365), f"● {status}", font=FONT_BADGE, fill=color)
        
    # Lower Section: Functional Modules Walkthrough
    # Box 1: Evidencias Versionadas
    draw_card(draw, [(80, 430), (930, 960)], "Gestión de Evidencias Versionadas", "Ciclo de entrega con incremento secuencial", "v1 → v2 → v3", C_CYAN)
    draw.text((110, 520), "Actividad: Taller 02 - Diagrama de Clases UML", font=get_font(22, True), fill=C_WHITE)
    draw.text((110, 560), "Estado: Entregado (Versión 2) · En revisión pedagógica", font=FONT_BODY, fill=C_MINT)
    draw.text((110, 605), "Archivo adjunto: diagramas_uml_v2_bautista.pdf", font=FONT_CODE, fill=C_ICE_BLUE)
    draw.text((110, 650), "• Soporte de corrección sin sobrescritura de entregas previas", font=FONT_BODY, fill=C_TEXT_MUTED)
    draw.text((110, 690), "• Historial completo con marcas de tiempo para trazabilidad", font=FONT_BODY, fill=C_TEXT_MUTED)
    
    # Box 2: EDUNOVA AI Assistant
    draw_card(draw, [(990, 430), (1840, 960)], "Consola Contextual EDUNOVA AI", "Asistente pedagógico conectado a MySQL 8", "Tokens SSE", C_TURQUOISE)
    draw.rounded_rectangle([(1020, 510), (1810, 930)], radius=6, fill=(10, 15, 20), outline=(25, 60, 80), width=1)
    draw.text((1045, 530), "> Usuario: ¿Cuál es mi diagnóstico de rendimiento?", font=FONT_BODY, fill=C_CYAN)
    draw.text((1045, 580), "EDUNOVA AI:", font=get_font(22, True), fill=C_MINT)
    draw.text((1045, 620), "Carlos, tu avance en la Ficha 2874102 es del 80.0%. Tienes 4 de 5", font=FONT_BODY, fill=C_WHITE)
    draw.text((1045, 660), "competencias aprobadas. Tu asistencia acumulada es del 88.5%,", font=FONT_BODY, fill=C_WHITE)
    draw.text((1045, 700), "por encima del umbral institucional del 85%. Te sugiero radicar", font=FONT_BODY, fill=C_WHITE)
    draw.text((1045, 740), "la evidencia de Base de Datos para asegurar la excelencia.", font=FONT_BODY, fill=C_WHITE)
    draw.text((1045, 800), "● Streaming activo token a token sin tiempos de espera", font=FONT_BADGE, fill=C_AMBER)
    
    draw_footer_progress(draw, frame_idx, n_frames, "PERFIL APRENDIZ · AUTONOMÍA Y SEGUIMIENTO")
    return img

def render_scene_4(frame_idx, n_frames):
    img = Image.new("RGB", (WIDTH, HEIGHT), C_OBSIDIAN)
    draw = ImageDraw.Draw(img)
    draw_header(draw, "PERFIL 2: INSTRUCTOR")
    
    # Top Card: Attendance Sheet in Live Action
    draw_card(draw, [(80, 100), (1840, 520)], "Planilla de Asistencia Automatizada en Vivo", "Control diario por sesión · Detección de alertas de inasistencia", "Ficha 2874102", C_TURQUOISE)
    
    # Table Header
    headers = ["Documento", "Nombre del Aprendiz", "Estado de Sesión", "Observación Pedagógica", "Acumulado"]
    cols_x = [110, 310, 750, 1200, 1620]
    draw.rectangle([(100, 180), (1820, 220)], fill=(18, 45, 65))
    for h, hx in zip(headers, cols_x):
        draw.text((hx, 190), h, font=get_font(18, True), fill=C_CYAN)
        
    students = [
        ("1075284102", "Carlos Mendoza", "PRESENTE", "Participación activa en taller", "92.0%"),
        ("1083920114", "Laura Sofia Castro", "RETARDO", "Ingreso 15 min tarde con aviso", "86.5%"),
        ("1075938120", "Andrés Felipe Ruiz", "AUSENTE (ALERTA)", "3 faltas consecutivas detectadas", "78.0% (Riesgo)"),
    ]
    
    for row_idx, s in enumerate(students):
        ry = 240 + row_idx * 75
        draw.line([(100, ry - 10), (1820, ry - 10)], fill=C_BORDER, width=1)
        draw.text((cols_x[0], ry), s[0], font=FONT_BODY, fill=C_WHITE)
        draw.text((cols_x[1], ry), s[1], font=FONT_BODY, fill=C_WHITE)
        # Status Badge
        badge_col = C_MINT if "PRESENTE" in s[2] else (C_AMBER if "RETARDO" in s[2] else (240, 90, 90))
        draw.rounded_rectangle([(cols_x[2], ry - 4), (cols_x[2] + 240, ry + 32)], radius=4, fill=(20, 30, 40), outline=badge_col, width=1)
        draw.text((cols_x[2] + 15, ry + 2), s[2], font=FONT_BADGE, fill=badge_col)
        draw.text((cols_x[3], ry), s[3], font=get_font(20, False), fill=C_TEXT_MUTED)
        draw.text((cols_x[4], ry), s[4], font=get_font(22, True), fill=badge_col)
        
    # Lower Split: Recoveries with Auto-Accreditation & PDF Dossiers
    draw_card(draw, [(80, 550), (930, 960)], "Recuperaciones con Auto-Acreditación", "Superación >= 3.5 acredita competencia", "Módulo 3", C_AMBER)
    draw.text((110, 640), "Aprendiz: Andrés Felipe Ruiz · RAP-02 Modelado", font=get_font(22, True), fill=C_WHITE)
    draw.text((110, 685), "Actividad: Plan de mejoramiento en diseño relacional", font=FONT_BODY, fill=C_TEXT_MUTED)
    draw.text((110, 730), "Nota dictaminada: 4.0 / 5.0  ➔  SUPERADA", font=get_font(24, True), fill=C_MINT)
    draw.text((110, 780), "✔ Competencia pasa automáticamente a APROBADA", font=FONT_BODY, fill=C_TURQUOISE)
    draw.text((110, 825), "✔ Registro inmutable en Historial de Seguimiento", font=FONT_BODY, fill=C_WHITE)
    
    draw_card(draw, [(990, 550), (1840, 960)], "Centro de Reportes, Dossiers y Excel", "Informes oficiales listos para comité", "Módulo 5", C_CYAN)
    draw.text((1020, 640), "• Expediente Académico Individual imprimible con membrete SENA", font=FONT_BODY, fill=C_WHITE)
    draw.text((1020, 690), "• Dossier Consolidado de Ficha para comités de evaluación", font=FONT_BODY, fill=C_WHITE)
    draw.text((1020, 740), "• Exportación nativa a Excel (CSV UTF-8 con delimitación estándar)", font=FONT_BODY, fill=C_MINT)
    draw.text((1020, 790), "• Estilos CSS Print optimizados para guardar en PDF limpio", font=FONT_BODY, fill=C_TURQUOISE)
    draw.text((1020, 840), "✔ Cero manipulación manual de notas en hojas de cálculo externas", font=FONT_BODY, fill=C_AMBER)
    
    draw_footer_progress(draw, frame_idx, n_frames, "PERFIL INSTRUCTOR · CALIFICACIÓN Y GESTIÓN")
    return img

def render_scene_5(frame_idx, n_frames):
    img = Image.new("RGB", (WIDTH, HEIGHT), C_OBSIDIAN)
    draw = ImageDraw.Draw(img)
    draw_header(draw, "PERFIL 3: DIRECTOR / COORDINADOR")
    
    # 4 Macro KPIs
    kpis = [
        ("Aprendices Matriculados", "248", "Activos en Centro", C_CYAN),
        ("Fichas de Formación", "12 Grupos", "Etapa Lectiva", C_TURQUOISE),
        ("Tasa de Aprobación Global", "91.4%", "+3.2% vs Trim. Anterior", C_MINT),
        ("Alertas de Inasistencia", "6 Casos", "Comité de Seguimiento", (240, 90, 90)),
    ]
    card_w = 415
    for i, (title, val, status, color) in enumerate(kpis):
        cx1 = 80 + i * (card_w + 26)
        cx2 = cx1 + card_w
        draw.rounded_rectangle([(cx1, 100), (cx2, 240)], radius=6, fill=C_CARD_BG, outline=C_BORDER, width=1)
        draw.text((cx1 + 20, 120), title, font=get_font(20, False), fill=C_TEXT_MUTED)
        draw.text((cx1 + 20, 155), val, font=FONT_BIG_KPI, fill=C_WHITE)
        draw.text((cx1 + 20, 205), f"● {status}", font=FONT_BADGE, fill=color)
        
    # Main Administrative Panels
    draw_card(draw, [(80, 270), (930, 960)], "Gestión Institucional de Oferta y Matrícula", "Programas, Fichas de Caracterización y Docentes", "Administración", C_CYAN)
    draw.text((110, 360), "1. Programas de Formación:", font=get_font(22, True), fill=C_WHITE)
    draw.text((130, 400), "Creación de diseños curriculares con normas de competencia y horas.", font=FONT_BODY, fill=C_TEXT_MUTED)
    draw.text((110, 460), "2. Fichas de Caracterización:", font=get_font(22, True), fill=C_WHITE)
    draw.text((130, 500), "Apertura de cohortes con fechas de inicio/fin lectiva y asignación docente.", font=FONT_BODY, fill=C_TEXT_MUTED)
    draw.text((110, 560), "3. Matrícula e Inscripciones Seguras:", font=get_font(22, True), fill=C_WHITE)
    draw.text((130, 600), "Vinculación directa de aprendices con restricción estricta de duplicidad.", font=FONT_BODY, fill=C_TEXT_MUTED)
    draw.text((110, 660), "4. Gestión de Usuarios y Roles (RBAC):", font=get_font(22, True), fill=C_WHITE)
    draw.text((130, 700), "Activación, suspensión de cuentas y asignación de privilegios.", font=FONT_BODY, fill=C_TEXT_MUTED)
    
    draw_card(draw, [(990, 270), (1840, 960)], "Pistas de Auditoría Forense y Seguridad", "Trazabilidad inmutable de operaciones críticas", "ISO 29148", C_MINT)
    # Mock audit table
    audits = [
        ("17/11 07:15", "INSTRUCTOR", "EVALUAR_COMPETENCIA", "Ficha 2874102 · Competencia 01 Aprobada", "192.168.1.45"),
        ("17/11 07:05", "ADMIN", "MATRICULAR_APRENDIZ", "Inscripción id_aprendiz=45 a Ficha 2874102", "192.168.1.10"),
        ("17/11 06:50", "INSTRUCTOR", "REGISTRAR_ASISTENCIA", "Sesión 14 Aperturada · 28 Aprendices", "192.168.1.45"),
        ("16/11 18:30", "APRENDIZ", "ENTREGAR_EVIDENCIA", "Taller 02 Radicado · Versión 2", "186.84.90.12"),
    ]
    ay = 370
    for aud in audits:
        draw.rounded_rectangle([(1020, ay), (1810, ay + 110)], radius=4, fill=(12, 18, 25), outline=C_BORDER, width=1)
        draw.text((1040, ay + 12), f"{aud[0]} · Rol: {aud[1]}", font=get_font(18, True), fill=C_CYAN)
        draw.text((1040, ay + 40), f"Acción: {aud[2]}", font=get_font(20, True), fill=C_WHITE)
        draw.text((1040, ay + 72), f"Detalle: {aud[3]} | IP: {aud[4]}", font=get_font(16, False), fill=C_TEXT_MUTED)
        ay += 125
        
    draw_footer_progress(draw, frame_idx, n_frames, "PERFIL DIRECTOR · GOBERNANZA Y AUDITORÍA")
    return img

def render_scene_6(frame_idx, n_frames):
    img = Image.new("RGB", (WIDTH, HEIGHT), C_OBSIDIAN)
    draw = ImageDraw.Draw(img)
    
    # Big Title
    t1 = "EDUNOVA: La Nueva Era de la Gestión Académica"
    tw = draw.textlength(t1, font=get_font(56, True))
    draw.text(((WIDTH - tw)//2, 120), t1, font=get_font(56, True), fill=C_CYAN)
    
    t2 = "Ecosistema Tecnológico Completo · SENA Regional Huila 2026"
    tw2 = draw.textlength(t2, font=FONT_HEADING)
    draw.text(((WIDTH - tw2)//2, 200), t2, font=FONT_HEADING, fill=C_WHITE)
    
    # 3 Summary Cards
    cards = [
        ("Para el Aprendiz", "Autonomía y Claridad", ["• Avance de competencias en tiempo real", "• Entregas de evidencias con versiones", "• Justificaciones médicas digitales", "• Tutor inteligente EDUNOVA AI"]),
        ("Para el Instructor", "Liderazgo Pedagógico", ["• Asistencia en vivo en < 60 segundos", "• Alertas automáticas por faltas (< 85%)", "• Recuperaciones con auto-acreditación", "• Dossiers listos para imprimir y Excel"]),
        ("Para el Director", "Gobierno de Datos", ["• Visión macro de retención escolar", "• Gestión ágil de oferta y matrículas", "• Auditoría forense e inmutabilidad", "• Seguridad RBAC con tokens JWT"]),
    ]
    cw = 540
    for i, (title, sub, bullets) in enumerate(cards):
        x1 = 90 + i * (cw + 30)
        x2 = x1 + cw
        draw.rounded_rectangle([(x1, 280), (x2, 730)], radius=8, fill=C_CARD_BG, outline=C_BORDER, width=1)
        draw.text((x1 + 30, 310), title, font=FONT_HEADING, fill=C_CYAN)
        draw.text((x1 + 30, 360), sub, font=FONT_SUBTITLE, fill=C_WHITE)
        draw.line([(x1 + 30, 405), (x2 - 30, 405)], fill=C_BORDER, width=1)
        by = 430
        for b in bullets:
            draw.text((x1 + 30, by), b, font=FONT_BODY, fill=C_ICE_BLUE)
            by += 55
            
    # Author & Repo Box
    draw.rounded_rectangle([(90, 770), (1830, 960)], radius=8, fill=(16, 45, 65), outline=C_TURQUOISE, width=1)
    draw.text((130, 800), "Desarrollado por: Anyely Valeria Bautista", font=get_font(28, True), fill=C_WHITE)
    draw.text((130, 845), "Programa: Tecnólogo en Análisis y Desarrollo de Software (ADSO) · Ficha: 2874102", font=FONT_BODY, fill=C_ICE_BLUE)
    draw.text((130, 885), "Centro de Formación Industrial · SENA Regional Huila (Neiva) · Rama Git: DEV", font=FONT_BODY, fill=C_TEXT_MUTED)
    
    draw.rounded_rectangle([(1450, 810), (1790, 920)], radius=6, fill=C_CARD_BG, outline=C_MINT, width=2)
    draw.text((1480, 835), "PROYECTO COMPLETO", font=get_font(18, True), fill=C_MINT)
    draw.text((1480, 865), "MySQL 8 + React 18 + AI", font=get_font(20, True), fill=C_WHITE)
    
    draw_footer_progress(draw, frame_idx, n_frames, "CONCLUSIÓN Y CRÉDITOS INSTITUCIONALES")
    return img

def main():
    output_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "EDUNOVA_Presentacion_Oficial.mp4"))
    print(f"🎬 Iniciando renderizado de video en: {output_path}")
    
    scenes = [
        ("Intro", render_scene_1, 8 * FPS),
        ("Arquitectura", render_scene_2, 9 * FPS),
        ("Perfil Aprendiz", render_scene_3, 14 * FPS),
        ("Perfil Instructor", render_scene_4, 14 * FPS),
        ("Perfil Director", render_scene_5, 13 * FPS),
        ("Cierre", render_scene_6, 9 * FPS),
    ]
    
    total_frames = sum([frames for _, _, frames in scenes])
    print(f"📹 Total de fotogramas a renderizar: {total_frames} ({total_frames / FPS:.1f} segundos a {FPS} FPS)")
    
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    video_writer = cv2.VideoWriter(output_path, fourcc, float(FPS), (WIDTH, HEIGHT))
    
    global_frame = 0
    for scene_name, render_func, scene_frames in scenes:
        print(f"  ▶ Renderizando {scene_name} ({scene_frames} fotogramas)...")
        for f in range(scene_frames):
            pil_img = render_func(f, scene_frames)
            # Convert PIL RGB to OpenCV BGR
            cv_img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
            video_writer.write(cv_img)
            global_frame += 1
            if global_frame % 100 == 0 or global_frame == total_frames:
                print(f"    Progreso: {global_frame}/{total_frames} fotogramas ({(global_frame/total_frames)*100:.1f}%)")
                
    video_writer.release()
    print("✅ ¡Video renderizado exitosamente!")
    size_mb = os.path.getsize(output_path) / (1024 * 1024)
    print(f"📦 Archivo final: {output_path} ({size_mb:.2f} MB)")

if __name__ == "__main__":
    main()
