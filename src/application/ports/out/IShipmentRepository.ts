
import { Shipment } from "../../../domain/entity/Shipment";

/**
 * Outbound port for shipment persistence.
 */
export interface IShipmentRepository {
  /**
   * Persists a new shipment.
   * @param shipment The Shipment entity to save.
   */
  save(shipment: Shipment): Promise<void>;

  /**
   * Finds a shipment by its unique identifier.
   * @param shipmentId The unique identifier of the shipment.
   * @returns A promise resolving to the Shipment if found, or null otherwise.
   */
  findById(shipmentId: string): Promise<Shipment | null>;

  /**
   * Updates an existing shipment.
   * @param shipment The Shipment entity with updated data.
   */
  update(shipment: Shipment): Promise<void>;
}
