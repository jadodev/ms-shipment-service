
import { consumer } from "../../../../infrastructure/config/messageBroker";
import { KafkaConsumer } from "../../../../infrastructure/messaging/KafkaConsumer";

jest.mock("../../../../infrastructure/config/messageBroker", () => ({
  consumer: {
    subscribe: jest.fn(),
    run: jest.fn()
  }
}));

describe("KafkaConsumer", () => {
  let kafkaConsumer: KafkaConsumer;

  beforeEach(() => {
    kafkaConsumer = new KafkaConsumer();
    jest.clearAllMocks();
  });

  it("debería suscribirse al topic y ejecutar el handler con el mensaje parseado", async () => {
    const topic = "test-topic";
    const handlerMock = jest.fn().mockResolvedValue(undefined);

    (consumer.run as jest.Mock).mockImplementation(async ({ eachMessage }) => {
      const message = { value: Buffer.from('{"data": "hello"}') };
      await eachMessage({ message });
    });

    await kafkaConsumer.subscribe(topic, handlerMock);

    expect(consumer.subscribe).toHaveBeenCalledWith({ topic, fromBeginning: true });
    expect(consumer.run).toHaveBeenCalled();
    expect(handlerMock).toHaveBeenCalledWith({ data: "hello" });
  });

  it("debería llamar al handler con el mensaje sin parsear si JSON.parse falla", async () => {
    const topic = "test-topic";
    const handlerMock = jest.fn().mockResolvedValue(undefined);

    (consumer.run as jest.Mock).mockImplementation(async ({ eachMessage }) => {
      const message = { value: Buffer.from("not valid json") };
      await eachMessage({ message });
    });

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    await kafkaConsumer.subscribe(topic, handlerMock);

    expect(consumer.subscribe).toHaveBeenCalledWith({ topic, fromBeginning: true });
    expect(consumer.run).toHaveBeenCalled();
    expect(handlerMock).toHaveBeenCalledWith("not valid json");
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining("Error processing message:"),
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });
});
