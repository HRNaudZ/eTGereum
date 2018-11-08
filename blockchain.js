var sha256 = require("crypto-js/sha256");
class Block {
  constructor(trx, prevHash) {
    this.timestamp = Date.now();
    this.transaction = trx;
    this.prevHash = prevHash;
    this.nonce = 0;
    this.hash = "";
  }
  calculateHash(){
    this.nonce++;
    this.hash = sha256(this.timestamp + this.transaction + this.prevHash + this.nonce).toString();
  }
  mineBlock(difficulty){
    while(this.hash.substr(0, difficulty)!=new Array(difficulty).fill("0").join("")){
      this.calculateHash();
    }
    console.log(this.hash+"\n");
  }
}

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
    this.fees = 0;
  }
  applyFees(feesPercentage){
    this.fees = this.amount * feesPercentage;
    this.amount -= this.fees;
  }
}

class Blockchain {
  constructor() {
    this.chain = [];
    this.difficulty = 3;
    this.pendingTransacttions = [];
    this.xofValue = 500.67;
  }
  createGenesisBlock(){
    var genesisBlock = new Block("Genesis Transaction", "0");
    genesisBlock.calculateHash();
    this.chain.push(genesisBlock);
    console.log(genesisBlock)
  }
  createTransaction(trx){
    this.pendingTransacttions.push(trx);
  }
  startMining(){
    this.pendingTransacttions.forEach((trx, index) =>{
      trx.applyFees(this.getFeesPercentage());
      var block = new Block(trx, this.chain[this.chain.length - 1].hash);
      block.mineBlock(this.difficulty);
      this.chain.push(block);
    })
  }
  getBalance(address){
    var balance = 0;
    this.chain.forEach((block, index) => {
      if(block.transaction.toAddress==address){
        balance+= block.transaction.amount;
      }else if(block.transaction.fromAddress==address){
        balance-= block.transaction.amount;
      }
    });
    return balance;
  }
  getFeesPercentage(){
    return 0.1 * 17/this.xofValue;
  }
}

module.exports = {Block, Transaction, Blockchain};
