const Migrations = artifacts.require("ElectionFactory");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
