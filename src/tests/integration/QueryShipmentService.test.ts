import { ShipmentDto } from "../../application/dto/ShipmentDto";
import { IShipmentRepository } from "../../application/ports/out/IShipmentRepository";
import { QueryShipmentService } from "../../application/services/QueryShipmentService";
import { Shipment } from "../../domain/entity/Shipment";
import { Dimensions } from "../../domain/valueObjects/Dimensions";

describe("QueryShipmentService", () => {
  let shipmentRepositoryMock: jest.Mocked<IShipmentRepository>;
  let queryShipmentService: QueryShipmentService;

  beforeEach(() => {
    shipmentRepositoryMock = {
      findById: jest.fn(),
      save: jest.fn(),
      update: jest.fn()
    } as jest.Mocked<IShipmentRepository>;

    queryShipmentService = new QueryShipmentService(shipmentRepositoryMock);
  });

  it("debe retornar un ShipmentDto cuando se encuentra el shipment", async () => {
    const depositDate = new Date("2025-02-09T10:00:00Z");
    const shipment = new Shipment(
      "12345",
      "67890",
      10,
      new Dimensions(20, 30, 40),
      "Standard",
      "New York",
      "Los Angeles",
      depositDate
    );
    shipmentRepositoryMock.findById.mockResolvedValue(shipment);

    const result = await queryShipmentService.execute("12345");

    const expectedDto: ShipmentDto = new ShipmentDto({
      shipmentId: "12345",
      customerId: "67890",
      weight: 10,
      dimensions: { height: 20, width: 30, length: 40 },
      shipmentType: "Standard",
      origin: "New York",
      destination: "Los Angeles",
      depositDate: depositDate.toISOString(),
    });

    expect(result).toEqual(expectedDto);
    expect(shipmentRepositoryMock.findById).toHaveBeenCalledWith("12345");
  });

  it("debe lanzar un error cuando no se encuentra el shipment", async () => {
    shipmentRepositoryMock.findById.mockResolvedValue(null);

    await expect(queryShipmentService.execute("nonexistent")).rejects.toThrow("Shipment not found.");
    expect(shipmentRepositoryMock.findById).toHaveBeenCalledWith("nonexistent");
  });
});
