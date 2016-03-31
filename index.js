var express = require('express');
var app = express();

mqttUrl = process.env.MQTT_URL || 'mqtt://gps.kale-bg.com:10013';
port = process.env.PORT || 4000;

var mqtt = require('mqtt');
var client = mqtt.connect(mqttUrl);

client.on('connect', function() {
  console.log('Connected to ' + mqttUrl);
});

app.get('/gprmc', function(req, res) {
  q = req.query
  rec = {
    "deviceId": parseInt(q.id),
    "type": 30,
    "lat": parseFloat(q.latitude),
    "lon": parseFloat(q.longitude),
    "course": parseFloat(q.course),
    "speed": parseFloat(q.speed),
    "recordTime": new Date(parseInt(q.deviceTime)).toISOString(),
    "offset": q.deviceTime
  };
  client.publish('/fleetr/records', JSON.stringify(rec), function(err) {
    if (err) {
      console.error(err);
    } else {
      console.log('MQTT message sent:', rec);
    }
  });
  res.send('Done!');
});

app.listen(port, function() {
  console.log('Traccar -> MQTT server listening on port ' + port);
});
