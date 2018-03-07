const CryptoJS = require("crypto-js");

class Block {
  constructor(index, hash, previousHash, timestamp, data){
    this.index =index;
    this.hash = hash;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = data;
  }
}

const genesisBlock = new Block(
  0,
  "d7fe651764cd6b9a2488b8fa07ee8c80733f79068937e68fc0f9b8481361ad61",
  null,
  1520465646.297,
  "This is the genesis~"
);

let blockchain = [genesisBlock];

const getLastBlock = () => blockchain[blockchain.length - 1];

const getTimestamp = () => new Date().getDate() / 1000;

const createHash = (index, previousHash, timestamp, data) => 
  CryptoJS.SHA256(index + previousHash + timestamp + data).toString();

const createNewBlock = data => {
  const previousBlock = getLastBlock();
  const newBlockIndex = previousBlock.index + 1;
  const newTimestamp = getTimestamp();
  const newHash = createHash(
    newBlockIndex,
    previousBlock.hash, 
    newTimestamp, 
    data
  );
  const newBlock = new Block(
    newBlockIndex,
    newHash,
    previousHash,
    newTimestamp,
    data
  );
  return newBlock;
};