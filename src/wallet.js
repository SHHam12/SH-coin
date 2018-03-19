const elliptic = require("elliptic"),
  path = require("path"),
  fs = require("fs");

const ec = new elliptic.ec("secp256k1");

const privateKeyLoaction = path.join(__dirname, "privateKey");

const generatePrivateKey = () => {
  const keyPair = ec.genKeyPair();
  const privateKey = keyPair.getPrivate();
  return privateKey.toString(16);
};

const initWallet = () => {
  if (fs.existsSync(privateKeyLoaction)) {
    return;
  }
  const newPrivateKey = generatePrivateKey();

  fs.writeFileSync(privateKeyLoaction, newPrivateKey);
};

module.exports = {
  initWallet
};