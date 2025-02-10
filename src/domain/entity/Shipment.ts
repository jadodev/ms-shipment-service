import { Dimensions } from "../valueObjects/Dimensions";
import { DomainError } from "../exceptions/DomainError";

/**
 * Represents a shipment, the aggregate root in the shipment domain.
 * It encapsulates immutable shipment data and maintains its delivery state.
 */
export class Shipment {
  public readonly shipmentId: string;
  public readonly customerId: string;
  public readonly weight: number;
  public readonly dimensions: Dimensions;
  public readonly shipmentType: string;
  public readonly origin: string;
  public readonly destination: string;
  public readonly depositDate: Date;


  /**
   * Constructs a new Shipment instance.
   * @param shipmentId Unique identifier for the shipment; must not be empty.
   * @param customerId Identifier of the customer; must not be empty.
   * @param weight Weight of the shipment.
   * @param dimensions Dimensions of the shipment; must not be null.
   * @param shipmentType Type of the shipment; must not be empty.
   * @param origin Origin location; must not be empty.
   * @param destination Destination location; must not be empty.
   * @param depositDate Date when the shipment was deposited; must not be null.
   * @throws DomainError if any required parameter is invalid.
   */
  constructor(
    shipmentId: string,
    customerId: string,
    weight: number,
    dimensions: Dimensions,
    shipmentType: string,
    origin: string,
    destination: string,
    depositDate: Date
  ) {
    if (!shipmentId) {
      throw new DomainError("Shipment ID cannot be null or empty.");
    }
    if (!customerId) {
      throw new DomainError("Customer ID cannot be null or empty.");
    }
    if (!dimensions) {
      throw new DomainError("Dimensions cannot be null.");
    }
    if (!shipmentType) {
      throw new DomainError("Shipment type cannot be null or empty.");
    }
    if (!origin) {
      throw new DomainError("Origin cannot be null or empty.");
    }
    if (!destination) {
      throw new DomainError("Destination cannot be null or empty.");
    }
    if (!depositDate) {
      throw new DomainError("Deposit date cannot be null.");
    }

    this.shipmentId = shipmentId;
    this.customerId = customerId;
    this.weight = weight;
    this.dimensions = dimensions;
    this.shipmentType = shipmentType;
    this.origin = origin;
    this.destination = destination;
    this.depositDate = depositDate;
  }

 
  public toString(): string {
    return `Shipment { shipmentId: ${this.shipmentId}, customerId: ${this.customerId}, weight: ${this.weight}, dimensions: ${this.dimensions.toString()}, shipmentType: ${this.shipmentType}, origin: ${this.origin}, destination: ${this.destination}, depositDate: ${this.depositDate.toISOString()} }`;
  }
}
