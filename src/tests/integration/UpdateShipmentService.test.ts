// src/tests/integration/UpdateShipmentService.integration.test.ts

import { UpdateShipmentService } from "../../application/services/UpdateShipmentService";
import { UpdateShipmentDto } from "../../application/dto/UpdateShipmentDto";
import { ShipmentDto } from "../../application/dto/ShipmentDto";
import { IShipmentRepository } from "../../application/ports/out/IShipmentRepository";
import { EventPublisher } from "../../infrastructure/messaging/EventPublisher";
import { Dimensions } from "../../domain/valueObjects/Dimensions";
import { Shipment } from "../../domain/entity/Shipment";
import { ShipmentDomainService } from "../../domain/services/ShipmentServiceDomain";

/**
 * Implementación in-memory del repositorio de Shipments.
 */
class InMemoryShipmentRepository implements IShipmentRepository {
  private shipments: Map<string, Shipment> = new Map();

  async save(shipment: Shipment): Promise<void> {
    this.shipments.set(shipment.shipmentId, shipment);
  }

  async findById(shipmentId: string): Promise<Shipment | null> {
    return this.shipments.get(shipmentId) || null;
  }

  async update(shipment: Shipment): Promise<void> {
    this.shipments.set(shipment.shipmentId, shipment);
  }
}

/**
 * Implementación "falsa" del publicador de eventos.
 * Se extiende la clase EventPublisher para cumplir con la propiedad obligatoria 'kafkaProducer'
 * y se sobrescribe el método publish para almacenar los eventos en un array.
 */
class FakeEventPublisher extends EventPublisher {
  public events: Array<{ topic: string; event: any }> = [];

  constructor() {
    // Se pasa un KafkaProducer dummy (no importa su implementación en este test).
    super({ send: async () => {} } as any);
  }

  async publish(topic: string, event: any): Promise<void> {
    this.events.push({ topic, event });
  }
}

/**
 * Implementación "falsa" del servicio de dominio.
 * Se extiende ShipmentDomainService y se sobrescribe updateShipmentDestination para retornar un Shipment con el nuevo destino.
 */
class FakeShipmentDomainService extends ShipmentDomainService {
  updateShipmentDestination(shipment: Shipment, newDestination: string): Shipment {
    // Retornamos un nuevo objeto Shipment con el destino actualizado.
    return new Shipment(
      shipment.shipmentId,
      shipment.customerId,
      shipment.weight,
      shipment.dimensions,
      shipment.shipmentType,
      shipment.origin,
      newDestination,
      shipment.depositDate
    );
  }
}

describe("UpdateShipmentService Integration Test", () => {
  let repository: InMemoryShipmentRepository;
  let eventPublisher: FakeEventPublisher;
  let domainService: FakeShipmentDomainService;
  let updateShipmentService: UpdateShipmentService;

  beforeEach(async () => {
    repository = new InMemoryShipmentRepository();
    eventPublisher = new FakeEventPublisher();
    domainService = new FakeShipmentDomainService();
    updateShipmentService = new UpdateShipmentService(repository, domainService, eventPublisher);

    // Pre-populamos el repositorio con un shipment existente (destino original "Los Angeles").
    const shipment = new Shipment(
      "12345",
      "67890",
      10,
      new Dimensions(20, 30, 40),
      "Standard",
      "New York",
      "Los Angeles",  // Destino original
      new Date("2025-02-09T10:00:00Z")
    );
    await repository.save(shipment);
  });

  it("debe actualizar el destino de un shipment, persistir los cambios, publicar el evento y retornar el ShipmentDto actualizado", async () => {
    // Arrange: Creamos el DTO de actualización.
    const updateShipmentDto = new UpdateShipmentDto({
      shipmentId: "12345",
      newDestination: "San Francisco"
    });

    // Act: Ejecutamos el servicio de actualización.
    const result: ShipmentDto = await updateShipmentService.execute(updateShipmentDto);

    // El ShipmentDto esperado debe reflejar el cambio en el destino y conservar el resto de los datos.
    const expectedDto: ShipmentDto = new ShipmentDto({
      shipmentId: "12345",
      customerId: "67890",
      weight: 10,
      dimensions: { height: 20, width: 30, length: 40 },
      shipmentType: "Standard",
      origin: "New York",
      destination: "San Francisco",
      depositDate: new Date("2025-02-09T10:00:00Z").toISOString()
    });

    // Assert 1: El resultado del servicio debe ser el DTO esperado.
    expect(result).toEqual(expectedDto);

    // Assert 2: El repositorio in-memory debe haber actualizado el shipment.
    const persistedShipment = await repository.findById("12345");
    expect(persistedShipment).not.toBeNull();
    expect(persistedShipment?.destination).toBe("San Francisco");

    // Assert 3: Debe publicarse un evento en el topic "shipment.events" con la estructura correcta.
    expect(eventPublisher.events.length).toBe(1);
    const publishedEvent = eventPublisher.events[0];
    expect(publishedEvent.topic).toBe("shipment.events");
    expect(publishedEvent.event).toEqual({
      event: "ShipmentUpdated",
      payload: expectedDto
    });
  });
});
