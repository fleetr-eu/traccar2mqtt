const {json} = require("micro")

const mqttUrl = process.env.MQTT_URL || "mqtt://mqtt:1883"
const mqttTopic = process.env.MQTT_TOPIC || "/fleetr/traccar-records"

const mqtt = require("mqtt")
const client = mqtt.connect(mqttUrl, { qos: 2 })

client.on("connect", () => console.log(`Connected to ${mqttUrl}`))

module.exports = async req => {
  if(req.method === "POST") {
    const {position, device} = await json(req);
    const data = {
      name: device.name,
      deviceId: device.uniqueId,
      traccarId: device.id,
      protocol: position.protocol,
      recordTime: {"$date": position.deviceTime},
      offset: position.deviceTime,
      fixTime: {"$date": position.fixTime},
      valid: position.valid,
      lat: position.latitude,
      lng: position.longitude,
      loc: [position.longitude, position.latitude],
      distance: position.attributes.distance,
      altitude: position.altitude,
      speed: position.speed,
      maxSpeed: position.attributes.maxSpeed || 0,
      course: position.course,
      state: position.attributes.state,
      address: position.address,
      attributes: position.attributes
    }
    client.publish(mqttTopic, JSON.stringify(data))
    console.log(data)
    return "Success"
  } else {
    console.log(`Unsupported method ${req.method}`)
    return `GET method is not supported`
  }
}
