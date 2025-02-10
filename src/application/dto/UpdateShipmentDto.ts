
/**
 * DTO for updating the destination of a Shipment.
 */
export class UpdateShipmentDto {
    shipmentId: string;
    newDestination: string;
  
    constructor(data: { shipmentId: string; newDestination: string; }) {
      if (!data.shipmentId) throw new Error("shipmentId is required.");
      if (!data.newDestination) throw new Error("newDestination is required.");
      
      this.shipmentId = data.shipmentId;
      this.newDestination = data.newDestination;
    }
  }
  