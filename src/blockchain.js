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