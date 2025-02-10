// src/application/services/QueryShipmentService.ts

import { IQueryShipmentUseCase } from "../ports/in/IQueryShipmentUseCase";
import { ShipmentDto } from "../dto/ShipmentDto";
import { IShipmentRepository } from "../ports/out/IShipmentRepository";
import { ShipmentMapper } from "../mappers/ShipmentMapper";

/**
 * Application service for querying a shipment by its ID.
 */
export class QueryShipmentService implements IQueryShipmentUseCase {
  private readonly shipmentRepository: IShipmentRepository;

  constructor(shipmentRepository: IShipmentRepository) {
    this.shipmentRepository = shipmentRepository;
  }

  public async execute(shipmentId: string): Promise<ShipmentDto> {
    const shipment = await this.shipmentRepository.findById(shipmentId);
    if (!shipment) {
      throw new Error("Shipment not found.");
    }
    return ShipmentMapper.toDto(shipment);
  }
}
