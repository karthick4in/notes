from confluent_kafka import Producer

# Configure a Producer
config = {
  "bootstrap.servers": "192.168.0.107:9092"
}
producer = Producer(config)

# Create an error-handling callback.
def delivery_callback(err, msg):
  if err:
      print(f"ERROR: Message failed delivery: {err}")
  else:
      print(f"Produced event key = {msg.key()} value = {msg.value()}")

# Produce data.
mykey = "test"
myvalue = "welcome"
producer.produce("mytopic", mykey, myvalue, callback=delivery_callback)

# Cleanup
producer.flush()
