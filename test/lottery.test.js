const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const {abi, evm} = require("../compile");

let lottery;
let accounts;


beforeEach( async() => {
    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(abi)
        .deploy({ data: evm.bytecode.object, arguments: [1]})
        .send({ from: accounts[0], gas: 1000000});
});


describe("Lottery function", () =>{
    it("Deployed contract", () =>{
        assert.ok(lottery.options.address);
    });

    it("Allows to enter in the lottery", async () =>{
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('1', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(1, players.length);
    });


    it("Allows multiple accounts to enter", async () =>{
        for (let index = 0; index < 5; index++) {
            await lottery.methods.enter().send({
                from: accounts[index],
                value: web3.utils.toWei('1', 'ether')
            });
    
            const players = await lottery.methods.getPlayers().call({
                from: accounts[0]
            });
    
            assert.equal(accounts[index], players[index]);
            assert.equal(index+1, players.length);
        }
    });

    it("Enter the right amount of ether", async () =>{
        try {
            await lottery.methods.enter().send({
                from: accounts[index],
                value: 3 // = 3 Wei
            });
            assert(false);  
        } catch (error) {
            assert.ok(error);
        }
    });

    it("Only manager can pick the winner", async () =>{
        try {
            await lottery.methods.pickWinner().send({
                from: accounts[1]
            });
            assert(false);
        } catch (error) {
            assert.ok(error);
        }
    });

    it("Send money to the winner and reset the pool of player", async () =>{
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('1', 'ether')
        });

        const initialBalance = await web3.eth.getBalance(accounts[0]);
        await lottery.methods.pickWinner().send({
            from: accounts[0]
        });
        const finalBalance = await web3.eth.getBalance(accounts[0]);
        const difference = finalBalance - initialBalance;

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert(difference > web3.utils.toWei('0.9', 'ether')); //He won 1 Eth less the fees
        assert.equal(players.length, 0); //The pool is empty
    });
});
