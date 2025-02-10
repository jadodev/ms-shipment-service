import { CreateShipmentDto } from "../../../../application/dto/CreateShipmentDto";
import { ShipmentDto } from "../../../../application/dto/ShipmentDto";
import { IShipmentRepository } from "../../../../application/ports/out/IShipmentRepository";
import { CreateShipmentService } from "../../../../application/services/CreateShipmentService";
import { Shipment } from "../../../../domain/entity/Shipment";
import { ShipmentDomainService } from "../../../../domain/services/ShipmentServiceDomain";
import { Dimensions } from "../../../../domain/valueObjects/Dimensions";
import { EventPublisher } from "../../../../infrastructure/messaging/EventPublisher";

jest.mock("../../../../domain/services/ShipmentServiceDomain");
jest.mock("../../../../application/ports/out/IShipmentRepository");
jest.mock("../../../../infrastructure/messaging/EventPublisher");

describe("CreateShipmentService", () => {
  let createShipmentService: CreateShipmentService;
  let shipmentDomainService: jest.Mocked<ShipmentDomainService>;
  let shipmentRepository: jest.Mocked<IShipmentRepository>;
  let eventPublisher: jest.Mocked<EventPublisher>;

  beforeEach(() => {
    shipmentDomainService = new ShipmentDomainService() as jest.Mocked<ShipmentDomainService>;
    shipmentRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      update: jest.fn()
    } as jest.Mocked<IShipmentRepository>;

    eventPublisher = {
      publish: jest.fn(),
      kafkaProducer: {}
    } as unknown as jest.Mocked<EventPublisher>;

    createShipmentService = new CreateShipmentService(
      shipmentDomainService,
      shipmentRepository,
      eventPublisher
    );
  });

  it("should create a shipment and publish an event", async () => {
    const createShipmentDto: CreateShipmentDto = {
      shipmentId: "12345",
      customerId: "67890",
      weight: 10,
      dimensions: { height: 20, width: 30, length: 40 },
      shipmentType: "Standard",
      origin: "New York",
      destination: "Los Angeles",
      depositDate: "2025-02-09T10:00:00Z"
    };

    const shipmentDto: ShipmentDto = {
        shipmentId: "12345",
        customerId: "67890",
        weight: 10,
        dimensions: { height: 20, width: 30, length: 40 },
        shipmentType: "Standard",
        origin: "New York",
        destination: "Los Angeles",
        depositDate: "2025-02-09T10:00:00.000Z" 
      };

    const shipmentMock: Shipment = {
      shipmentId: "12345",
      customerId: "67890",
      weight: 10,
      dimensions: new Dimensions(20, 30, 40),
      shipmentType: "Standard",
      origin: "New York",
      destination: "Los Angeles",
      depositDate: new Date("2025-02-09T10:00:00Z"),
      updateShipmentType: jest.fn(),
      updateOrigin: jest.fn()
    };

    const createShipmentMock = shipmentDomainService.createShipment as unknown as jest.Mock<Promise<Shipment>, any[]>;
    createShipmentMock.mockResolvedValue(shipmentMock);

    shipmentRepository.save.mockResolvedValue(undefined);
    eventPublisher.publish.mockResolvedValue(undefined);

    const result = await createShipmentService.execute(createShipmentDto);

    expect(eventPublisher.publish).toHaveBeenCalledWith("shipment.events", {
        event: "ShipmentCreated",
        payload: expect.objectContaining({
          shipmentId: "12345",
          customerId: "67890",
          weight: 10,
          dimensions: { height: 20, width: 30, length: 40 },
          shipmentType: "Standard",
          origin: "New York",
          destination: "Los Angeles",
          depositDate: expect.stringMatching(/^2025-02-09T10:00:00(\.000)?Z$/)
        })
      });
    expect(shipmentRepository.save).toHaveBeenCalledWith(shipmentMock);
    expect(eventPublisher.publish).toHaveBeenCalledWith("shipment.events", {
      event: "ShipmentCreated",
      payload: shipmentDto
    });
    expect(result).toEqual(shipmentDto);
  });

  it("should throw an error if shipmentId is missing in the DTO", async () => {
    const createShipmentDto: CreateShipmentDto = {
      shipmentId: "12345",
      customerId: "67890",
      weight: 10,
      dimensions: { height: 20, width: 30, length: 40 },
      shipmentType: "Standard",
      origin: "New York",
      destination: "Los Angeles",
      depositDate: "2025-02-09T10:00:00Z"
    };

    const invalidDto = { ...createShipmentDto, shipmentId: "" };

    await expect(createShipmentService.execute(invalidDto)).rejects.toThrowError("shipmentId is required.");
  });
});
