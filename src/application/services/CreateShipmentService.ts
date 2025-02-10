import { ICreateShipmentUseCase } from "../ports/in/ICreateShipmentUseCase";
import { CreateShipmentDto } from "../dto/CreateShipmentDto";
import { ShipmentDto } from "../dto/ShipmentDto";
import { ShipmentDomainService } from "../../domain/services/ShipmentServiceDomain";
import { IShipmentRepository } from "../ports/out/IShipmentRepository";
import { Dimensions } from "../../domain/valueObjects/Dimensions";
import { ShipmentMapper } from "../mappers/ShipmentMapper";
import { EventPublisher } from "../../infrastructure/messaging/EventPublisher";

/**
 * Application service for creating a shipment.
 */
export class CreateShipmentService implements ICreateShipmentUseCase {
  private readonly shipmentDomainService: ShipmentDomainService;
  private readonly shipmentRepository: IShipmentRepository;
  private readonly eventPublisher: EventPublisher;

  constructor(
    shipmentDomainService: ShipmentDomainService,
    shipmentRepository: IShipmentRepository,
    eventPublisher: EventPublisher
  ) {
    this.shipmentDomainService = shipmentDomainService;
    this.shipmentRepository = shipmentRepository;
    this.eventPublisher = eventPublisher;
  }

  /**
   * Executes the use case to create a shipment.
   * @param dto DTO containing the shipment creation data.
   * @returns A promise that resolves to a ShipmentDto representing the created shipment.
   */
  public async execute(dto: CreateShipmentDto): Promise<ShipmentDto> {

    if (!dto.shipmentId) {
      throw new Error("shipmentId is required.");
    }
    // Create a Dimensions value object.
    const dimensions = new Dimensions(
      dto.dimensions.height,
      dto.dimensions.width,
      dto.dimensions.length
    );

    // Create a new Shipment domain entity.
    const shipment = await this.shipmentDomainService.createShipment(
      dto.shipmentId,
      dto.customerId,
      dto.weight,
      dimensions,
      dto.shipmentType,
      dto.origin,
      dto.destination,
      new Date(dto.depositDate)
    );

    // Persist the shipment.
    await this.shipmentRepository.save(shipment);

    // Map the domain entity to a DTO.
    const shipmentPayload = ShipmentMapper.toDto(shipment);

    // Publish the event "ShipmentCreated" including the shipment payload.
    const event = {
      event: "ShipmentCreated",
      payload: shipmentPayload
    };
    await this.eventPublisher.publish("shipment.events", event);

    return shipmentPayload;
  }
}
