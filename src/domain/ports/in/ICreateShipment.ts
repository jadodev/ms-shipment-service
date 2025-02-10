import { Shipment } from "../../entity/Shipment";
import { Dimensions } from "../../valueObjects/Dimensions";

/**
 * Inbound port for creating a shipment.
 * Este contrato define el método para crear un nuevo shipment a partir de los datos requeridos.
 */
export interface ICreateShipment {
  /**
   * Crea un nuevo Shipment.
   * @param shipmentId Identificador único del shipment.
   * @param customerId Identificador del cliente.
   * @param weight Peso del shipment.
   * @param dimensions Dimensiones del shipment.
   * @param shipmentType Tipo del shipment.
   * @param origin Origen del shipment.
   * @param destination Destino del shipment.
   * @param depositDate Fecha en que se deposita el shipment.
   * @returns Una instancia de Shipment.
   */
  create(
    shipmentId: string,
    customerId: string,
    weight: number,
    dimensions: Dimensions,
    shipmentType: string,
    origin: string,
    destination: string,
    depositDate: Date
  ): Shipment;
}
