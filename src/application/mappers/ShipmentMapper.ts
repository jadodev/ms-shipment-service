import { Shipment } from "../../domain/entity/Shipment";
import { ShipmentDto } from "../dto/ShipmentDto";

/**
 * Mapper to transform a Shipment domain entity into a ShipmentDto.
 */
export class ShipmentMapper {
  public static toDto(shipment: Shipment): ShipmentDto {
    return new ShipmentDto({
      shipmentId: shipment.shipmentId,
      customerId: shipment.customerId,
      weight: shipment.weight,
      dimensions: {
        height: shipment.dimensions.height,
        width: shipment.dimensions.width,
        length: shipment.dimensions.length,
      },
      shipmentType: shipment.shipmentType,
      origin: shipment.origin,
      destination: shipment.destination,
      depositDate: shipment.depositDate.toISOString(),
    });
  }
}
