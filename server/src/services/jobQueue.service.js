/**
 * Cola de Trabajos en Segundo Plano (Job Queue) para EDUNOVA
 * Despacha tareas pesadas o lentas (generación de PDFs, notificaciones masivas, consolidación IA)
 * sin bloquear el hilo principal de peticiones HTTP.
 */

class JobQueueService {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
  }

  // Encolar nueva tarea
  enqueue(jobName, payload, taskFn) {
    const job = {
      id: `${jobName}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: jobName,
      payload,
      taskFn,
      createdAt: new Date(),
      status: 'pending'
    };

    this.queue.push(job);
    console.info(`📥 [JobQueue] Tarea encolada: ${job.name} (ID: ${job.id})`);
    this.processNext();
    return job.id;
  }

  // Procesar cola secuencialmente
  async processNext() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    const currentJob = this.queue.shift();
    currentJob.status = 'processing';

    try {
      const start = Date.now();
      await currentJob.taskFn(currentJob.payload);
      const elapsed = Date.now() - start;
      console.info(`✅ [JobQueue] Tarea finalizada con éxito: ${currentJob.name} (${elapsed}ms)`);
      currentJob.status = 'completed';
    } catch (error) {
      console.error(`❌ [JobQueue Error] Fallo en tarea ${currentJob.name}:`, error.message);
      currentJob.status = 'failed';
    } finally {
      this.isProcessing = false;
      this.processNext();
    }
  }
}

module.exports = new JobQueueService();
