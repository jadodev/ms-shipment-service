import { Shipment } from "../../entity/Shipment";

/**
 * Inbound port for querying a shipment.
 * Este contrato define el método para obtener un shipment dado su identificador.
 */
export interface IQueryShipment {
  /**
   * Obtiene un Shipment por su identificador único.
   * @param shipmentId Identificador del shipment.
   * @returns El Shipment correspondiente o null si no se encuentra.
   */
  getById(shipmentId: string): Promise<Shipment | null>;
}
