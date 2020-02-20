import ElectionFactory from '../../build/contracts/ElectionFactory.json';
import Election from '../../build/contracts/Election.json';

import { initEthers, setConnectedAccount } from './connection/ethers';
import { initEthersContract } from './connection/contract';

import { registerElectionInstanceElements, clearElectionInstanceForm, loadPatternDorpDown, electionInstanceFormSubmit, loadContractInstanceAddressDropDown, voteAddressSelected, clearVoteForm, voteFormSubmit } from './election/electionInstance';
import { registerElectionPatternsElements, loadElectionPatternTable, clearElectionPatternForm, electionPatternFormSubmit } from './factory/electionPatterns';

let ethers;
let contractInstance;

let $connectedAddress;

let $electionPatternsTable;
let $addElectionPatternForm;
let $electionPatternsMessageSuccess;
let $electionPatternsMessageSuccessText;
let $electionPatternsMessageDanger;
let $electionPatternsMessageDangerText;
let $electionPatternsFormSubmitButton;

let $createElectionPatternSelect;
let $createElectionInstanceForm;
let $createElectionInstanceMessageSuccess;
let $createElectionInstanceMessageSuccessText;
let $createElectionInstanceMessageDanger;
let $createElectionInstanceMessageDangerText;
let $createElectionInstanceFormSubmitButton;
let $electionInstanceAddressSelect;
let $electionCandidatesTable;
let $voteForm;
let $voteMessageSuccess;
let $voteMessageSuccessText;
let $voteMessageDanger;
let $voteMessageDangerText;

const registerElements = () => {
    $connectedAddress = document.getElementById('connectedAddress');

    $electionPatternsTable = document.getElementById('electionPatternsTable');
    $addElectionPatternForm = document.getElementById('addElectionPattern');
    $electionPatternsMessageSuccess = document.getElementById('addElectionPattern-result-success');
    $electionPatternsMessageSuccessText = document.getElementById('addElectionPattern-result-success-text');
    $electionPatternsMessageDanger = document.getElementById('addElectionPattern-result-danger');
    $electionPatternsMessageDangerText = document.getElementById('addElectionPattern-result-danger-text');
    $electionPatternsFormSubmitButton = document.getElementById('addElectionPattern-submit-button');

    $createElectionPatternSelect = document.getElementById('createElectionPattern');
    $createElectionInstanceForm = document.getElementById('createElectionInstance');
    $createElectionInstanceMessageSuccess = document.getElementById('createElectionInstance-result-success');
    $createElectionInstanceMessageSuccessText = document.getElementById('createElectionInstance-result-success-text');
    $createElectionInstanceMessageDanger = document.getElementById('createElectionInstance-result-danger');
    $createElectionInstanceMessageDangerText = document.getElementById('createElectionInstance-result-danger-text');
    $createElectionInstanceFormSubmitButton = document.getElementById('createElectionInstance-submit-button');
    $electionInstanceAddressSelect = document.getElementById('electionInstanceAddress');
    $electionCandidatesTable = document.getElementById('electionCandidatesTable');

    $voteForm = document.getElementById('vote');
    $voteMessageSuccess = document.getElementById('vote-result-success');
    $voteMessageSuccessText = document.getElementById('vote-result-success-text');
    $voteMessageDanger = document.getElementById('vote-result-danger');
    $voteMessageDangerText = document.getElementById('vote-result-danger-text');
};

const init = async () => {
    try {
        setConnectedAccount(ethers, $connectedAddress);

        registerElectionPatternsElements(
            $electionPatternsTable,
            $addElectionPatternForm,
            $electionPatternsMessageSuccess,
            $electionPatternsMessageSuccessText,
            $electionPatternsMessageDanger,
            $electionPatternsMessageDangerText,
            $electionPatternsFormSubmitButton,
            contractInstance
        );
        await loadElectionPatternTable();
        clearElectionPatternForm();
        await electionPatternFormSubmit();

        registerElectionInstanceElements(
            $createElectionPatternSelect,
            $createElectionInstanceForm,
            $createElectionInstanceMessageSuccess,
            $createElectionInstanceMessageSuccessText,
            $createElectionInstanceMessageDanger,
            $createElectionInstanceMessageDangerText,
            $createElectionInstanceFormSubmitButton,
            $electionInstanceAddressSelect,
            $electionCandidatesTable,
            $voteForm,
            $voteMessageSuccess,
            $voteMessageSuccessText,
            $voteMessageDanger,
            $voteMessageDangerText,
            Election,
            ethers,
            contractInstance
        );
        clearElectionInstanceForm();
        await loadPatternDorpDown();
        await electionInstanceFormSubmit();
        await loadContractInstanceAddressDropDown();
        voteAddressSelected();
        clearVoteForm();
        await voteFormSubmit();

    } catch (err) {
        console.error(err.message);
    }
};

const mmAccountChanged = async () => {
    await initDapp();
};

const initDapp = async () => {

    registerElements();

    ethers = await initEthers(mmAccountChanged);

    contractInstance = initEthersContract(
        ethers,
        ElectionFactory.abi,
        ElectionFactory.networks[Object.keys(ElectionFactory.networks)[0]].address);

    await init();
};

document.addEventListener('DOMContentLoaded', async () => {
    await initDapp();
});