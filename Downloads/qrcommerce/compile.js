const path = require('path');
const fs = require('fs');
const solc = require('solc');

const contractPath = path.resolve(__dirname, 'src', 'contracts', 'PaymentContract.sol');
const sourceCode = fs.readFileSync(contractPath, 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    'PaymentContract.sol': {
      content: sourceCode,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['abi'],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

// Check for any compilation errors
if (output.errors && output.errors.length) {
  console.error('Smart contract compilation errors:');
  output.errors.forEach((error) => console.error(error.formattedMessage));
  process.exit(1);
}

const contractABI = output.contracts['PaymentContract.sol']['PaymentContract'].abi;
const abiPath = path.resolve(__dirname, 'src', 'components', 'PaymentContractABI.json');

// Write the contract ABI to the specified file
fs.writeFileSync(abiPath, JSON.stringify(contractABI));

console.log('Smart contract compiled successfully. ABI saved at', abiPath);
