// src/application/ports/in/IUpdateShipmentUseCase.ts

import { UpdateShipmentDto } from "../../dto/UpdateShipmentDto";
import { ShipmentDto } from "../../dto/ShipmentDto";

/**
 * Inbound port for updating a shipment's destination.
 */
export interface IUpdateShipmentUseCase {
  /**
   * Executes the use case to update a shipment's destination.
   * @param dto DTO containing the shipment ID and the new destination.
   * @returns A promise that resolves to a ShipmentDto representing the updated shipment.
   */
  execute(dto: UpdateShipmentDto): Promise<ShipmentDto>;
}
