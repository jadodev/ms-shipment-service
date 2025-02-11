# ms-shipment-service
## Documentación de la API con Swagger

La aplicación incluye documentación interactiva de la API generada con Swagger. Una vez que la aplicación esté en ejecución, puedes acceder a la documentación abriendo tu navegador y navegando a:

**http://localhost:3000/api-doc**

Asegúrate de que la aplicación se esté ejecutando en el puerto configurado para Swagger.

```plaintext
\---src
    |   index.ts
    |
    +---application
    |   +---dto
    |   |       CreateShipmentDto.ts
    |   |       ShipmentDto.ts
    |   |       UpdateShipmentDto.ts
    |   |
    |   +---mappers
    |   |       ShipmentMapper.ts
    |   |
    |   +---ports
    |   |   +---in
    |   |   |       ICreateShipmentUseCase.ts
    |   |   |       IQueryShipmentUseCase.ts
    |   |   |       IUpdateShipmentUseCase.ts
    |   |   |
    |   |   \---out
    |   |           IShipmentRepository.ts
    |   |
    |   \---services
    |           CreateShipmentService.ts
    |           QueryShipmentService.ts
    |           UpdateShipmentService.ts
    |
    +---domain
    |   +---entity
    |   |       Shipment.ts
    |   |
    |   +---exceptions
    |   |       DomainError.ts
    |   |
    |   +---ports
    |   |   +---in
    |   |   |       ICreateShipment.ts
    |   |   |       IQueryShipment.ts
    |   |   |       IUpdateShipment.ts
    |   |   |
    |   |   \---out
    |   |           IShipmentRepository.ts
    |   |
    |   +---services
    |   |       ShipmentServiceDomain.ts
    |   |
    |   \---valueObjects
    |           Dimensions.ts
    |
    +---infrastructure
    |   +---config
    |   |       database.ts
    |   |       messageBroker.ts
    |   |
    |   +---controller
    |   |       ShipmentController.ts
    |   |
    |   +---messaging
    |   |       EventPublisher.ts
    |   |       KafkaConsumer.ts
    |   |       KafkaProducer.ts
    |   |
    |   +---repository
    |   |       MySQLShipmentRepository.ts
    |   |
    |   \---swagger
    |           swagger.ts
    |
    +---tests
    |   +---integration
    |   |       ControllerShipment.test.ts
    |   |       CreateShipmentService.test.ts
    |   |       QueryShipmentService.test.ts
    |   |       UpdateShipmentService.test.ts
    |   |
    |   \---unit
    |       +---application
    |       |   +---mapper
    |       |   |       ShipmentMapper.test.ts
    |       |   |
    |       |   \---service
    |       |           CreateShipmentService.test.ts
    |       |           QueryShipmentService.test.ts
    |       |           UpdateShipmentService.test.ts
    |       |
    |       +---domain
    |       |   \---service
    |       |           ShipmentServiceDomain.test.ts
    |       |
    |       \---infrastructure
    |           +---controller
    |           |       ShipmentController.test.ts
    |           |
    |           +---messaging
    |           |       EventPubliser.test.ts
    |           |       KafkaConsumer.test.ts
    |           |       KafkaProducer.test.ts
    |           |
    |           \---repository
    |                   MySQLShipmentRepository.test.ts
    |
    \---utils
            addressValidator.ts

