import { EventPublisher } from "../../../../infrastructure/messaging/EventPublisher";

const kafkaProducerMock = {
  send: jest.fn().mockResolvedValue(undefined)
};

describe("EventPublisher", () => {
  let eventPublisher: EventPublisher;

  beforeEach(() => {
    jest.clearAllMocks();
    eventPublisher = new EventPublisher(kafkaProducerMock as any);
  });

  it("debería llamar a kafkaProducer.send con el topic y el evento correctos", async () => {
    const topic = "test-topic";
    const event = { message: "Hola Kafka" };

    await eventPublisher.publish(topic, event);

    expect(kafkaProducerMock.send).toHaveBeenCalledWith(topic, event);
  });
});
