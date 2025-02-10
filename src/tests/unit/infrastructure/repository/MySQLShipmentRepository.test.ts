// src/tests/unit/infrastructure/repository/MySQLShipmentRepository.test.ts

import { MySQLShipmentRepository } from "../../../../infrastructure/repository/MySQLShipmentRepository";
import { Shipment } from "../../../../domain/entity/Shipment";
import { Dimensions } from "../../../../domain/valueObjects/Dimensions";
import { format } from "date-fns";
// Importamos pool; recordemos que se exporta como default.
import pool from "../../../../infrastructure/config/database";

// Ajustamos el mock para que el módulo exporte un default con getConnection.
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
    // Creamos un objeto de conexión simulado con los métodos execute y release.
    mockConnection = {
      execute: jest.fn(),
      release: jest.fn()
    };
    // Configuramos el mock de getConnection para que retorne la conexión simulada.
    (pool.getConnection as jest.Mock).mockResolvedValue(mockConnection);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("save", () => {
    it("debería ejecutar un INSERT con los parámetros correctos y liberar la conexión", async () => {
      // Arrange: Creamos un objeto Shipment de prueba.
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

      // Act: Llamamos al método save.
      await repository.save(shipment);

      // Assert: Verificamos que se llame a connection.execute con el SQL y parámetros correctos.
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
      // Verificamos que se libere la conexión.
      expect(mockConnection.release).toHaveBeenCalled();
    });
  });

  describe("findById", () => {
    it("debería retornar un Shipment cuando se encuentra en la base de datos", async () => {
      // Arrange: Simulamos la respuesta de la consulta con una fila.
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

      // Act: Llamamos a findById.
      const result = await repository.findById("12345");

      // Assert: Verificamos que se retorne un Shipment con los valores esperados.
      expect(result).not.toBeNull();
      expect(result?.shipmentId).toBe("12345");
      expect(result?.customerId).toBe("67890");
      expect(result?.weight).toBe(10);
      expect(result?.shipmentType).toBe("Standard");
      expect(result?.origin).toBe("New York");
      expect(result?.destination).toBe("Los Angeles");
      // Comparamos la fecha usando toISOString()
      expect(result?.depositDate.toISOString()).toBe(new Date(formattedDate).toISOString());
      expect(result?.dimensions).toEqual(new Dimensions(20, 30, 40));
      expect(mockConnection.release).toHaveBeenCalled();
    });

    it("debería retornar null si no se encuentra el shipment", async () => {
      // Arrange: Simulamos que no se encuentran filas.
      mockConnection.execute.mockResolvedValue([[]]);

      // Act:
      const result = await repository.findById("nonexistent");

      // Assert:
      expect(result).toBeNull();
      expect(mockConnection.release).toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("debería ejecutar un UPDATE con los parámetros correctos y liberar la conexión", async () => {
      // Arrange: Creamos un objeto Shipment de prueba para actualizar.
      const depositDate = new Date("2025-02-09T10:00:00Z");
      const shipment = new Shipment(
        "12345",
        "67890",
        10,
        new Dimensions(20, 30, 40),
        "Standard",
        "New York",
        "San Francisco", // Nuevo destino
        depositDate
      );

      // Act: Llamamos al método update.
      await repository.update(shipment);

      // Assert: Verificamos que se llame a connection.execute con el SQL y los parámetros correctos.
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
