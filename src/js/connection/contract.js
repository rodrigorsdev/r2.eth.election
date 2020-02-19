var ethers = require('ethers');

export const initEthersContract = (provider, contractAbi, contractAddress) => {
    const signer = provider.getSigner();
    return new ethers.Contract(
        contractAddress,
        contractAbi,
        signer);
};