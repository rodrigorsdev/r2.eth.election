pragma solidity 0.5.12;
pragma experimental ABIEncoderV2;

import "./Election.sol";

contract ElectionFactory {

    struct ElectionPattern {
        uint id;
        string name;
        uint numberOfCandidates;
    }

    mapping(address => address[]) private _electionsInstance;

    mapping(uint => ElectionPattern) private _elections;
    uint private _electionId;

    event electionCreated(uint idElection);
    event electionStarted(address addressElection);

    function createElectionPattern(
        string memory _name,
        uint _numberOfCandidates
    ) public
    {
        _electionId ++;
        _elections[_electionId] = ElectionPattern(_electionId, _name, _numberOfCandidates);
        emit electionCreated(_electionId);
    }

    function listElectionsPatterns(
    ) public
      view
      returns (uint[] memory ids, string[] memory names, uint[] memory numberOfCandidates)
    {
        uint[] memory _ids = new uint[](_electionId);
        string[] memory _names = new string[](_electionId);
        uint[] memory _numberOfCandidates = new uint[](_electionId);

        uint j = 0;

        for(uint i = 1; i <= _electionId; i++){
            _ids[j] = _elections[i].id;
            _names[j] =_elections[i].name;
            _numberOfCandidates[j] =_elections[i].numberOfCandidates;
            
            j ++;
        }

        return (_ids, _names, _numberOfCandidates);
    }

    function startElection(
        uint electionId,
        string[] memory candidatesName
    ) public
    {
        require(_elections[electionId].id != 0 , 'ElectionFactory: invalid election');
        ElectionPattern memory electionPattern = _elections[electionId];
        require(candidatesName.length == electionPattern.numberOfCandidates, 'ElectionFactory: invalid number of candidates');
        Election instance = new Election(candidatesName);
        address instanceAddress = address(instance);
        _electionsInstance[msg.sender].push(instanceAddress);
        emit electionStarted(instanceAddress);
    }

    function getElectionInstancesAddressesByOwnerAddress(
        address ownerAddress
    ) public
      view
      returns (address[] memory)
    {
        return _electionsInstance[ownerAddress];
    }
}