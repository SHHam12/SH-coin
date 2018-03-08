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

const getBlockchain = () => blockchain;

const createHash = (index, previousHash, timestamp, data) => 
  CryptoJS.SHA256(
    index + previousHash + timestamp + JSON.stringify(data)
  ).toString();

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

const getBlockHash = (block) => 
  createHash(block.index, block.previousHash, block.timestamp, block.data);

const isNewBlockValid = (candidateBlock, lastestBlock) => {
  if (!isNewStructureValid(candidateBlock)) {
    console.log("The candidate block  structure is not valid");
    return false;
  } else if (lastestBlock.index + 1 !== candidateBlock.index) {
      console.log("The candidate block does not have a valid index");
      return false;
  } else if (lastestBlock.hash !== candidateBlock.previousHash) {
    console.log(
      "The previousHash of the candidate block is not the hash of the lastest block"
    );
    return false;
  } else if (getBlockHash(candidateBlock) !== candidateBlock.hash) {
    console.log('The hash of this block is invalid'); 
    return false;
  }
  return true;
};

const isNewStructureValid = (block) => {
  return (
    typeof block.index === "number" && 
    typeof block.hash === "string" &&
    typeof block.previousHash === "string" &&
    typeof block.timestamp === "number" &&
    typeof block.data === "string"
  );
};

const isChainValid = (candidateChain) => {
  const isGenesisValid = block => {
    return JSON.stringify(block) === JSON.stringify(genesisBlock);
  };
  if (!isGenesisValid(candidateChain[0])) {
    console.log(
      "The candidateChains's genesisBlock is not the same as our genesisBlock"
    );
    return false;
  }
  for(let i = 1; i < candidateChain.length; i ++) {
    if (!isNewBlockValid(candidateChain[i], candidateChain[i - 1])) {
        return false;
    }
  }
  return true;
};

const replaceChain = candidateChain => {
  if (
    isChainValid(candidateChain) && 
    candidateChain.length > getBlockchain().length
  ) {
    blockchain = candidateChain;
    return true;
  } else {
    return false;
  }
};

const addBlockToChain = newBlock => {
  if (isNewBlockValid(newBlock, getLastBlock())) {
    getBlockchain().push(candidateBlock);
    return true;
  } else {
    return false;
  }
};