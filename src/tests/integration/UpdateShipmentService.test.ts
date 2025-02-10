import { UpdateShipmentService } from "../../application/services/UpdateShipmentService";
import { UpdateShipmentDto } from "../../application/dto/UpdateShipmentDto";
import { ShipmentDto } from "../../application/dto/ShipmentDto";
import { IShipmentRepository } from "../../application/ports/out/IShipmentRepository";
import { EventPublisher } from "../../infrastructure/messaging/EventPublisher";
import { Dimensions } from "../../domain/valueObjects/Dimensions";
import { Shipment } from "../../domain/entity/Shipment";
import { ShipmentDomainService } from "../../domain/services/ShipmentServiceDomain";

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

class FakeEventPublisher extends EventPublisher {
  public events: Array<{ topic: string; event: any }> = [];

  constructor() {
    super({ send: async () => {} } as any);
  }

  async publish(topic: string, event: any): Promise<void> {
    this.events.push({ topic, event });
  }
}


class FakeShipmentDomainService extends ShipmentDomainService {
  updateShipmentDestination(shipment: Shipment, newDestination: string): Shipment {
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

    const shipment = new Shipment(
      "12345",
      "67890",
      10,
      new Dimensions(20, 30, 40),
      "Standard",
      "New York",
      "Los Angeles",  
      new Date("2025-02-09T10:00:00Z")
    );
    await repository.save(shipment);
  });

  it("should update the destination of a shipment, persist the changes, publish the event, and return the updated ShipmentDto", async () => {
    const updateShipmentDto = new UpdateShipmentDto({
      shipmentId: "12345",
      newDestination: "San Francisco"
    });

    const result: ShipmentDto = await updateShipmentService.execute(updateShipmentDto);

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

    expect(result).toEqual(expectedDto);

    const persistedShipment = await repository.findById("12345");
    expect(persistedShipment).not.toBeNull();
    expect(persistedShipment?.destination).toBe("San Francisco");

    expect(eventPublisher.events.length).toBe(1);
    const publishedEvent = eventPublisher.events[0];
    expect(publishedEvent.topic).toBe("shipment.events");
    expect(publishedEvent.event).toEqual({
      event: "ShipmentUpdated",
      payload: expectedDto
    });
  });
});
