import { QueryShipmentService } from "../../../../application/services/QueryShipmentService";
import { IShipmentRepository } from "../../../../application/ports/out/IShipmentRepository";
import { Shipment } from "../../../../domain/entity/Shipment";
import { Dimensions } from "../../../../domain/valueObjects/Dimensions";
import { ShipmentDto } from "../../../../application/dto/ShipmentDto";

const shipmentRepositoryMock: jest.Mocked<IShipmentRepository> = {
  save: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
};

describe("QueryShipmentService", () => {
  let queryShipmentService: QueryShipmentService;

  beforeEach(() => {
    jest.clearAllMocks();
    queryShipmentService = new QueryShipmentService(shipmentRepositoryMock);
  });

  it("debe retornar un ShipmentDto cuando el envío existe", async () => {
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
      updateOrigin: jest.fn(),
    };

    shipmentRepositoryMock.findById.mockResolvedValue(shipmentMock);

    const expectedDto: ShipmentDto = new ShipmentDto({
      shipmentId: shipmentMock.shipmentId,
      customerId: shipmentMock.customerId,
      weight: shipmentMock.weight,
      dimensions: {
        height: shipmentMock.dimensions.height,
        width: shipmentMock.dimensions.width,
        length: shipmentMock.dimensions.length,
      },
      shipmentType: shipmentMock.shipmentType,
      origin: shipmentMock.origin,
      destination: shipmentMock.destination,
      depositDate: shipmentMock.depositDate.toISOString(),
    });

    const result = await queryShipmentService.execute("12345");

    expect(shipmentRepositoryMock.findById).toHaveBeenCalledWith("12345");
    expect(result).toEqual(expectedDto);
  });

  it("debe lanzar un error cuando el envío no se encuentra", async () => {
    shipmentRepositoryMock.findById.mockResolvedValue(null);

    await expect(queryShipmentService.execute("12345")).rejects.toThrowError("Shipment not found.");
  });
});
