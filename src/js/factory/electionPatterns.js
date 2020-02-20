import { setMessage } from '../util/message';
import { removeTableRow, addTableHeader, addTableRow } from '../util/table';

let $electionPatternsTable;
let $addElectionPatternForm;
let $electionPatternsMessageSuccess;
let $electionPatternsMessageSuccessText;
let $electionPatternsMessageDanger;
let $electionPatternsMessageDangerText;
let $electionPatternsFormSubmitButton;

let contractInstance;

export const registerElectionPatternsElements = (
    _electionPatternsTable,
    _addElectionPatternForm,
    _electionPatternsMessageSuccess,
    _electionPatternsMessageSuccessText,
    _electionPatternsMessageDanger,
    _electionPatternsMessageDangerText,
    _electionPatternsFormSubmitButton,
    _contractInstance
) => {
    $electionPatternsTable = _electionPatternsTable;
    $addElectionPatternForm = _addElectionPatternForm;
    $electionPatternsMessageSuccess = _electionPatternsMessageSuccess;
    $electionPatternsMessageSuccessText = _electionPatternsMessageSuccessText;
    $electionPatternsMessageDanger = _electionPatternsMessageDanger;
    $electionPatternsMessageDangerText = _electionPatternsMessageDangerText;
    $electionPatternsFormSubmitButton = _electionPatternsFormSubmitButton;
    contractInstance = _contractInstance;
}

export const listElectionPatterns = async () => {

    let result;

    try {
        result = await contractInstance.listElectionsPatterns();
    } catch (err) {
        console.error(`listElectionPatterns: ${err.message}`)
    }

    return result;
};

export const loadElectionPatternTable = async () => {
    try {
        removeTableRow($electionPatternsTable);

        addTableHeader($electionPatternsTable, ['Id', 'Name', 'Number of candidates']);

        const result = await listElectionPatterns();

        if (result) {
            for (let i = 0; i < result.ids.length; i++) {
                addTableRow($electionPatternsTable, [result.ids[i], result.names[i], result.numberOfCandidates[i]]);
            }
        }
    } catch (err) {
        console.error(`loadElectionPatternTable: ${err.message}`);
    }
};

export const clearElectionPatternForm = () => {
    $addElectionPatternForm.reset();
    $electionPatternsMessageSuccess.style.display = 'none';
    $electionPatternsMessageSuccessText.innerHTML = '';
    $electionPatternsMessageDanger.style.display = 'none';
    $electionPatternsMessageDangerText.innerHTML = '';
};

var electionPatternFormSubmitted = false;

export const electionPatternFormSubmit = async () => {
    $addElectionPatternForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        $electionPatternsFormSubmitButton.disabled = true;

        if (!electionPatternFormSubmitted) {

            electionPatternFormSubmitted = true;

            let messageType = 'danger';
            let message = '';

            try {
                const name = e.target.elements[1].value;
                const numberOfCandidates = e.target.elements[2].value;
                await contractInstance.createElectionPattern(name, numberOfCandidates);

                messageType = 'success';
                message = `createElection success`;
            } catch (err) {
                message = `createElection error: ${err.message}`;
            } finally {
                electionPatternFormSubmitted = false;
                $electionPatternsFormSubmitButton.disabled = false;

                setMessage(
                    $electionPatternsMessageSuccess,
                    $electionPatternsMessageSuccessText,
                    $electionPatternsMessageDanger,
                    $electionPatternsMessageDangerText,
                    messageType,
                    message);

                await listElectionPatterns();
            }
        }
    });
};