import { producer } from "../config/messageBroker";

/**
 * KafkaProducer encapsula el envío de mensajes a Kafka.
 * Este componente se utiliza para enviar eventos, por ejemplo, cuando se crea o se actualiza un shipment.
 */
export class KafkaProducer {
  /**
   * Envía un mensaje al topic especificado.
   * @param topic El topic de Kafka.
   * @param message El mensaje a enviar; puede ser un objeto que se serializará a JSON.
   * @throws Error si ocurre un fallo al enviar el mensaje.
   */
  public async send(topic: string, message: any): Promise<void> {
    try {
      // Convertir el mensaje a string si es un objeto.
      const payload = typeof message === "string" ? message : JSON.stringify(message);
      await producer.send({
        topic,
        messages: [{ value: payload }],
      });
      console.log(`Message sent to topic "${topic}": ${payload}`);
    } catch (error) {
      console.error("Error sending message to Kafka:", error);
      throw error;
    }
  }
}
