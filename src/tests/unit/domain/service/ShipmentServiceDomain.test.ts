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
    const shipment = service.createShipment(
      "123",
      "456",
      10,
      new Dimensions(10, 20, 30),
      "Standard",
      "New York",
      "Los Angeles",
      new Date()
    );

    expect(shipment).toBeInstanceOf(Shipment);
    expect(shipment.shipmentId).toBe("123");
  });

  test("should throw error when creating shipment with negative weight", () => {
    expect(() =>
      service.createShipment(
        "124",
        "789",
        -5, // Peso negativo
        new Dimensions(10, 20, 30),
        "Standard",
        "New York",
        "Los Angeles",
        new Date()
      )
    ).toThrow(DomainError);
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

    const updatedShipment = service.updateShipmentDestination(shipment, "San Francisco");

    expect(updatedShipment).toBeInstanceOf(Shipment);
    expect(updatedShipment.destination).toBe("San Francisco");
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

  test("should throw error when dimensions are invalid", () => {
    expect(() => new Dimensions(-10, 20, 30)).toThrow(DomainError);
    expect(() => new Dimensions(10, -20, 30)).toThrow(DomainError);
    expect(() => new Dimensions(10, 20, -30)).toThrow(DomainError);
    expect(() => new Dimensions(0, 0, 0)).toThrow(DomainError);
  });

  test("should allow creation of a shipment with different types", () => {
    const shipmentTypes = ["Standard", "Express", "Overnight"];
    shipmentTypes.forEach((type) => {
      const shipment = service.createShipment(
        "125",
        "457",
        5,
        new Dimensions(15, 25, 35),
        type,
        "Chicago",
        "Houston",
        new Date()
      );
      expect(shipment.shipmentType).toBe(type);
    });
  });

  test("should throw error if shipmentId is empty", () => {
    expect(() =>
      service.createShipment(
        "",
        "456",
        10,
        new Dimensions(10, 20, 30),
        "Standard",
        "New York",
        "Los Angeles",
        new Date()
      )
    ).toThrow(DomainError);
  });
  
  test("should correctly retrieve shipment properties", () => {
    const shipment = new Shipment("127", "459", 15, new Dimensions(20, 20, 20), "Standard", "Boston", "Denver", new Date());
  
    expect(shipment.shipmentId).toBe("127");
    expect(shipment.weight).toBe(15);
    expect(shipment.origin).toBe("Boston");
    expect(shipment.destination).toBe("Denver");
  });

  test("should not update shipment destination if new destination is the same", () => {
    const shipment = new Shipment(
      "128",
      "460",
      8,
      new Dimensions(10, 10, 10),
      "Standard",
      "Dallas",
      "Seattle",
      new Date()
    );
  
    const updatedShipment = service.updateShipmentDestination(shipment, "Seattle");
    expect(updatedShipment.destination).toBe("Seattle");
  });
  
  test("should throw error if shipment is null when updating destination", () => {
    expect(() => service.updateShipmentDestination(null as any, "Orlando")).toThrow(DomainError);
  });
  
  test("should correctly calculate volume", () => {
    const dimensions = new Dimensions(5, 5, 5);
    expect(dimensions.getVolume()).toBe(125);
  });
  
  test("should correctly create dimensions with minimum valid values", () => {
    const dimensions = new Dimensions(1, 1, 1);
    expect(dimensions.getVolume()).toBe(1);
  });
  
});
