// src/infrastructure/repository/MySQLShipmentRepository.ts

import pool from "../config/database";
import { IShipmentRepository } from "../../application/ports/out/IShipmentRepository";
import { Shipment } from "../../domain/entity/Shipment";
import { Dimensions } from "../../domain/valueObjects/Dimensions";
import { format } from 'date-fns';

/**
 * MySQLShipmentRepository es la implementación concreta del puerto outbound para la persistencia
 * de la entidad Shipment utilizando MySQL.
 */
export class MySQLShipmentRepository implements IShipmentRepository {
  /**
   * Persiste un nuevo Shipment en la base de datos.
   * Se insertan las dimensiones en columnas separadas: height, width, length.
   * @param shipment La entidad Shipment a guardar.
   */
  public async save(shipment: Shipment): Promise<void> {
    const connection = await pool.getConnection();
    try {
      const sql = `
        INSERT INTO Shipment 
          (shipmentId, customerId, weight, shipmentType, origin, destination, depositDate, height, width, length)
        VALUES 
          (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      await connection.execute(sql, [
        shipment.shipmentId,
        shipment.customerId,
        shipment.weight,
        shipment.shipmentType,
        shipment.origin,
        shipment.destination,
        format(shipment.depositDate, 'yyyy-MM-dd HH:mm:ss'),
        shipment.dimensions.height,
        shipment.dimensions.width,
        shipment.dimensions.length,
      ]);
    } finally {
      connection.release();
    }
  }

  /**
   * Busca un Shipment por su identificador único.
   * Se leen las columnas separadas de las dimensiones (height, width, length) para reconstruir el value object.
   * @param shipmentId El identificador del shipment.
   * @returns Una promesa que se resuelve en la entidad Shipment si se encuentra, o null en caso contrario.
   */
  public async findById(shipmentId: string): Promise<Shipment | null> {
    const connection = await pool.getConnection();
    try {
      const sql = `
        SELECT shipmentId, customerId, weight, shipmentType, origin, destination, depositDate, height, width, length
        FROM Shipment
        WHERE shipmentId = ?
      `;
      const [rows]: any = await connection.execute(sql, [shipmentId]);
      if (Array.isArray(rows) && rows.length > 0) {
        const row = rows[0];
        // Construir el value object Dimensions usando las columnas separadas.
        const dimensions = new Dimensions(
          row.height,
          row.width,
          row.length
        );
        return new Shipment(
          row.shipmentId,
          row.customerId,
          row.weight,
          dimensions,
          row.shipmentType,
          row.origin,
          row.destination,
          new Date(row.depositDate)
        );
      }
      return null;
    } finally {
      connection.release();
    }
  }

  /**
   * Actualiza un Shipment existente en la base de datos.
   * Se actualizan las columnas, incluyendo las dimensiones (height, width, length).
   * @param shipment La entidad Shipment con datos actualizados.
   */
  public async update(shipment: Shipment): Promise<void> {
    const connection = await pool.getConnection();
    try {
      const sql = `
        UPDATE Shipment
        SET customerId = ?, weight = ?, shipmentType = ?, origin = ?, destination = ?, depositDate = ?,
            height = ?, width = ?, length = ?
        WHERE shipmentId = ?
      `;
      await connection.execute(sql, [
        shipment.customerId,
        shipment.weight,
        shipment.shipmentType,
        shipment.origin,
        shipment.destination,
        shipment.depositDate.toISOString(),
        shipment.dimensions.height,
        shipment.dimensions.width,
        shipment.dimensions.length,
        shipment.shipmentId,
      ]);
    } finally {
      connection.release();
    }
  }
}
