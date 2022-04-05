const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mqtt = require('mqtt');
const app = express();


const subscriber = mqtt.connect("mqtt://localhost:1883")
const topicName = "test/connection"
const topicName1 = "test/temp"
const topicName2 = "test/health"
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/status", (req, res) => res.json({ clients: clients.length }));

const PORT = 3000;

let clients = [];
let facts = [];

app.listen(PORT, () => {
  console.log(`Facts Events service listining at http://localhost:${PORT}`);
});

subscriber.on('connect', () => { 
    // can also accept objects in the form {'topic': qos} 
  subscriber.subscribe(topicName, (err, granted) => { 
      if(err) { 
          console.log(err, 'err'); 
      } 
      console.log(granted, 'granted') 
  }) 
  subscriber.subscribe(topicName1, (err, granted) => { 
      if(err) { 
          console.log(err, 'err'); 
      } 
      console.log(granted, 'granted') 
  }) 
  subscriber.subscribe(topicName2, (err, granted) => { 
      if(err) { 
          console.log(err, 'err'); 
      } 
      console.log(granted, 'granted') 
  }) 
})

subscriber.on('message', (topic, message, packet) => { 
    // console.log(packet, packet.payload.toString()); 
    if(topic === topicName) { 
     console.log("Topic 1: ", message.toString()); 
    } 
    if(topic === topicName1) { 
     console.log("Topic 2: ", message.toString()); 
    } 
    if(topic === topicName2) { 
     console.log("Topic 3: ", message.toString()); 
    } 
}) 


function eventsHandler(req, res, next) {
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };

    res.writeHead(200, headers);

    const data = `data: ${JSON.stringify(facts)}\n\n`;

    res.write(data);

    const clientId = Date.now();

    const newClient ={
        id: clientId,
        res
    };

    clients.push(newClient);
    
    req.on('close', () => {
        console.log(`${clientId} Connection closed`);
        clients = clients.filter(client => client.id != clientId);
    });

}

app.get('/events', eventsHandler);

function sendEventsToAll(newFact) {
    
    clients.forEach(client => {
        console.log("Client response ", client.res);
        client.res.write(`data: ${JSON.stringify(newFact)}\n\n`);
    });
}

async function addFact(req, res, next) {
    const newFact = req.body;
    facts.push(newFact);
    res.json(newFact);
    return sendEventsToAll(newFact);
}

app.post('/facts', addFact);