import { setMessage } from '../util/message';

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
    if ($electionPatternsTable.rows.length > 0) {
        for (let i = $electionPatternsTable.rows.length - 1; i > 0; i--) {
            $electionPatternsTable.deleteRow(i);
        }
    }

    let headerRow = document.createElement('tr');

    let idHeader = document.createElement('th');
    let idHeaderText = document.createTextNode('Id');
    idHeader.appendChild(idHeaderText);

    let nameHeader = document.createElement('th');
    let nameHeaderText = document.createTextNode('Name');
    nameHeader.appendChild(nameHeaderText);

    let candidateHeader = document.createElement('th');
    let candidateHeaderText = document.createTextNode('Number of candidates');
    candidateHeader.appendChild(candidateHeaderText);

    headerRow.appendChild(idHeader);
    headerRow.appendChild(nameHeader);
    headerRow.appendChild(candidateHeader);

    $electionPatternsTable.appendChild(headerRow);

    const result = await contractInstance.listElectionsPatterns();

    for (let i = 0; i < result.ids.length; i++) {
        let newRow = document.createElement('tr');

        let idTd = document.createElement('td');
        let idTdText = document.createTextNode(result.ids[i]);
        idTd.appendChild(idTdText);

        let nameTd = document.createElement('td');
        let nameTdText = document.createTextNode(result.names[i]);
        nameTd.appendChild(nameTdText);

        let candidatesTd = document.createElement('td');
        let candidatesTdText = document.createTextNode(result.numberOfCandidates[i]);
        candidatesTd.appendChild(candidatesTdText);

        newRow.appendChild(idTd);
        newRow.appendChild(nameTd);
        newRow.appendChild(candidatesTd);

        $electionPatternsTable.appendChild(newRow);
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