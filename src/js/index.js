import ElectionFactory from '../../build/contracts/ElectionFactory.json';

import { initEthers, setConnectedAccount } from './connection/ethers';
import { initEthersContract } from './connection/contract';

import { registerElectionPatternsElements, listElectionPatterns, clearElectionPatternForm, electionPatternFormSubmit } from './factory/electionPatterns';

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

const registerElements = () => {
    $connectedAddress = document.getElementById('connectedAddress');

    $electionPatternsTable = document.getElementById('electionPatternsTable');
    $addElectionPatternForm = document.getElementById('addElectionPattern');
    $electionPatternsMessageSuccess = document.getElementById('addElectionPattern-result-success');
    $electionPatternsMessageSuccessText = document.getElementById('addElectionPattern-result-success-text');
    $electionPatternsMessageDanger = document.getElementById('addElectionPattern-result-danger');
    $electionPatternsMessageDangerText = document.getElementById('addElectionPattern-result-danger-text');
    $electionPatternsFormSubmitButton = document.getElementById('addElectionPattern-submit-button');
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
        await listElectionPatterns();
        clearElectionPatternForm();
        await electionPatternFormSubmit();

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