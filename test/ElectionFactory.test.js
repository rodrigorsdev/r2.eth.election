const Assert = require('truffle-assertions');
const Artifact = artifacts.require('../contracts/ElectionFactory');

contract('ElectionFactory', accounts => {

  let contractInstance;
  const ownerAddress = accounts[0];

  before(async () => {
    web3.eth.defaultAccount = ownerAddress;
  });

  beforeEach(async () => {
    contractInstance = await Artifact.new();
  });

  describe('createElection', () => {
    it('success', async () => {
      const expectedName = 'Election1';
      const expectedNumberOfCandidates = 2;

      const result = await contractInstance.createElection(expectedName, expectedNumberOfCandidates);

      Assert.eventEmitted(
        result,
        'electionCreated',
        event => event.idElection > 0);
    });
  });

  describe('startElection', () => {
    it('should throw if election pattern is invalid', async () => {
      const expectedElectionName = 'Election1';
      const expectedElectionNumberOfCandidates = 2;

      const resultCreateElection = await contractInstance.createElection(expectedElectionName, expectedElectionNumberOfCandidates);

      await Assert.reverts(
        contractInstance.startElection(
          10,
          ['candidate1', 'candidate2']
        ),
        'ElectionFactory: invalid election'
      );
    });

    it('should throw is names of candidates length is different from election pattern', async () => {
      const expectedElectionName = 'Election1';
      const expectedElectionNumberOfCandidates = 2;

      await contractInstance.createElection(expectedElectionName, expectedElectionNumberOfCandidates);

      await Assert.reverts(
        contractInstance.startElection(
          1,
          ['candidate1']
        ),
        'ElectionFactory: invalid number of candidates'
      );
    });

    it('create election success', async () => {
      const expectedElectionName = 'Election1';
      const expectedElectionNumberOfCandidates = 2;

      await contractInstance.createElection(expectedElectionName, expectedElectionNumberOfCandidates);
      const startElectionResult = await contractInstance.startElection(
        1,
        ['candidate1', 'candidate2'],
        { from: ownerAddress }
      );

      const getElectionInstancesAddressesByOwnerAddressResult = await contractInstance.getElectionInstancesAddressesByOwnerAddress(ownerAddress);
  
      Assert.eventEmitted(
        startElectionResult,
        'electionStarted',
        event => event.addressElection == getElectionInstancesAddressesByOwnerAddressResult[0]);
    });
  });
});