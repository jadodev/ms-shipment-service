import request from "supertest";
import express from "express";
import { CreateShipmentService } from "../../../../application/services/CreateShipmentService";
import { QueryShipmentService } from "../../../../application/services/QueryShipmentService";
import { UpdateShipmentService } from "../../../../application/services/UpdateShipmentService";
import { createShipmentController } from "../../../../infrastructure/controller/ShipmentController";

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

const createServiceMock = {
  execute: jest.fn()
} as unknown as jest.Mocked<CreateShipmentService>;

const queryServiceMock = {
  execute: jest.fn()
} as unknown as jest.Mocked<QueryShipmentService>;

const updateServiceMock = {
  execute: jest.fn()
} as unknown as jest.Mocked<UpdateShipmentService>;

describe("Shipment Controller", () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/", createShipmentController(createServiceMock, queryServiceMock, updateServiceMock));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("debería responder al health check", async () => {
    const res = await request(app).get("");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "Shipment Service is running" });
  });

  it("debería crear un shipment y responder con 201", async () => {
    const createShipmentDto = {
      shipmentId: "12345",
      customerId: "67890",
      weight: 10,
      dimensions: { height: 20, width: 30, length: 40 },
      shipmentType: "Standard",
      origin: "New York",
      destination: "Los Angeles",
      depositDate: "2025-02-09T10:00:00Z"
    };

    createServiceMock.execute.mockResolvedValue(createShipmentDto);

    const res = await request(app)
      .post("/shipments")
      .send(createShipmentDto)
      .set("Accept", "application/json");

    expect(createServiceMock.execute).toHaveBeenCalledWith(createShipmentDto);
    expect(res.status).toBe(201);
    expect(res.body).toEqual(createShipmentDto);
  });

  it("debería responder con error 400 si falla la creación del shipment", async () => {
    const createShipmentDto = {
      shipmentId: "",  
      customerId: "67890",
      weight: 10,
      dimensions: { height: 20, width: 30, length: 40 },
      shipmentType: "Standard",
      origin: "New York",
      destination: "Los Angeles",
      depositDate: "2025-02-09T10:00:00Z"
    };

    createServiceMock.execute.mockRejectedValue(new Error("shipmentId is required."));

    const res = await request(app)
      .post("/shipments")
      .send(createShipmentDto)
      .set("Accept", "application/json");

    expect(createServiceMock.execute).toHaveBeenCalledWith(createShipmentDto);
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "shipmentId is required." });
  });

  it("debería consultar un shipment y responder con el DTO", async () => {
    const shipmentDto = {
      shipmentId: "12345",
      customerId: "67890",
      weight: 10,
      dimensions: { height: 20, width: 30, length: 40 },
      shipmentType: "Standard",
      origin: "New York",
      destination: "Los Angeles",
      depositDate: "2025-02-09T10:00:00Z"
    };

    queryServiceMock.execute.mockResolvedValue(shipmentDto);

    const res = await request(app).get("/shipments/12345");

    expect(queryServiceMock.execute).toHaveBeenCalledWith("12345");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(shipmentDto);
  });

  it("debería responder con error 404 si no se encuentra el shipment al consultar", async () => {
    queryServiceMock.execute.mockRejectedValue(new Error("Shipment not found."));

    const res = await request(app).get("/shipments/99999");

    expect(queryServiceMock.execute).toHaveBeenCalledWith("99999");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Shipment not found." });
  });

  it("debería actualizar el destino de un shipment y responder con el DTO actualizado", async () => {
    const updateShipmentDto = {
      shipmentId: "12345",
      newDestination: "San Francisco"
    };

    const updatedShipmentDto = {
      shipmentId: "12345",
      customerId: "67890",
      weight: 10,
      dimensions: { height: 20, width: 30, length: 40 },
      shipmentType: "Standard",
      origin: "New York",
      destination: "San Francisco",
      depositDate: "2025-02-09T10:00:00Z"
    };

    updateServiceMock.execute.mockResolvedValue(updatedShipmentDto);

    const res = await request(app)
      .patch("/shipments")
      .send(updateShipmentDto)
      .set("Accept", "application/json");

    expect(updateServiceMock.execute).toHaveBeenCalledWith(updateShipmentDto);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(updatedShipmentDto);
  });

  it("debería responder con error 400 si falla la actualización del shipment", async () => {
    const updateShipmentDto = {
      shipmentId: "12345",
      newDestination: "" 
    };

    updateServiceMock.execute.mockRejectedValue(new Error("newDestination is required."));

    const res = await request(app)
      .patch("/shipments")
      .send(updateShipmentDto)
      .set("Accept", "application/json");

    expect(updateServiceMock.execute).toHaveBeenCalledWith(updateShipmentDto);
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "newDestination is required." });
  });
});
