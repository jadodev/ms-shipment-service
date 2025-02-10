// src/application/ports/in/IQueryShipmentUseCase.ts

import { ShipmentDto } from "../../dto/ShipmentDto";

/**
 * Inbound port for querying a shipment by its ID.
 */
export interface IQueryShipmentUseCase {
  /**
   * Executes the use case to query a shipment.
   * @param shipmentId The unique identifier of the shipment.
   * @returns A promise that resolves to a ShipmentDto.
   */
  execute(shipmentId: string): Promise<ShipmentDto>;
}
