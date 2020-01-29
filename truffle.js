var HDWalletProvider = require('truffle-hdwallet-provider');
const mnemonic = require('./mnemonic.json');

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(
          mnemonic,
          'https://ropsten.infura.io/v3/2664005d62824c79ae6ae739a52610f9'
        );
      },
      network_id: 3,
      gas: 4000000      //make sure this gas allocation isn't over 4M, which is the max
    }
  }
};
