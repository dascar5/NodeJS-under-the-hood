const EventEmitter = require("events");
//built in event node module
const http = require("http");

class Sales extends EventEmitter {
  constructor() {
    super();
  }
}
//ovdje smo napravili parent klasu koja extenduje superklasu EventEmitter i iz nje uzima sve

const myEmitter = new Sales();

//recimo da pravimo online radnju
//emitujemo event zvani newSale

myEmitter.on("newSale", () => {
  console.log("There was a new sale!");
});

myEmitter.on("newSale", () => {
  console.log("Costumer name: Jonas");
});

myEmitter.on("newSale", (stock) => {
  console.log(`There are now ${stock} items left in stock.`);
});

myEmitter.emit("newSale", 9);
//newSale se desilo, i onda oni listeneri gore reaguju sa console logovima

/////////////////////////////

const server = http.createServer();

server.on("request", (req, res) => {
  console.log("Request received!");
  console.log(req.url);
  res.end("Request received!");
});

server.on("request", (req, res) => {
  console.log("Another request!");
});

server.on("close", () => {
  console.log("Server closed!");
});

//kazemo serveru da na "request" odgovori sa request received, a za close sa server closed
//sad moramo zapoceti server

server.listen(8000, "127.0.0.1", () => {
  console.log("Waiting for requests...");
});
//sad kad udjemo na localhost i otvorimo ovaj server (damo request) radicemo sto mu kazemo
//server moze da ima samo jedan response
//dobijam duple rezultate u terminal jer browseri automatski requestuju / (root) i favicon
