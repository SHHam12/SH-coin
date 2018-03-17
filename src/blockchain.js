const CryptoJS = require("crypto-js"),
  hexToBinary = require("hex-to-binary");

class Block {
  constructor(index, hash, previousHash, timestamp, data, difficulty, nonce) {
    this.index = index;
    this.hash = hash;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = data;
    this.difficulty = difficulty;
    this.nonce = nonce;
  }
}

const genesisBlock = new Block(
  0,
  "d7fe651764cd6b9a2488b8fa07ee8c80733f79068937e68fc0f9b8481361ad61",
  null,
  1520465646.297,
  "This is the genesis~",
  0,
  0
);

let blockchain = [genesisBlock];

const getNewestBlock = () => blockchain[blockchain.length - 1];

const getTimestamp = () => new Date().getTime() / 1000;

const getBlockchain = () => blockchain;

const createHash = (index, previousHash, timestamp, data, difficulty, nonce) => 
  CryptoJS.SHA256(
    index + previousHash + timestamp + JSON.stringify(data) + difficulty + nonce
  ).toString();

const createNewBlock = data => {
  const previousBlock = getNewestBlock();
  const newBlockIndex = previousBlock.index + 1;
  const newTimestamp = getTimestamp();
  const newBlock = findBlock(
    newBlockIndex,
    previousBlock.hash,
    newTimestamp,
    data,
    20g
  );
  addBlockToChain(newBlock);
  require("./p2p").broadcastNewBlock();
  return newBlock;
};

const findBlock = (index, previousHash, timestamp, data, difficulty) => {
  let nonce = 0;
  while(true){
    console.log("Current nonce", nonce);
    const hash = createHash(
      index,
      previousHash,
      timestamp,
      data,
      difficulty,
      nonce
    );
    // to do check amount of 0s (hash matches difficulty)
    if (hashMatchesDifficulty(hash, difficulty)) {
      return new Block(
        index, 
        hash, 
        previousHash, 
        timestamp, 
        data, 
        difficulty, 
        nonce
      );
    }
    nonce++
  }
}

const hashMatchesDifficulty = (hash, difficulty) => {
  const hashInBinary = hexToBinary(hash);
  const requireZeros = "0".repeat(difficulty);
  console.log("Trying difficulty:", difficulty, "with hash", hashInBinary);
  return hashInBinary.startsWith(requireZeros);
}

const getBlockHash = (block) => 
  createHash(block.index, block.previousHash, block.timestamp, block.data);

const isBlockValid = (candidateBlock, lastestBlock) => {
  if (!isBlockStructureValid(candidateBlock)) {
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

const isBlockStructureValid = (block) => {
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
    if (!isBlockValid(candidateChain[i], candidateChain[i - 1])) {
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

const addBlockToChain = candidateBlock => {
  if (isBlockValid(candidateBlock, getNewestBlock())) {
    getBlockchain().push(candidateBlock);
    return true;
  } else {
    return false;
  }
};

module.exports = {
  getBlockchain,
  createNewBlock,
  getNewestBlock,
  isBlockStructureValid,
  addBlockToChain,
  replaceChain
};