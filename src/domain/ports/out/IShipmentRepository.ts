import { Shipment } from "../../entity/Shipment";

/**
 * Outbound port for shipment persistence.
 * Este contrato abstrae las operaciones necesarias para guardar, consultar y actualizar la entidad Shipment.
 */
export interface IShipmentRepository {
  /**
   * Persiste un nuevo Shipment.
   * @param shipment La entidad Shipment a guardar.
   */
  save(shipment: Shipment): Promise<void>;

  /**
   * Busca un Shipment por su identificador único.
   * @param shipmentId El identificador del shipment.
   * @returns Una promesa que se resuelve con el Shipment si se encuentra, o null en caso contrario.
   */
  findById(shipmentId: string): Promise<Shipment | null>;

  /**
   * Actualiza un Shipment existente.
   * @param shipment La entidad Shipment con datos actualizados.
   */
  update(shipment: Shipment): Promise<void>;
}
