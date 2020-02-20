import { listElectionPatterns } from '../factory/electionPatterns';
import { setMessage } from '../util/message';
import { initEthersContract } from '../connection/contract';
import { removeTableRow, addTableHeader, addTableRow, addRadio } from '../util/table';

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

let electionBuildJson;
let provider;
let contractInstance;
let electionContractInstance;

export const registerElectionInstanceElements = (
    _createElectionPatternSelect,
    _createElectionInstanceForm,
    _createElectionInstanceMessageSuccess,
    _createElectionInstanceMessageSuccessText,
    _createElectionInstanceMessageDanger,
    _createElectionInstanceMessageDangerText,
    _createElectionInstanceFormSubmitButton,
    _electionInstanceAddressSelect,
    _electionCandidatesTable,
    _voteForm,
    _voteMessageSuccess,
    _voteMessageSuccessText,
    _voteMessageDanger,
    _voteMessageDangerText,
    _electionBuildJson,
    _provider,
    _contractInstance
) => {
    $createElectionPatternSelect = _createElectionPatternSelect;
    $createElectionInstanceForm = _createElectionInstanceForm;
    $createElectionInstanceMessageSuccess = _createElectionInstanceMessageSuccess;
    $createElectionInstanceMessageSuccessText = _createElectionInstanceMessageSuccessText;
    $createElectionInstanceMessageDanger = _createElectionInstanceMessageDanger;
    $createElectionInstanceMessageDangerText = _createElectionInstanceMessageDangerText;
    $createElectionInstanceFormSubmitButton = _createElectionInstanceFormSubmitButton;
    $electionInstanceAddressSelect = _electionInstanceAddressSelect;
    $electionCandidatesTable = _electionCandidatesTable;
    $voteForm = _voteForm;
    $voteMessageSuccess = _voteMessageSuccess;
    $voteMessageSuccessText = _voteMessageSuccessText;
    $voteMessageDanger = _voteMessageDanger;
    $voteMessageDangerText = _voteMessageDangerText;
    electionBuildJson = _electionBuildJson;
    provider = _provider;
    contractInstance = _contractInstance;
};

export const clearElectionInstanceForm = () => {
    $createElectionInstanceForm.reset();
    $createElectionInstanceMessageSuccess.style.display = 'none';
    $createElectionInstanceMessageSuccessText.innerHTML = '';
    $createElectionInstanceMessageDanger.style.display = 'none';
    $createElectionInstanceMessageDangerText.innerHTML = '';
};

export const loadPatternDorpDown = async () => {
    for (var i = 0; i < $createElectionPatternSelect.length; i++) {
        $createElectionPatternSelect.remove(i);
    }

    let result = await listElectionPatterns();
    for (let i = 0; i < result.ids.length; i++) {
        let opt = document.createElement('option');
        opt.value = result.ids[i];
        opt.innerHTML = `${result.ids[i]}: ${result.names[i]}-${result.numberOfCandidates[i]} cadidate(s)`;
        $createElectionPatternSelect.appendChild(opt);;
    }
};

var electionInstanceFormSubmitted = false;

export const electionInstanceFormSubmit = async () => {
    $createElectionInstanceForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        $createElectionInstanceFormSubmitButton.disabled = true;

        if (!electionInstanceFormSubmitted) {

            electionInstanceFormSubmitted = true;

            let messageType = 'danger';
            let message = '';

            try {
                const idElectionPattern = e.target.elements[1].value;
                const candidatesName = e.target.elements[2].value;

                console.log(idElectionPattern)
                console.log(candidatesName)

                await contractInstance.startElection(idElectionPattern, candidatesName.split(','));

                messageType = 'success';
                message = `startElection success`;
            } catch (err) {
                message = `startElection error: ${err.message}`;
            } finally {
                electionInstanceFormSubmitted = false;
                $createElectionInstanceFormSubmitButton.disabled = false;

                setMessage(
                    $createElectionInstanceMessageSuccess,
                    $createElectionInstanceMessageSuccessText,
                    $createElectionInstanceMessageDanger,
                    $createElectionInstanceMessageDangerText,
                    messageType,
                    message);
            }
        }
    });
};

export const listElectionInstanceByOwner = async () => {
    return await contractInstance.listElectionInstancesAddressesByOwnerAddress();
};

export const loadContractInstanceAddressDropDown = async () => {
    for (var i = 0; i < $electionInstanceAddressSelect.length; i++) {
        $electionInstanceAddressSelect.remove(i);
    }

    let optFirst = document.createElement('option');
    optFirst.value = 0;
    optFirst.innerHTML = `----- select -----`;
    $electionInstanceAddressSelect.appendChild(optFirst);;

    let result = await listElectionInstanceByOwner();
    for (let i = 0; i < result.length; i++) {
        let opt = document.createElement('option');
        opt.value = result[i];
        opt.innerHTML = `${result[i]}`;
        $electionInstanceAddressSelect.appendChild(opt);;
    }
};

export const voteAddressSelected = () => {
    $electionInstanceAddressSelect.addEventListener('change', async (e) => {
        if ($electionInstanceAddressSelect.value != 0) {
            electionContractInstance = initEthersContract(
                provider,
                electionBuildJson.abi,
                $electionInstanceAddressSelect.value
            );
            const result = await listElectionCandidates();
            await loadElectionCandidateTable(result);
        }
    });
};

const loadElectionCandidateTable = async (candidates) => {
    try {
        removeTableRow($electionCandidatesTable);

        addTableHeader($electionCandidatesTable, ['Id', 'Name', ' ']);

        if (candidates) {
            for (let i = 0; i < candidates.ids.length; i++) {
                addTableRow($electionCandidatesTable, [candidates.ids[i], candidates.names[i]]);
            }

            addRadio($electionCandidatesTable);
        }
    } catch (err) {
        console.error(`loadElectionCandidateTable: ${err.message}`);
    }
};

const listElectionCandidates = async () => {
    return await electionContractInstance.listCandidates();
};

export const clearVoteForm = () => {
    $voteMessageSuccess.style.display = 'none';
    $voteMessageSuccessText.innerHTML = '';
    $voteMessageDanger.style.display = 'none';
    $voteMessageDangerText.innerHTML = '';
};

export const voteFormSubmit = async () => {
    $voteForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        let messageType = 'danger';
        let message = '';

        try {
            const id = e.target.elements[2].value;

            console.log(e.target.elements);

            messageType = 'success';
            message = `vote success`;
        } catch (err) {
            message = `vote error: ${err.message}`;
        } finally {
            setMessage(
                $voteMessageSuccess,
                $voteMessageSuccessText,
                $voteMessageDanger,
                $voteMessageDangerText,
                messageType,
                message);
        }
    });
};