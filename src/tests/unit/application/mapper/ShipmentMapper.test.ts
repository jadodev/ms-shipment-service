import { ShipmentDto } from "../../../../application/dto/ShipmentDto";
import { ShipmentMapper } from "../../../../application/mappers/ShipmentMapper";
import { Shipment } from "../../../../domain/entity/Shipment";
import { Dimensions } from "../../../../domain/valueObjects/Dimensions";

describe('ShipmentMapper', () => {
  it('should map a Shipment entity to a ShipmentDto', () => {
    const dimensions = new Dimensions(5, 5, 10);

    const shipment = new Shipment(
      '123',  
      '456',  
      10,  
      dimensions, 
      'Standard',
      'Bogotá',  
      'Medellín', 
      new Date('2025-02-09T00:00:00Z') 
    );

    const shipmentDto = ShipmentMapper.toDto(shipment);

    expect(shipmentDto).toBeInstanceOf(ShipmentDto);
    expect(shipmentDto.shipmentId).toBe(shipment.shipmentId);
    expect(shipmentDto.customerId).toBe(shipment.customerId);
    expect(shipmentDto.weight).toBe(shipment.weight);
    expect(shipmentDto.dimensions).toEqual(shipment.dimensions);
    expect(shipmentDto.shipmentType).toBe(shipment.shipmentType);
    expect(shipmentDto.origin).toBe(shipment.origin);
    expect(shipmentDto.destination).toBe(shipment.destination);
    expect(shipmentDto.depositDate).toBe(shipment.depositDate.toISOString());
  });

  it('should throw an error if the Shipment entity is missing required properties', () => {
    expect(() => new Shipment('', '', 0, new Dimensions(0, 0, 0), '', '', '', new Date()))
      .toThrowError();
  });
});
