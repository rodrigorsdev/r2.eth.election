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

    function createElection(
        string memory _name,
        uint _numberOfCandidates
    ) public
      returns (uint idElection)
    {
        _electionId ++;
        _elections[_electionId] = ElectionPattern(_electionId, _name, _numberOfCandidates);
        emit electionCreated(_electionId);
    }

    function listElections(
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
        uint _electionId,
        string[] memory _candidatesName
    ) public 
      returns (address contractId)
    {
        require(_elections[_electionId].id != 0 , 'invalid election');
        ElectionPattern memory _electionPattern = _elections[_electionId];
        require(_candidatesName.length == _electionPattern.numberOfCandidates, 'invalid number of candidates');
        Election _instance = new Election(_candidatesName);
        address _instanceAddress = address(_instance);
        _electionsInstance[msg.sender].push(_instanceAddress);
        return _instanceAddress;
    }
}