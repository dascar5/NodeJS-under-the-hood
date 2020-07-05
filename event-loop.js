const fs = require("fs");
const crypto = require("crypto"); //sad nam treba nesto kompleksno kao kriptografija da se offloaduje na thread pool

const start = Date.now(); //koristimo da vidimo koliko je vremena proslo od pokretanja eventloop.js pa do crypta gdje se zavrsava
process.env.UV_THREADPOOL_SIZE = 4; //za podesavanja broja threadova koje koristi thread pool, 4 je default

setTimeout(() => console.log("Timer 1 finished"), 0); //expire odma
setImmediate(() => console.log("Immediate 1 finished")); //ne treba tajmer jer je immediate

fs.readFile("./test-file.txt", () => {
  console.log("I/O finished"); //file read je io task
  console.log("------------------------------------------");

  setTimeout(() => console.log("Timer 2 finished"), 0);
  setTimeout(() => console.log("Timer 3 finished"), 3000);
  setImmediate(() => console.log("Immediate 2 finished"));
  //sad smo ove dvije stavili u callback

  process.nextTick(() => console.log("Process.nextTick"));
  //next tick je prva executed posle strelice jer je microtask koji se pokrece posle svake zavrsene faze (prve)
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
  });
  //kompleksni callback sa enkripcijom za offload x 4
});

console.log("Hello from the top level code");
//sve je ovo callback sem 10ta linija
//u event loop se prvo top level code pokrece (sve van callbacks =>)
//ovo je rezultat
/*
Hello from the top level code
Timer 1 finished
Immediate 1 finished
I/O finished
------------------------------------------
Immediate 2 finished
Timer 2 finished
Timer 3 finished
*/
//sve iznad crte je van event loopa, sve ispod je u
//zasto se setimmediate pojavljuje prije timer2(0) i ako je setimmediate treci po procesima?
//procesi idu ovako: expired timer callbacks, I/O polling and callbacks, setImmediate callbacks, close callbacks
//event loop ceka da se nesto desi u poll fazi, nemamo io callbacks, pa odma ide na immediate

/*
1192 Password encrypted
1230 Password encrypted
1402 Password encrypted
1708 Password encrypted
*/
//one 4 callback crypto funkcije su se skoro u isto vrijeme zavrsile jer offthread ima 4 threada (thread loop)
//ako stavimo threadpool size da je 1, prvo ce se zavrsit prva, pa timer 3, pa ostale 3, jer su dosta sporije
