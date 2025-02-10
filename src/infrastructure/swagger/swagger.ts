import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

export function setupSwagger(app: Application): void {
  const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'Shipment Service API',
        version: '1.0.0',
        description: 'API documentation for the Shipment Service',
      },
      servers: [
        {
          url: 'http://localhost:3000',
        },
      ],
      components: {
        schemas: {
          Shipment: {
            type: 'object',
            properties: {
              shipmentId: { type: 'string' },
              customerId: { type: 'string' },
              weight: { type: 'number' },
              dimensions: {
                type: 'object',
                properties: {
                  height: { type: 'number' },
                  width: { type: 'number' },
                  length: { type: 'number' },
                },
              },
              shipmentType: { type: 'string' },
              origin: { type: 'string' },
              destination: { type: 'string' },
              depositDate: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
    apis: ['./src/infrastructure/controller/*.ts'],
  };

  const swaggerDocs = swaggerJSDoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}
