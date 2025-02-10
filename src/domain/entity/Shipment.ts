import { Dimensions } from "../valueObjects/Dimensions";
import { DomainError } from "../exceptions/DomainError";

export class Shipment {
  public readonly shipmentId: string;
  public readonly customerId: string;
  public readonly weight: number;
  public readonly dimensions: Dimensions;
  public readonly shipmentType: string;
  public readonly origin: string;
  public readonly destination: string;
  public readonly depositDate: Date;

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
