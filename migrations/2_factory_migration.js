const Migrations = artifacts.require("Factory");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
