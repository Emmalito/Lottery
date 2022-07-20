const HDWalletProvide = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const {abi, evm} = require('./compile');


//Provider with metamask account
const provider = new HDWalletProvide("topple clump own green possible budget ice camera ripple later side switch",
"https://rinkeby.infura.io/v3/5e0b1b98ecb640c796f7c68f39d6a3ea");

const web3 = new Web3(provider);

const play = async() => {
    const accounts = await web3.eth.getAccounts(); 
    console.log("You are using the account ", accounts[0]);

    const lottery = await new web3.eth.Contract(abi, '0x96cd06cdB283E850Fe731ae2E894A633d1174E9e');
    
    await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei('0', 'ether')
    });

    console.log("Congrats, you have a ticket!");

    const players = await lottery.methods.getPlayers().call({
        from: accounts[0]
    });


    console.log("Current players: ", players);
    provider.engine.stop(); // To prevent hanging deployment
};

play();