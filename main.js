const {Block, Transaction, Blockchain} = require("./blockchain.js");

const eTGereum = new Blockchain();

eTGereum.createGenesisBlock();

eTGereum.createTransaction(new Transaction("eTGereum", "doe", 2000));
eTGereum.createTransaction(new Transaction("doe", "mike", 2000));
eTGereum.createTransaction(new Transaction("mike", "jane", 800));
eTGereum.createTransaction(new Transaction("jane", "doe", 200));
eTGereum.createTransaction(new Transaction("doe", "mike", 100));

eTGereum.startMining();

console.log(eTGereum.getBalance("joseph"));
