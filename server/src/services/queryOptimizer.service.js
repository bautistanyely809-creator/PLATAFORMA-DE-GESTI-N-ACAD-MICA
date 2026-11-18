/**
 * Servicio de Optimización de Consultas SQL y APIs Externas
 * 1. Resuelve problemas N+1 mediante JOINs optimizados (Prisma include).
 * 2. Solicita únicamente columnas requeridas (Prisma select).
 * 3. Aplica timeouts estrictos a servicios externos para evitar cuelgues.
 */

class QueryOptimizer {
  /**
   * Ejecuta peticiones a APIs externas con Timeout automático
   * @param {string} url Endpoint externo
   * @param {object} options Opciones de fetch
   * @param {number} timeoutMs Tiempo máximo de espera (default: 5000ms)
   */
  static async fetchWithTimeout(url, options = {}, timeoutMs = 5000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error(`[API Externa Timeout] La llamada a ${url} superó el límite de ${timeoutMs}ms.`);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Patrón de consulta libre de N+1 para matrículas y aprendices
   * En lugar de iterar por cada matrícula y consultar el aprendiz por separado (N consultas),
   * ejecuta una única consulta SQL optimizada con JOIN (`include`) y columnas seleccionadas.
   */
  static getOptimizedMatriculasQuery(prismaClient, grupoId) {
    return prismaClient.matricula.findMany({
      where: { id_grupo: Number(grupoId), estado: 'ACTIVO' },
      select: {
        id_matricula: true,
        fecha_matricula: true,
        estado: true,
        // JOIN resuelto en un solo query (Evita N+1)
        aprendiz: {
          select: {
            id_aprendiz: true,
            documento: true,
            telefono: true,
            usuario: {
              select: {
                nombre: true,
                apellido: true,
                correo: true
              }
            }
          }
        },
        // Calificaciones agregadas sin sub-queries lentas
        calificaciones: {
          select: {
            id_calificacion: true,
            nota: true,
            observacion: true
          }
        }
      }
    });
  }
}

module.exports = QueryOptimizer;

