const HDWalletProvide = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const {abi, evm} = require('./compile');


//Provider with metamask account
const provider = new HDWalletProvide("topple clump own green possible budget ice camera ripple later side switch",
"https://rinkeby.infura.io/v3/5e0b1b98ecb640c796f7c68f39d6a3ea");

const web3 = new Web3(provider);

const deploy = async() => {
    const accounts = await web3.eth.getAccounts(); 
    console.log("Attempting to deploy contract on account ", accounts[0]);
    
    const receipe = await new web3.eth.Contract(abi)
        .deploy({data: evm.bytecode.object, arguments: ['1st contract deployment on Rinkeby!']})
        .send({from: accounts[0], gas: '1000000'});

    console.log("Contract deploy on ", receipe.options.address);
    provider.engine.stop(); // To prevent hanging deployment
};

deploy();
