import { MySQLShipmentRepository } from "../../../../infrastructure/repository/MySQLShipmentRepository";
import { Shipment } from "../../../../domain/entity/Shipment";
import { Dimensions } from "../../../../domain/valueObjects/Dimensions";
import { format } from "date-fns";
import pool from "../../../../infrastructure/config/database";

jest.mock("../../../../infrastructure/config/database", () => ({
  __esModule: true,
  default: {
    getConnection: jest.fn()
  }
}));

describe("MySQLShipmentRepository", () => {
  let repository: MySQLShipmentRepository;
  let mockConnection: {
    execute: jest.Mock;
    release: jest.Mock;
  };

  beforeEach(() => {
    repository = new MySQLShipmentRepository();
    mockConnection = {
      execute: jest.fn(),
      release: jest.fn()
    };
    (pool.getConnection as jest.Mock).mockResolvedValue(mockConnection);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("save", () => {
    it("debería ejecutar un INSERT con los parámetros correctos y liberar la conexión", async () => {
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

      await repository.save(shipment);

      expect(mockConnection.execute).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO Shipment"),
        [
          shipment.shipmentId,
          shipment.customerId,
          shipment.weight,
          shipment.shipmentType,
          shipment.origin,
          shipment.destination,
          format(shipment.depositDate, 'yyyy-MM-dd HH:mm:ss'),
          shipment.dimensions.height,
          shipment.dimensions.width,
          shipment.dimensions.length,
        ]
      );
      expect(mockConnection.release).toHaveBeenCalled();
    });
  });

  describe("findById", () => {
    it("debería retornar un Shipment cuando se encuentra en la base de datos", async () => {
      const formattedDate = "2025-02-09 10:00:00";
      const rows = [{
        shipmentId: "12345",
        customerId: "67890",
        weight: 10,
        shipmentType: "Standard",
        origin: "New York",
        destination: "Los Angeles",
        depositDate: formattedDate,
        height: 20,
        width: 30,
        length: 40
      }];
      mockConnection.execute.mockResolvedValue([rows]);

      const result = await repository.findById("12345");

      expect(result).not.toBeNull();
      expect(result?.shipmentId).toBe("12345");
      expect(result?.customerId).toBe("67890");
      expect(result?.weight).toBe(10);
      expect(result?.shipmentType).toBe("Standard");
      expect(result?.origin).toBe("New York");
      expect(result?.destination).toBe("Los Angeles");
      expect(result?.depositDate.toISOString()).toBe(new Date(formattedDate).toISOString());
      expect(result?.dimensions).toEqual(new Dimensions(20, 30, 40));
      expect(mockConnection.release).toHaveBeenCalled();
    });

    it("debería retornar null si no se encuentra el shipment", async () => {
      mockConnection.execute.mockResolvedValue([[]]);

      const result = await repository.findById("nonexistent");

      expect(result).toBeNull();
      expect(mockConnection.release).toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("debería ejecutar un UPDATE con los parámetros correctos y liberar la conexión", async () => {
      const depositDate = new Date("2025-02-09T10:00:00Z");
      const shipment = new Shipment(
        "12345",
        "67890",
        10,
        new Dimensions(20, 30, 40),
        "Standard",
        "New York",
        "San Francisco",
        depositDate
      );

      await repository.update(shipment);

      expect(mockConnection.execute).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE Shipment"),
        [
          shipment.customerId,
          shipment.weight,
          shipment.shipmentType,
          shipment.origin,
          shipment.destination,
          shipment.depositDate.toISOString(),
          shipment.dimensions.height,
          shipment.dimensions.width,
          shipment.dimensions.length,
          shipment.shipmentId,
        ]
      );
      expect(mockConnection.release).toHaveBeenCalled();
    });
  });
});
