// src/application/dto/ShipmentDto.ts

/**
 * DTO representing a Shipment.
 */
export class ShipmentDto {
  shipmentId: string;
  customerId: string;
  weight: number;
  dimensions: { height: number; width: number; length: number; };
  shipmentType: string;
  origin: string;
  destination: string;
  depositDate: string; // ISO string

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
