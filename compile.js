// Libraries
const path = require('path');  // To get the path
const fs = require('fs');      // File System
const solc = require('solc');


const directoryPath = path.resolve(__dirname, 'contracts', 'lottery.sol');  // Get the path of the lottery.sol file
const source = fs.readFileSync(directoryPath, 'utf8');

const input = {
    language: 'Solidity',
    sources: {
      'Lottery.sol': {
        content: source,
      },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
    },
};
   
const Lottery = JSON.parse(solc.compile(JSON.stringify(input))).contracts['Lottery.sol'].Lottery;
module.exports = Lottery;
