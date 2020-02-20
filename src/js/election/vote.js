import { initEthersContract } from '../connection/contract';
import { setMessage } from '../util/message';
import { removeTableRow, addTableHeader, addTableRow, addRadio } from '../util/table';
import { listElectionInstanceByOwner } from '../election/electionInstance';

let $voteForm;
let $voteMessageSuccess;
let $voteMessageSuccessText;
let $voteMessageDanger;
let $voteMessageDangerText;
let $electionInstanceAddressSelect;
let $electionCandidatesTable;
let $voteSubmitButton;
let $voteResultTable;
let $electionInstanceAddressVoteResultSelect;

let electionBuildJson;
let provider;
let electionContractInstance;

export const registeVoteElements = (
    _voteForm,
    _voteMessageSuccess,
    _voteMessageSuccessText,
    _voteMessageDanger,
    _voteMessageDangerText,
    _electionInstanceAddressSelect,
    _electionCandidatesTable,
    _voteSubmitButton,
    _voteResultTable,
    _electionInstanceAddressVoteResultSelect,
    _electionBuildJson,
    _provider
) => {
    $voteForm = _voteForm;
    $voteMessageSuccess = _voteMessageSuccess;
    $voteMessageSuccessText = _voteMessageSuccessText;
    $voteMessageDanger = _voteMessageDanger;
    $voteMessageDangerText = _voteMessageDangerText;
    $electionInstanceAddressSelect = _electionInstanceAddressSelect;
    $electionCandidatesTable = _electionCandidatesTable
    $voteSubmitButton = _voteSubmitButton;
    $voteResultTable = _voteResultTable;
    $electionInstanceAddressVoteResultSelect = _electionInstanceAddressVoteResultSelect;
    electionBuildJson = _electionBuildJson;
    provider = _provider;
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

        addTableHeader($electionCandidatesTable, ['Id', 'Name', 'Vote']);

        if (candidates) {
            for (let i = 0; i < candidates.ids.length; i++) {
                addTableRow($electionCandidatesTable, [candidates.ids[i], candidates.names[i]]);
            }

            addRadio($electionCandidatesTable, $voteForm);
        }

        $voteSubmitButton.style.display = '';
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
    $voteSubmitButton.style.display = 'none';
};

export const voteFormSubmit = async () => {
    $voteForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        let messageType = 'danger';
        let message = '';

        try {
            let candidateId = 0;
            for (let i = 0; i < e.target.elements.length; i++) {
                if (e.target.elements[i].name == 'radioTd' && e.target.elements[i].checked)
                    candidateId = e.target.elements[i].value;
            }

            if (candidateId > 0) {

                await electionContractInstance.vote(candidateId);

                messageType = 'success';
                message = `vote success`;
            } else {
                message = 'invalid candidate';
            }
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

            await loadVoteResultTable();
        }
    });
};

export const voteAddressSelectedVoteReult = () => {
    $electionInstanceAddressVoteResultSelect.addEventListener('change', async (e) => {
        if ($electionInstanceAddressVoteResultSelect.value != 0) {
            electionContractInstance = initEthersContract(
                provider,
                electionBuildJson.abi,
                $electionInstanceAddressVoteResultSelect.value
            );
            const result = await listElectionCandidates();
            await loadVoteResultTable(result);
        }
    });
};

const loadVoteResultTable = async (candidates) => {
    try {
        removeTableRow($voteResultTable);

        addTableHeader($voteResultTable, ['Id', 'Name', 'Votes']);

        if (candidates) {
            for (let i = 0; i < candidates.ids.length; i++) {
                addTableRow($voteResultTable, [candidates.ids[i], candidates.names[i], candidates.votes[i]]);
            }
        }
    } catch (err) {
        console.error(`loadVoteResultTable: ${err.message}`);
    }
};

export const loadContractInstanceAddressDropDownVoteResult = async () => {
    for (var i = 0; i < $electionInstanceAddressVoteResultSelect.length; i++) {
        $electionInstanceAddressVoteResultSelect.remove(i);
    }

    let optFirst = document.createElement('option');
    optFirst.value = 0;
    optFirst.innerHTML = `----- select -----`;
    $electionInstanceAddressVoteResultSelect.appendChild(optFirst);;

    let result = await listElectionInstanceByOwner();
    for (let i = 0; i < result.length; i++) {
        let opt = document.createElement('option');
        opt.value = result[i];
        opt.innerHTML = `${result[i]}`;
        $electionInstanceAddressVoteResultSelect.appendChild(opt);;
    }
};