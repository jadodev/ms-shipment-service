import { Kafka, logLevel } from "kafkajs";

const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID || "delivery-shipment-service",
    brokers: process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(",") : ["kafka:9093"],
    logLevel: logLevel.INFO
  });

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: process.env.KAFKA_CONSUMER_GROUP || 'delivery-service-group' });

export async function connectKafka() {
    await producer.connect();
    await consumer.connect();
    console.log("conectado a kafka como productor");
}

