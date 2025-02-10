// src/application/ports/in/ICreateShipmentUseCase.ts

import { CreateShipmentDto } from "../../dto/CreateShipmentDto";
import { ShipmentDto } from "../../dto/ShipmentDto";

/**
 * Inbound port for creating a shipment.
 */
export interface ICreateShipmentUseCase {
  /**
   * Executes the use case to create a shipment.
   * @param dto DTO containing the shipment creation data.
   * @returns A promise that resolves to a ShipmentDto representing the created shipment.
   */
  execute(dto: CreateShipmentDto): Promise<ShipmentDto>;
}
