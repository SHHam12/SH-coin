const express = require("express"),
  bodyParser = require("body-parser"),
  morgan = require("morgan"),
  BlockChain = require("./blockchain");

const { getBlockchain, createNewBlock } = BlockChain;

const PORT = 3000;

const app = express();
app.use(bodyParser.json());
app.use(morgan("combine"));
app.listen(PORT, () => console.log(`SH-coin Server is running on ${PORT}`));