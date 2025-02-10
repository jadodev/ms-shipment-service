import { consumer } from '../config/messageBroker';

/**
 * KafkaConsumer encapsula la lógica para suscribirse a un topic y procesar mensajes.
 */
export class KafkaConsumer {
  /**
   * Se suscribe a un topic y ejecuta un callback por cada mensaje recibido.
   * @param topic El topic al que suscribirse.
   * @param handler Función asíncrona que procesa cada mensaje.
   */
  public async subscribe(topic: string, handler: (message: any) => Promise<void>): Promise<void> {
    await consumer.subscribe({ topic, fromBeginning: true });
    await consumer.run({
      eachMessage: async ({ message }) => {
        const value = message.value ? message.value.toString() : '';
        try {
          const parsed = JSON.parse(value);
          await handler(parsed);
        } catch (error) {
          // En caso de error, se pasa el mensaje sin parsear o se registra el error.
          console.error("Error processing message:", error);
          await handler(value);
        }
      },
    });
  }
}
