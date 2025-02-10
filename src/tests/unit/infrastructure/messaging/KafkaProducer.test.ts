import { producer } from "../../../../infrastructure/config/messageBroker";
import { KafkaProducer } from "../../../../infrastructure/messaging/KafkaProducer";

jest.mock("../../../../infrastructure/config/messageBroker", () => ({
  producer: {
    send: jest.fn().mockResolvedValue(undefined)
  }
}));

describe("KafkaProducer", () => {
  let kafkaProducer: KafkaProducer;

  beforeEach(() => {
    kafkaProducer = new KafkaProducer();
    jest.clearAllMocks();
  });

  it("debería enviar un mensaje convirtiéndolo a JSON cuando se pasa un objeto", async () => {
    const topic = "test-topic";
    const messageObj = { data: "hello" };
    const expectedPayload = JSON.stringify(messageObj);

    await kafkaProducer.send(topic, messageObj);

    expect(producer.send).toHaveBeenCalledWith({
      topic,
      messages: [{ value: expectedPayload }]
    });
  });

  it("debería enviar un mensaje sin modificarlo cuando se pasa un string", async () => {
    const topic = "test-topic";
    const messageStr = "simple message";

    await kafkaProducer.send(topic, messageStr);

    expect(producer.send).toHaveBeenCalledWith({
      topic,
      messages: [{ value: messageStr }]
    });
  });

  it("debería registrar el error y lanzar la excepción si falla el envío", async () => {
    const topic = "test-topic";
    const message = { data: "fail" };
    const error = new Error("Sending failed");

    (producer.send as jest.Mock).mockRejectedValueOnce(error);

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(kafkaProducer.send(topic, message)).rejects.toThrow(error);
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error sending message to Kafka:", error);

    consoleErrorSpy.mockRestore();
  });
});
