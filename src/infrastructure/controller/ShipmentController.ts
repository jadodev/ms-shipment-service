import { Router, Request, Response } from 'express';
import { CreateShipmentService } from '../../application/services/CreateShipmentService';
import { QueryShipmentService } from '../../application/services/QueryShipmentService';
import { UpdateShipmentService } from '../../application/services/UpdateShipmentService';

/**
 * @swagger
 * tags:
 *   name: Shipments
 *   description: Shipment management endpoints
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Shipments]
 *     responses:
 *       200:
 *         description: Shipment Service is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Shipment Service is running
 */
/**
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

  router.get('', (req: Request, res: Response) => {
    res.json({ status: 'Shipment Service is running' });
  });

  /**
   * @swagger
   * /shipments:
   *   post:
   *     summary: Create a new shipment
   *     tags: [Shipments]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               shipmentId:
   *                 type: string
   *               customerId:
   *                 type: string
   *               weight:
   *                 type: number
   *               dimensions:
   *                 type: object
   *                 properties:
   *                   height:
   *                     type: number
   *                   width:
   *                     type: number
   *                   length:
   *                     type: number
   *               shipmentType:
   *                 type: string
   *               origin:
   *                 type: string
   *               destination:
   *                 type: string
   *               depositDate:
   *                 type: string
   *                 format: date-time
   *     responses:
   *       201:
   *         description: Shipment created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Shipment'
   *       400:
   *         description: Bad Request
   */
  router.post('/shipments', async (req: Request, res: Response) => {
    try {
      const dto = req.body;
      const result = await createService.execute(dto);
      res.status(201).json(result);
    } catch (error: any) {
      console.error("Error creating shipment:", error);
      res.status(400).json({ error: error.message });
    }
  });

  /**
   * @swagger
   * /shipments/{shipmentId}:
   *   get:
   *     summary: Get a shipment by ID
   *     tags: [Shipments]
   *     parameters:
   *       - in: path
   *         name: shipmentId
   *         required: true
   *         schema:
   *           type: string
   *         description: The shipment ID
   *     responses:
   *       200:
   *         description: The shipment data
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Shipment'
   *       404:
   *         description: Shipment not found
   */
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

  /**
   * @swagger
   * /shipments:
   *   patch:
   *     summary: Update the destination of a shipment
   *     tags: [Shipments]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               shipmentId:
   *                 type: string
   *               newDestination:
   *                 type: string
   *     responses:
   *       200:
   *         description: Shipment updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Shipment'
   *       400:
   *         description: Bad Request
   */
  router.patch('/shipments', async (req: Request, res: Response) => {
    try {
      const dto = req.body; 
      const result = await updateService.execute(dto);
      res.json(result);
    } catch (error: any) {
      console.error("Error updating shipment:", error);
      res.status(400).json({ error: error.message });
    }
  });

  return router;
}
