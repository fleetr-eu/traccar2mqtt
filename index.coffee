express = require('express')
app = express()
Datastore = require('nedb')

db = new Datastore filename: 'data/devices.db', autoload: true
db.persistence.setAutocompactionInterval 1800000

mqttUrl = process.env.MQTT_URL or 'mqtt://gps.kale-bg.com:10013'
port = process.env.PORT or 4000

mqtt = require('mqtt')
client = mqtt.connect(mqttUrl)

client.on 'connect', ->
  console.log 'Connected to ' + mqttUrl

app.get '/gprmc', (req, res) ->
  [type, state] = [30, 1]

  q = req.query
  attributes = if q.attributes then JSON.parse(q.attributes) else {}

  id = parseInt(q.id)
  db.findOne {deviceId: id}, (err, device) ->
    console.error err if err

    type = 29 if device?.state isnt attributes?.io239
    [state, io] = if attributes?.io239 then [1, 255] else [0, 254]
    rec =
      'deviceId': id
      'type': type
      'io': io
      'lat': parseFloat(q.latitude)
      'lon': parseFloat(q.longitude)
      'course': parseFloat(q.course)
      'speed': parseFloat(q.speed)
      'recordTime': new Date(parseInt(q.deviceTime)).toISOString()
      'offset': q.deviceTime
    client.publish '/fleetr/records', JSON.stringify(rec), (err) ->
      if err
        console.error err
      else
        console.log 'MQTT message sent:', rec

    rec.state = state
    db.update {deviceId: id}, rec, {upsert: true}, (err) ->
      console.error err if err

  res.send 'Done!'

app.listen port, ->
  console.log 'Traccar -> MQTT server listening on port ' + port
