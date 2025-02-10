import express, { Application } from 'express';
import dotenv from 'dotenv';

dotenv.config();

import pool from './infrastructure/config/database';
import { connectKafka } from './infrastructure/config/messageBroker';
import { KafkaProducer } from './infrastructure/messaging/KafkaProducer';
import { EventPublisher } from './infrastructure/messaging/EventPublisher';
import { MySQLShipmentRepository } from './infrastructure/repository/MySQLShipmentRepository';
import { ShipmentDomainService } from './domain/services/ShipmentServiceDomain';
import { CreateShipmentService } from './application/services/CreateShipmentService';
import { QueryShipmentService } from './application/services/QueryShipmentService';
import { UpdateShipmentService } from './application/services/UpdateShipmentService';
import { createShipmentController } from './infrastructure/controller/ShipmentController';
import { setupSwagger } from './infrastructure/swagger/swagger';

async function main() {
  try {
    await connectKafka();
    console.log("Kafka connected.");

    const connection = await pool.getConnection();
    console.log("MySQL connected.");
    connection.release();

    const kafkaProducer = new KafkaProducer();
    const eventPublisher = new EventPublisher(kafkaProducer);

    const shipmentRepository = new MySQLShipmentRepository();
    const shipmentDomainService = new ShipmentDomainService();

    const createShipmentService = new CreateShipmentService(
      shipmentDomainService,
      shipmentRepository,
      eventPublisher
    );
    const queryShipmentService = new QueryShipmentService(shipmentRepository);
    const updateShipmentService = new UpdateShipmentService(
      shipmentRepository,
      shipmentDomainService,
      eventPublisher
    );

    const app: Application = express();
    app.use(express.json());

    setupSwagger(app);

    const shipmentRouter = createShipmentController(
      createShipmentService,
      queryShipmentService,
      updateShipmentService
    );
    app.use("/api", shipmentRouter);

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Shipment service running on port ${port}`);
    });
  } catch (error) {
    console.error("Error starting Shipment service:", error);
    process.exit(1);
  }
}

main();
