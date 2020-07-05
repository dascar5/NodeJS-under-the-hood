//console.log(arguments);
//console.log(require("module").wrapper);
//'(function (exports, require, module, __filename, __dirname))
//ovo node interno koristi

//module.exports
const C = require("./test-module-1"); //importujemo kalkulator (cijelu klasu,fajl)
const calc1 = new C();
console.log(calc1.add(2, 5));

//exports
//const calc2 = require("./test-module-2");//importujemo eksportovane funkcije (add,multiply,divive)
//console.log(calc2.add(2, 5));
const { add } = require("./test-module-2");
console.log(add(2, 5));

//caching
require("./test-module-3")();
require("./test-module-3")();
require("./test-module-3")();

//hello (top level) se loguje samo jednom, a ova funkcija 3 puta (jednom se pokrece, ali se ove 3 instance vade iz cachinga)
