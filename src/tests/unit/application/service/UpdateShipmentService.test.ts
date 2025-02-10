import { UpdateShipmentService } from "../../../../application/services/UpdateShipmentService";
import { UpdateShipmentDto } from "../../../../application/dto/UpdateShipmentDto";
import { IShipmentRepository } from "../../../../application/ports/out/IShipmentRepository";
import { ShipmentDomainService } from "../../../../domain/services/ShipmentServiceDomain";
import { EventPublisher } from "../../../../infrastructure/messaging/EventPublisher";
import { Shipment } from "../../../../domain/entity/Shipment";
import { Dimensions } from "../../../../domain/valueObjects/Dimensions";
import { ShipmentMapper } from "../../../../application/mappers/ShipmentMapper";

jest.mock("../../../../domain/services/ShipmentServiceDomain");
jest.mock("../../../../application/ports/out/IShipmentRepository");
jest.mock("../../../../infrastructure/messaging/EventPublisher");

describe("UpdateShipmentService", () => {
  let updateShipmentService: UpdateShipmentService;
  let shipmentRepository: jest.Mocked<IShipmentRepository>;
  let shipmentDomainService: jest.Mocked<ShipmentDomainService>;
  let eventPublisher: jest.Mocked<EventPublisher>;

  beforeEach(() => {
    shipmentRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      update: jest.fn()
    } as jest.Mocked<IShipmentRepository>;

    shipmentDomainService = new ShipmentDomainService() as jest.Mocked<ShipmentDomainService>;

    eventPublisher = {
      publish: jest.fn(),
      kafkaProducer: {} 
    } as unknown as jest.Mocked<EventPublisher>;

    updateShipmentService = new UpdateShipmentService(
      shipmentRepository,
      shipmentDomainService,
      eventPublisher
    );
  });

  it("debe actualizar el destino de un envío y publicar el evento correspondiente", async () => {
    const updateShipmentDto = new UpdateShipmentDto({
      shipmentId: "12345",
      newDestination: "San Francisco"
    });

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

    const updatedShipmentMock: Shipment = {
        ...shipmentMock,
        destination: "San Francisco",
        updateShipmentType: function (arg0: string): void {
            throw new Error("Function not implemented.");
        },
        updateOrigin: function (arg0: string): void {
            throw new Error("Function not implemented.");
        }
    };

    shipmentRepository.findById.mockResolvedValue(shipmentMock);
    shipmentDomainService.updateShipmentDestination.mockReturnValue(updatedShipmentMock);
    shipmentRepository.update.mockResolvedValue(undefined);
    eventPublisher.publish.mockResolvedValue(undefined);

    const expectedShipmentDto = ShipmentMapper.toDto(updatedShipmentMock);

    const result = await updateShipmentService.execute(updateShipmentDto);

    expect(shipmentRepository.findById).toHaveBeenCalledWith("12345");
    expect(shipmentDomainService.updateShipmentDestination).toHaveBeenCalledWith(shipmentMock, "San Francisco");
    expect(shipmentRepository.update).toHaveBeenCalledWith(updatedShipmentMock);
    expect(eventPublisher.publish).toHaveBeenCalledWith("shipment.events", {
      event: "ShipmentUpdated",
      payload: expectedShipmentDto
    });
    expect(result).toEqual(expectedShipmentDto);
  });

  it("debe lanzar un error si el envío no se encuentra", async () => {
    const updateShipmentDto = new UpdateShipmentDto({
      shipmentId: "12345",
      newDestination: "San Francisco"
    });

    shipmentRepository.findById.mockResolvedValue(null);

    await expect(updateShipmentService.execute(updateShipmentDto)).rejects.toThrowError("Shipment not found.");
  });
});
