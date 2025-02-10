// src/tests/integration/CreateShipmentService.integration.test.ts

import { CreateShipmentService } from "../../application/services/CreateShipmentService";
import { CreateShipmentDto } from "../../application/dto/CreateShipmentDto";
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
 * Se extiende la clase EventPublisher para cumplir con la firma (incluyendo la propiedad kafkaProducer)
 * y se sobreescribe el método publish para almacenar los eventos en un array.
 */
class FakeEventPublisher extends EventPublisher {
  public events: Array<{ topic: string; event: any }> = [];

  constructor() {
    // Llamamos al constructor de EventPublisher pasando un KafkaProducer dummy.
    super({ send: async () => {} } as any);
  }

  public async publish(topic: string, event: any): Promise<void> {
    this.events.push({ topic, event });
  }
}

/**
 * Implementación "falsa" del servicio de dominio.
 * Se extiende ShipmentDomainService y se sobrescribe createShipment para retornar el Shipment directamente.
 * Nota: La firma original de createShipment en ShipmentDomainService es síncrona (retorna Shipment),
 * por lo que en nuestro Fake se retorna el Shipment sin envolverlo en una Promise.
 */
class FakeShipmentDomainService extends ShipmentDomainService {
  createShipment(
    shipmentId: string,
    customerId: string,
    weight: number,
    dimensions: Dimensions,
    shipmentType: string,
    origin: string,
    destination: string,
    depositDate: Date
  ): Shipment {
    return new Shipment(
      shipmentId,
      customerId,
      weight,
      dimensions,
      shipmentType,
      origin,
      destination,
      depositDate
    );
  }
}

describe("CreateShipmentService Integration Test", () => {
  let repository: InMemoryShipmentRepository;
  let eventPublisher: FakeEventPublisher;
  let domainService: FakeShipmentDomainService;
  let createShipmentService: CreateShipmentService;

  beforeEach(() => {
    repository = new InMemoryShipmentRepository();
    eventPublisher = new FakeEventPublisher();
    domainService = new FakeShipmentDomainService();
    createShipmentService = new CreateShipmentService(domainService, repository, eventPublisher);
  });

  it("debe crear un shipment, persistirlo, publicar el evento y retornar el ShipmentDto correcto", async () => {
    // Arrange: Se crea el DTO de creación a partir de los datos de prueba.
    const createShipmentDto = new CreateShipmentDto({
      shipmentId: "12345",
      customerId: "67890",
      weight: 10,
      dimensions: { height: 20, width: 30, length: 40 },
      shipmentType: "Standard",
      origin: "New York",
      destination: "Los Angeles",
      depositDate: "2025-02-09T10:00:00Z",
    });

    // Act: Se ejecuta el servicio.
    const result: ShipmentDto = await createShipmentService.execute(createShipmentDto);

    // El ShipmentDto esperado debe tener el mismo contenido, teniendo en cuenta que la fecha se transforma a ISO.
    const expectedDto: ShipmentDto = new ShipmentDto({
      shipmentId: "12345",
      customerId: "67890",
      weight: 10,
      dimensions: { height: 20, width: 30, length: 40 },
      shipmentType: "Standard",
      origin: "New York",
      destination: "Los Angeles",
      depositDate: new Date("2025-02-09T10:00:00Z").toISOString(),
    });

    // Assert 1: Verificamos que el resultado del servicio sea el DTO esperado.
    expect(result).toEqual(expectedDto);

    // Assert 2: Verificamos que el repositorio haya persistido el shipment.
    const persistedShipment = await repository.findById("12345");
    expect(persistedShipment).not.toBeNull();
    expect(persistedShipment?.shipmentId).toBe("12345");

    // Assert 3: Verificamos que se haya publicado un evento en el topic "shipment.events"
    // y que el evento tenga la estructura esperada.
    expect(eventPublisher.events.length).toBe(1);
    const publishedEvent = eventPublisher.events[0];
    expect(publishedEvent.topic).toBe("shipment.events");
    expect(publishedEvent.event).toEqual({
      event: "ShipmentCreated",
      payload: expectedDto
    });
  });
});
