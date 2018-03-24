const express = require("express"),
  _ = require("lodash"),
  bodyParser = require("body-parser"),
  morgan = require("morgan"),
  Blockchain = require("./blockchain"),
  P2P = require("./p2p"),
  Mempool = require("./mempool"),
  Wallet = require("./wallet");

const { 
  getBlockchain, 
  createNewBlock, 
  getAccountBalance, 
  sendTx,
  getUTxOutList
 } = Blockchain;
const { startP2PServer, connectToPeers } = P2P;
const { initWallet, getPublicFromWallet, getBalance } = Wallet;
const { getMempool } = Mempool;

const PORT = process.env.HTTP_PORT || 4000;

const app = express();
app.use(bodyParser.json());
app.use(morgan("combined"));

app
  .route("/blocks")
  .get((req, res) => {
    res.send(getBlockchain());
  })
  .post((req, res) => {
    const newBlock = createNewBlock();
    res.send(newBlock);
  });

app.post("/peers", (req, res) => {
  const { body: { peer } } = req;
  connectToPeers(peer);
  res.send();
});

app.get("/me/balance", (req, res) => {
  const balance = getAccountBalance();
  res.send({ balance });
});

app.get("/me/address", (req, res) => {
  res.send(getPublicFromWallet());
});

app.get("/blocks/:hash", (req, res) => {
  const { params: { hash } } = req;
  const block = _.find(getBlockchain(), { hash });
  if (block === undefined) {
    res.status(400).send("Block not found");
  } else {
    res.send(block);
  }
});

app.get("/transactions/:id", (req, res) => {
  const { params: { id} } = req;
  console.log(id);
  const transaction = _.find(getMempool(), { id });
  if (transaction === undefined) {
    res.status(400).send("Transaction not found");
  } else {
    res.send(transaction);
  }
});

app
  .route("/transactions")
  .get((req, res) => {
    res.send(getMempool());
  })
  .post((req, res) => {
    try {
      const { body: { address, amount } } = req;
      if (address === undefined || amount === undefined) {
        throw Error("Please specify and address and an amount");
      } else {
        const resPonse = sendTx(address, amount);
        res.send(resPonse);
      }
    } catch (e) {
      res.status(400).send(e.message);
    }
  });

app.get("/address/:address", (req, res) => {
  const { params: { address } } = req;
  const balance = getBalance(address, getUTxOutList());
  res.send({ balance });
});

const server = app.listen(PORT, () => 
  console.log(`SH-coin HTTP Server is running on port ${PORT}`)
);

initWallet();
startP2PServer(server);