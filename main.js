const {Block, Transaction, Blockchain} = require("./blockchain.js");

const eTGereum = new Blockchain();

eTGereum.createGenesisBlock();
console.log(eTGereum.getBalance("doe"));

eTGereum.createTransaction(new Transaction("doe", "mike", 2000));
eTGereum.createTransaction(new Transaction("mike", "jane", 800));
eTGereum.createTransaction(new Transaction("jane", "doe", 200));
eTGereum.createTransaction(new Transaction("doe", "mike", 100));

eTGereum.startMining("jake");

console.log(eTGereum.getBalance("doe"));
console.log(eTGereum.getBalance("mike"));
console.log(eTGereum.getBalance("jane"));
console.log(eTGereum.getBalance("jake")+"\n\n\n");
//console.log(eTGereum.getBlocks());
