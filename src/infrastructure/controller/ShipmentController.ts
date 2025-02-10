import { Router, Request, Response } from 'express';
import { CreateShipmentService } from '../../application/services/CreateShipmentService';
import { QueryShipmentService } from '../../application/services/QueryShipmentService';
import { UpdateShipmentService } from '../../application/services/UpdateShipmentService';

/**
 * Crea y configura un router Express para el microservicio Shipment.
 *
 * Exponemos los siguientes endpoints:
 *  - POST /shipments: Crea un nuevo shipment.
 *  - GET /shipments/:shipmentId: Consulta un shipment por su ID.
 *  - PATCH /shipments: Actualiza el destino de un shipment.
 *
 * @param createService Servicio de aplicación para crear shipments.
 * @param queryService Servicio de aplicación para consultar shipments.
 * @param updateService Servicio de aplicación para actualizar el destino de un shipment.
 * @returns Un Router configurado.
 */
export function createShipmentController(
  createService: CreateShipmentService,
  queryService: QueryShipmentService,
  updateService: UpdateShipmentService
): Router {
  const router = Router();

  // Health check endpoint
  router.get('', (req: Request, res: Response) => {
    res.json({ status: 'Shipment Service is running' });
  });
  
  // Endpoint para crear un shipment
  router.post('/shipments', async (req: Request, res: Response) => {
    try {
      const dto = req.body; // Se espera que cumpla con la estructura de CreateShipmentDto.
      const result = await createService.execute(dto);
      res.status(201).json(result);
    } catch (error: any) {
      console.error("Error creating shipment:", error);
      res.status(400).json({ error: error.message });
    }
  });

  // Endpoint para consultar un shipment por ID
  router.get('/shipments/:shipmentId', async (req: Request, res: Response) => {
    try {
      const shipmentId = req.params.shipmentId;
      const result = await queryService.execute(shipmentId);
      res.json(result);
    } catch (error: any) {
      console.error("Error querying shipment:", error);
      res.status(404).json({ error: error.message });
    }
  });

  // Endpoint para actualizar el destino de un shipment
  router.patch('/shipments', async (req: Request, res: Response) => {
    try {
      const dto = req.body; // Se espera que cumpla con la estructura de UpdateShipmentDto.
      const result = await updateService.execute(dto);
      res.json(result);
    } catch (error: any) {
      console.error("Error updating shipment:", error);
      res.status(400).json({ error: error.message });
    }
  });

  return router;
}
