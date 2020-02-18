pragma solidity 0.5.12;
pragma experimental ABIEncoderV2;

contract Election {

    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    mapping(uint => Candidate) public _candidates;
    uint private _candidatesCount;

    mapping(address => bool) private _voters;

    event voted (
        uint _candidateId
    );

    constructor (
        string[] memory _candidatesName
    ) public
    {
        for(uint i = 0; i< _candidatesName.length; i ++){
            addCandidate(_candidatesName[i]);
        }
    }

    function addCandidate(
        string memory _name
    ) internal
    {
        _candidatesCount ++;
        _candidates[_candidatesCount] = Candidate(_candidatesCount, _name, 0);
    }

    function listCandidates(
    ) public 
      view
      returns (uint[] memory, string[] memory, uint[] memory)
    {
        uint[] memory _ids = new uint[](_candidatesCount);
        string[] memory _names = new string[](_candidatesCount);
        uint[] memory _votes = new uint[](_candidatesCount);

        uint j = 0;

        for(uint i = 1; i <= _candidatesCount; i++){
            _ids[j] = _candidates[i].id;
            _names[j] =_candidates[i].name;
            _votes[j] =_candidates[i].voteCount;
            
            j ++;
        }

        return (_ids, _names, _votes);
    }

    function vote(
        uint _candidateId
    ) public
    {
        require(!_voters[msg.sender], 'already voted');
        require(_candidateId > 0 && _candidateId <= _candidatesCount, 'invalid candidate');

        _voters[msg.sender] = true;

        _candidates[_candidateId].voteCount ++;

        emit voted(_candidateId);
    } 
}