import { listElectionPatterns } from '../factory/electionPatterns';
import { setMessage } from '../util/message'

let $createElectionPatternSelect;
let $createElectionInstanceForm;
let $createElectionInstanceMessageSuccess;
let $createElectionInstanceMessageSuccessText;
let $createElectionInstanceMessageDanger;
let $createElectionInstanceMessageDangerText;
let $createElectionInstanceFormSubmitButton;
let $electionInstanceAddressSelect;

let contractInstance;

export const registerElectionInstanceElements = (
    _createElectionPatternSelect,
    _createElectionInstanceForm,
    _createElectionInstanceMessageSuccess,
    _createElectionInstanceMessageSuccessText,
    _createElectionInstanceMessageDanger,
    _createElectionInstanceMessageDangerText,
    _createElectionInstanceFormSubmitButton,
    _electionInstanceAddressSelect,
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