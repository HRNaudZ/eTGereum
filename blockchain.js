var sha256 = require("crypto-js/sha256");
var EC = require("elliptic").ec;
const ec = new EC("secp256k1");

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
    return this.hash;
  }
  mineBlock(difficulty){
    while(this.hash.substr(0, difficulty)!=new Array(parseInt(difficulty)).fill("0").join("")){
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
  calculateHash(){
    this.hash = sha256(this.fromAddress + this.toAddress + this.amount +this.fees).toString();
    return this.hash;
  }
  signTransaction(signKey){
    if(signKey.getPublic('hex').toString()!=this.fromAddress){
      return false;
    }
    const txHash = this.calculateHash();
    const sig = signKey.sign(txHash, 'base64');
    this.signature = sig.toDER('hex');
  }
  isValid(){
    if(this.fromAddress=="eTGereum") return true;
    if(!this.signature || this.signature.length==0) return false;
    const key = ec.keyFromPublic(this.fromAddress, 'hex');
    return key.verify(this.calculateHash(), this.signature);
  }
}

class Blockchain {
  constructor() {
    this.chain = [];
    this.difficulty = 4;
    this.pendingTransactions = [];
    this.xofValue = 500.67;
  }
  createGenesisBlock(trx){
    var genesisBlock = new Block(trx, "0");
    genesisBlock.calculateHash();
    this.chain.push(genesisBlock);
  }
  addTransaction(trx){
    if(trx.isValid()){
      this.pendingTransactions.push(trx);
      console.log("Transaction just submited to blockchain")
      return true;
    }else{
      console.log("Invalid Transaction not submited to blockchain")
      return false;
    }
  }
  addNewBlock(block){
    block.nonce--;
    if(block.hash!=block.calculateHash()){
      return false;
    }
    if(block.prevHash!=this.chain[this.chain.length-1].hash){
      return false;
    }
    if(block.transaction!=this.pendingTransactions[0]){
      return false;
    }

    this.chain.push(block);
    return true;
  }
  startMining(minerAddress){
      if(this.pendingTransactions.length==0){
        return;
      }
      var trx = this.pendingTransactions[0];
      if(trx.fromAddress!="eTGereum"){
            trx.applyFees(this.getFeesPercentage());
      }
      var block = new Block(trx, this.chain[this.chain.length - 1].hash);
      if(trx.fromAddress=="eTGereum"){
        block.mineBlock(this.difficulty/2);
      }else{
        block.mineBlock(this.difficulty);
      }

      if(this.addNewBlock(block)){
        this.pendingTransactions = this.pendingTransactions.slice(1);
        if(trx.fromAddress!="eTGereum"){
              this.pendingTransactions.unshift(new Transaction("eTGereum",minerAddress, trx.fees));
        }
        this.startMining(minerAddress);
      }
  }
  getBalance(address){
    var balance = 0;
    this.chain.forEach((block, index) => {
      if(block.transaction.toAddress==address){
        balance+= block.transaction.amount;
      }else if(block.transaction.fromAddress==address){
        balance-= block.transaction.amount;
        balance-= block.transaction.fees;
      }
    });
    return balance;
  }
  getFeesPercentage(){
    console.log(0.1 * 17/this.xofValue)
    return 0.1 * 17/this.xofValue;
  }
  getBlocks(){
    return this.chain;
  }
}

class Wallet {
  constructor(username, blockchain) {
    this.username = username;
    this.key = ec.genKeyPair();
    this.publicKey = this.key.getPublic("hex");
    this.privateKey = this.key.getPrivate("hex");
    this.blockchain = blockchain;
  }
  getPublicKey(){
    return this.publicKey;
  }
  getPrivateKey(){
    return this.privateKey;
  }
  createTransaction(toAddress, amount){
    const trx = new Transaction(this.publicKey, toAddress, amount);
    trx.signTransaction(this.key);
    if(this.blockchain.addTransaction(trx)){
      console.log("Transaction submited to blockchain");
    }else{
      console.log("Invalid transaction not submited to blockchain");
    }
  }
  getBalance(blockchain){
    this.blockchain = blockchain;
    console.log(this.username+" : "+this.blockchain.getBalance(this.publicKey));
  }
}

module.exports = {Block, Transaction, Blockchain, Wallet};
