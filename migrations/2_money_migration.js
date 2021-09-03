const money = artifacts.require("Money");

module.exports = function (deployer) {
  deployer.deploy(money);
};
