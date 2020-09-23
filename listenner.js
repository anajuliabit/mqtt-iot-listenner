const mqtt = require('mqtt')
const fs = require('fs');

const stream = {};

const client  = mqtt.connect(process.env.MQTT_URL,{
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  port: process.env.PORT || '30573',
  host: process.env.HOST
});

process.on('SIGINT', function() {
  console.log("Interrompendo gravação...");
  process.exit();
});

const SAVE_DATA = function(STRING){
  fs.appendFile('./aquisition/TNT_DATA.csv', STRING, function (err) {
    if (err) throw err;
    console.log('@Saved@\n');
  });
};

client.on('connect', function () {

  console.log('Client connected');
    client.subscribe('tnt', function (err) {
      client.on('message', function(topic, message, packet) {
          let TNT_DATA = JSON.parse(message);
          console.log('#TNT_DATA: '+message);
          SAVE_DATA(`${TNT_DATA['row']},${TNT_DATA['Tempo']},${TNT_DATA['Estação']},${TNT_DATA['LAT']},${TNT_DATA['LONG']},${TNT_DATA['Movimentação']},${TNT_DATA['Original_473']},${TNT_DATA['Original_269']},${TNT_DATA['Zero']},${TNT_DATA['Maçã-Verde']},${TNT_DATA['Tangerina']},${TNT_DATA['Citrus']},${TNT_DATA['Açaí-Guaraná']},${TNT_DATA['Pêssego']},${TNT_DATA['TARGET']}\n`);
      });
    });

});
