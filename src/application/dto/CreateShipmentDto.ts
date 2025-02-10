import { isValidAddress } from "../../utils/addressValidator";
/**
 * DTO for creating a Shipment.
 */
export class CreateShipmentDto {
  shipmentId: string;
  customerId: string;
  weight: number;
  dimensions: { height: number; width: number; length: number; };
  shipmentType: string;
  origin: string;
  destination: string;
  depositDate: string; 

  constructor(data: {
    shipmentId: string;
    customerId: string;
    weight: number;
    dimensions: { height: number; width: number; length: number; };
    shipmentType: string;
    origin: string;
    destination: string;
    depositDate: string;
  }) {
    if (!data.shipmentId) throw new Error("shipmentId is required.");
    if (!data.customerId) throw new Error("customerId is required.");
    if (data.weight === undefined || data.weight === null) throw new Error("weight is required.");
    if (!data.dimensions) throw new Error("dimensions are required.");
    if (!data.shipmentType) throw new Error("shipmentType is required.");
    if (!data.origin) throw new Error("origin is required.");
    if (!data.destination) throw new Error("destination is required.");
    if (!data.depositDate) throw new Error("depositDate is required.");
    if (!isValidAddress(data.destination)) {
      throw new Error('Invalid destination address format. Please use a valid Colombian address format (e.g., "Cll 123 #34-23").');
    }

    this.shipmentId = data.shipmentId;
    this.customerId = data.customerId;
    this.weight = data.weight;
    this.dimensions = data.dimensions;
    this.shipmentType = data.shipmentType;
    this.origin = data.origin;
    this.destination = data.destination;
    this.depositDate = data.depositDate;
  }
}
