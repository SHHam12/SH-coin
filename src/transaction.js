const CryptoJS = require("crypto-js")
  elliptic = require("elliptic"),
  utils = require("./utils");

const ec = new elliptic.ec("secp256k1");

class TxOut { // transaction output
  constructor(address, amount) {
    this.address = address;
    this.amount = amount;
  }
}

class TxIn { // transaction input
  // uTxOutId
  // uTxOutIndex
  // Signature
}

class Transaction {
  // ID
  // txIns[]
  // txOuts[]
}

class UTxOut { // unspend transaction output
  constructor(txOutId, txOutIndex, address, amount) {
    this.txOutId = txOutId;
    this.txOutIndex = txOutIndex;
    this.address = address;
    this.amount = amount;
  }
}

let uTxOuts = [];

const getTxId = tx => {
  const txInContent = tx.txIns
    .map(txIn => txIn.uTxOutId + txIn.txOutIndex)
    .reduce((a, b) => a + b, "");

  const txOutContent = tx.txOuts
    .map(txOut => txOut.address + txOut.amount)
    .reduce((a, b) => a + b, "");
  return CryptoJS.SHA256(txInContent + txOutContent).toString();
};

const findUTxOut = (txOutId, txOutIndex, uTxOutList) => {
  return uTxOutList.find(
    uTxOut => uTxOut.txOutId === txOutId && uTxOut.txOutIndex === txOutIndex
  );
};

const signTxIn = (tx, txInIndex, privateKey, uTxOut) => {
  const txIn = tx.txIns[txInIndex];
  const dataToSign = tx.id;
  const referencedUTxOut = findUTxOut(txIn.txOutId, tx.txOutIndex, uTxOuts);
  if (referencedUTxOut === null) {
    return;
  }
  const key = ec.keyFromPrivate(privateKey, "hex");
  const signature = utils.toHexString(key.sign(dataToSign).toDER());
  return signature;
};

const updateUTxOuts = (newTxs, uTxOutList) => {
  const newUTxOuts = newTxs
    .map(tx => {
      tx.txOuts.map((txOut, index) => {
        new UTxOut(tx.id, index, txOut.address, txOut.amount);
      });
    })
    .reduce((a, b) => a.contact(b), []);

  const spendTxOuts = newTxs
    .map(tx => tx.txIns)
    .reduce((a, b) => a.concat(b), [])
    .map(txIn => new UTxOut(txIn, txOutId, txIn.txOutIndex, "", 0));

  const resultingUTxOuts = uTxOutList.filter(
    uTxO => !findUTxOut(uTxO.txOutId, uTxO.txOutIndex, spendTxOuts))
    .concat(newUTxOuts);

  return resultingUTxOuts;
};

/*
[A, B, C, D, E, F, G]

A(40) ---> TRANSACTION  ----> ZZ(10)
                        ----> MM(30)

[(), B, C, D, E, F, G, ZZ, MM]
*/


const isTxInStructureValid = (txIn) => {
  if(txIn === null){
    console.log("The txIn appears to be null")
    return false;
  } else if(typeof txIn.signature !== "string"){
    console.log("The txIn doesn't have a valid signature")
    return false;
  } else if(typeof txIn.txOutId !== "string"){
    console.log("The txIn doesn't have a valid txOutId")
    return false;
  } else if(typeof txIn.txOutIndex !== "number"){
    console.log("The txIn doesn't have a valid txOutIndex")
    return false;
  } else {
    return true;
  }
}

const isAddressValid = (address) => {
  if(address.length !== 130){
    return false;
  } else if(address.match("^[a-fA-F0-9]+$") === null){
    return false
  } else if(!address.startsWith("04")){
    return false;
  } else {
    return true;
  }
}

const isTxOutStructureValid = (txOut) => {
  if(txOut === null){
    return false;
  } else if(typeof txOut.address !== "string"){
    return false;
  } else if(!isAddressValid(txOut.address)){
    return false;
  } else if(typeof txOut.amount !== "number"){
    return false;
  } else {
    return true;
  }
}

const isTxStructureValid = tx => {
  if (typeof tx.id !== "string") {
    console.log("Tx ID is not valid");
    return false;
  } else if (!(tx.txIns instanceof Array)) {
    console.log("The txIns are not an array");
    return false;
  } else if(){
    console.log("The structure of one of the txIn is not valid")
    return false;
  } else if(!(tx.txOuts instanceof Array)){
    console.log("The txOuts are not an array")
    return false;
  } else if(){
    console.log("The structure of one of the txOut is not valid")
    return false;
  } else {
    return true
  }
};