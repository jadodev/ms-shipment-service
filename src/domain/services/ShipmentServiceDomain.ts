import { Shipment } from "../entity/Shipment";
import { DomainError } from "../exceptions/DomainError";
import { Dimensions } from "../valueObjects/Dimensions";

/**
 * ShipmentDomainService encapsula la lógica de negocio para la gestión de Shipments.
 * Incluye métodos para crear un nuevo shipment y para actualizar el destino de un shipment existente.
 */
export class ShipmentDomainService {
  /**
   * Crea un nuevo Shipment.
   * @param shipmentId Identificador único para el shipment.
   * @param customerId Identificador del cliente.
   * @param weight Peso del shipment.
   * @param dimensions Dimensiones del shipment.
   * @param shipmentType Tipo del shipment.
   * @param origin Origen del shipment.
   * @param destination Destino del shipment.
   * @param depositDate Fecha en que se deposita el shipment.
   * @returns Una instancia de Shipment.
   */
  public createShipment(
    shipmentId: string,
    customerId: string,
    weight: number,
    dimensions: Dimensions,
    shipmentType: string,
    origin: string,
    destination: string,
    depositDate: Date
  ): Shipment {

    if (!shipmentId || !customerId || !origin || !destination) {
      throw new DomainError("Shipment ID, Customer ID, Origin, and Destination cannot be empty.");
    }

    if (!(depositDate instanceof Date) || isNaN(depositDate.valueOf())) {
      throw new DomainError("Invalid deposit date.");
    }

    if (weight <= 0) {
      throw new DomainError("Weight must be greater than zero.");
    }

    if (!(dimensions instanceof Dimensions)) {
      throw new DomainError("Invalid dimensions.");
    }

    if (!(depositDate instanceof Date) || isNaN(depositDate.getTime())) {
      throw new DomainError("Invalid deposit date.");
    }
  
    return new Shipment(
      shipmentId,
      customerId,
      weight,
      dimensions,
      shipmentType,
      origin,
      destination,
      depositDate
    );
  }

  /**
   * Actualiza el destino de un shipment.
   * Dado que la entidad Shipment es inmutable (sus propiedades son readonly), se crea y retorna una nueva instancia
   * con el destino actualizado, manteniendo el resto de la información.
   * @param shipment El shipment original.
   * @param newDestination El nuevo destino.
   * @returns Una nueva instancia de Shipment con el destino actualizado.
   * @throws DomainError si el nuevo destino es nulo o vacío.
   */
  public updateShipmentDestination(
    shipment: Shipment,
    newDestination: string
  ): Shipment {

    if (!shipment) {
      throw new DomainError("Shipment cannot be null.");
    }

    if (!newDestination) {
      throw new DomainError("New destination cannot be null or empty.");
    }

    return new Shipment(
      shipment.shipmentId,
      shipment.customerId,
      shipment.weight,
      shipment.dimensions,
      shipment.shipmentType,
      shipment.origin,
      newDestination,
      shipment.depositDate
    );
  }
}
