var ethers = require('ethers');

export const initEthers = async (callbackAccountChanged) => {
    let provider;

    if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await window.ethereum.enable();
        ethereum.on('accountsChanged', callbackAccountChanged);
    } else if ((window.web3) || (typeof web3 !== 'undefined')) {
        provider = new ethers.providers.Web3Provider(web3.currentProvider);
    } else {
        provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
    }

    return provider;
};

export const setConnectedAccount = async (provider, $connectedAddress) => {
    const signer = await provider.getSigner();
    $connectedAddress.innerHTML = signer.provider._web3Provider.selectedAddress;
};