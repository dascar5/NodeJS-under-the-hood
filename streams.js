const fs = require("fs");
const server = require("http").createServer(); //odma mozemo create ovdje

server.on("request", (req, res) => {
  // prvo resenje
  /*fs.readFile("./starter/test-file.txt", (err, data) => {
    if (err) console.log(err);
    res.end(data);
    
//ovo uzima datu iz test fajla i gura je na server gdje je citamo
//problem sa ovim je sto ce node loadovati cijeli fajl pa ga tek staviti na klijent
  });*/
  //-----------------------------------------------------------
  //resenje 2 - Streams (backpressure je problem)
  /*const readable = fs.createReadStream("./starter/test-file.txt");
  readable.on("data", (chunk) => {
    res.write(chunk);
    //response je writable stream
  });
  readable.on("end", () => {
    res.end();
    //end metoda signalira da vise nema date za writable stream
  });
  readable.on("error", (err) => {
    console.log(err);
    res.statusCode = 500;
    res.end("File not found!");
  });*/
  //-------------------------------------------------------------
  //resenje 3 - konacno
  const readable = fs.createReadStream("./starter/test-file.txt");
  readable.pipe(res);
  //readable source -> pipe -> writeable destination
  //pipe izjednacava incoming-outcoming data speed
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening...");
});
