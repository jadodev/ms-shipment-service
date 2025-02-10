import { IUpdateShipmentUseCase } from "../ports/in/IUpdateShipmentUseCase";
import { UpdateShipmentDto } from "../dto/UpdateShipmentDto";
import { ShipmentDto } from "../dto/ShipmentDto";
import { IShipmentRepository } from "../ports/out/IShipmentRepository";
import { ShipmentDomainService } from "../../domain/services/ShipmentServiceDomain";
import { ShipmentMapper } from "../mappers/ShipmentMapper";
import { EventPublisher } from "../../infrastructure/messaging/EventPublisher";

/**
 * Application service for updating a shipment's destination.
 */
export class UpdateShipmentService implements IUpdateShipmentUseCase {
  private readonly shipmentRepository: IShipmentRepository;
  private readonly shipmentDomainService: ShipmentDomainService;
  private readonly eventPublisher: EventPublisher;

  constructor(
    shipmentRepository: IShipmentRepository,
    shipmentDomainService: ShipmentDomainService,
    eventPublisher: EventPublisher
  ) {
    this.shipmentRepository = shipmentRepository;
    this.shipmentDomainService = shipmentDomainService;
    this.eventPublisher = eventPublisher;
  }

  /**
   * Executes the use case to update a shipment's destination.
   * @param dto DTO containing the shipment ID and the new destination.
   * @returns A promise that resolves to a ShipmentDto representing the updated shipment.
   */
  public async execute(dto: UpdateShipmentDto): Promise<ShipmentDto> {
    // Retrieve the existing shipment.
    const shipment = await this.shipmentRepository.findById(dto.shipmentId);
    if (!shipment) {
      throw new Error("Shipment not found.");
    }

    // Update the destination using the domain service.
    const updatedShipment = this.shipmentDomainService.updateShipmentDestination(
      shipment,
      dto.newDestination
    );

    // Persist the updated shipment.
    await this.shipmentRepository.update(updatedShipment);

    // Map the updated shipment to a DTO.
    const shipmentPayload = ShipmentMapper.toDto(updatedShipment);

    // Publish the event "ShipmentUpdated" with the updated shipment payload.
    const event = {
      event: "ShipmentUpdated",
      payload: shipmentPayload
    };
    await this.eventPublisher.publish("shipment.events", event);

    return shipmentPayload;
  }
}
