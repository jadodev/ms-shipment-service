import { Shipment } from "../../entity/Shipment";

/**
 * Inbound port for updating a shipment.
 * Este contrato define el método para actualizar únicamente el destino de un shipment.
 */
export interface IUpdateShipment {
  /**
   * Actualiza el destino de un shipment.
   * Debido a la inmutabilidad de la entidad, se retorna una nueva instancia con el destino actualizado.
   * @param shipment El shipment original.
   * @param newDestination El nuevo destino.
   * @returns Una nueva instancia de Shipment con el destino actualizado.
   */
  updateDestination(shipment: Shipment, newDestination: string): Shipment;
}
