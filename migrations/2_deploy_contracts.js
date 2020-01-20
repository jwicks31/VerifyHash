var VerifyHash = artifacts.require("./VerifyHash.sol");

module.exports = function(deployer) {
  deployer.deploy(VerifyHash);
};
