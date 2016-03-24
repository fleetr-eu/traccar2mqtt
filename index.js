var express = require('express');
var app = express();

var mqtt = require('mqtt');
// var client = mqtt.connect('mqtt://gps.kale-bg.com:10013');
//
// client.on('connect', function() {
//   console.log('Connected to gps.kale-bg.com:10013');
// });

app.get('/gprmc', function(req, res) {
  q = req.query
  console.log(q);
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
  console.log('Query: ', q);
  // client.publish('/fleetr/records', JSON.stringify(rec), function(err) {
  //   if (err) {
  //     console.error(err);
  //   } else {
  //     console.log('MQTT message sent.');
  //   }
  // });
  res.send('Done!');
});

app.listen(4000, function() {
  console.log('Traccar -> MQTT server listening on port 4000!');
});
