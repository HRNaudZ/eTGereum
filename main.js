const {Block, Transaction, Blockchain, Wallet} = require("./blockchain.js");

const eTGereum = new Blockchain();

const royWallet = new Wallet("Roynoone", eTGereum);
const mikeWallet = new Wallet("Mike", eTGereum);
const janeWallet = new Wallet("Jane", eTGereum);

eTGereum.createGenesisBlock(new Transaction("eTGereum", royWallet.getPublicKey(), 20000));

royWallet.createTransaction(mikeWallet.getPublicKey(), 2000);
mikeWallet.createTransaction(janeWallet.getPublicKey(), 800);
janeWallet.createTransaction(royWallet.getPublicKey(), 200);
royWallet.createTransaction(mikeWallet.getPublicKey(), 100);

/*eTGereum.addTransaction(new Transaction("doe", "mike", 2000));
eTGereum.addTransaction(new Transaction("mike", "jane", 800));
eTGereum.addTransaction(new Transaction("jane", "doe", 200));
eTGereum.addTransaction(new Transaction("doe", "mike", 100));*/

eTGereum.startMining("jake");

console.log(royWallet.getBalance(eTGereum));
console.log(mikeWallet.getBalance(eTGereum));
console.log(janeWallet.getBalance(eTGereum));
console.log(eTGereum.getBalance("jake")+"\n\n\n");

console.log(eTGereum.getBlocks());
