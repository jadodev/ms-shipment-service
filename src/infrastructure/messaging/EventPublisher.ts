import { KafkaProducer } from "./KafkaProducer";

/**
 * EventPublisher centraliza la publicación de eventos a Kafka.
 * Permite que la capa de aplicación emita eventos sin conocer detalles del broker.
 */
export class EventPublisher {
  private readonly kafkaProducer: KafkaProducer;

  constructor(kafkaProducer: KafkaProducer) {
    this.kafkaProducer = kafkaProducer;
  }

  /**
   * Publica un evento en el topic especificado.
   * @param topic El topic de Kafka.
   * @param event El evento a publicar.
   */
  public async publish(topic: string, event: any): Promise<void> {
    await this.kafkaProducer.send(topic, event);
  }
}
