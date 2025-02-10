import { Shipment } from "../../../../domain/entity/Shipment";
import { DomainError } from "../../../../domain/exceptions/DomainError";
import { ShipmentDomainService } from "../../../../domain/services/ShipmentServiceDomain";
import { Dimensions } from "../../../../domain/valueObjects/Dimensions";

describe("ShipmentDomainService", () => {
  let service: ShipmentDomainService;

  beforeEach(() => {
    service = new ShipmentDomainService();
  });

  test("should create a shipment successfully", () => {
    const shipmentId = "123";
    const customerId = "456";
    const weight = 10;
    const dimensions = new Dimensions(10, 20, 30);
    const shipmentType = "Standard";
    const origin = "New York";
    const destination = "Los Angeles";
    const depositDate = new Date();

    const shipment = service.createShipment(
      shipmentId,
      customerId,
      weight,
      dimensions,
      shipmentType,
      origin,
      destination,
      depositDate
    );

    expect(shipment).toBeInstanceOf(Shipment);
    expect(shipment.shipmentId).toBe(shipmentId);
    expect(shipment.customerId).toBe(customerId);
    expect(shipment.weight).toBe(weight);
    expect(shipment.dimensions).toEqual(dimensions);
    expect(shipment.shipmentType).toBe(shipmentType);
    expect(shipment.origin).toBe(origin);
    expect(shipment.destination).toBe(destination);
    expect(shipment.depositDate).toBe(depositDate);
  });

  test("should update shipment destination successfully", () => {
    const shipment = new Shipment(
      "123",
      "456",
      10,
      new Dimensions(10, 20, 30),
      "Standard",
      "New York",
      "Los Angeles",
      new Date()
    );

    const newDestination = "San Francisco";
    const updatedShipment = service.updateShipmentDestination(shipment, newDestination);

    expect(updatedShipment).toBeInstanceOf(Shipment);
    expect(updatedShipment.destination).toBe(newDestination);
    expect(updatedShipment.shipmentId).toBe(shipment.shipmentId);
  });

  test("should throw error when updating with an empty destination", () => {
    const shipment = new Shipment(
      "123",
      "456",
      10,
      new Dimensions(10, 20, 30),
      "Standard",
      "New York",
      "Los Angeles",
      new Date()
    );

    expect(() => service.updateShipmentDestination(shipment, "")).toThrow(DomainError);
    expect(() => service.updateShipmentDestination(shipment, "")).toThrow("New destination cannot be null or empty.");
  });
});
