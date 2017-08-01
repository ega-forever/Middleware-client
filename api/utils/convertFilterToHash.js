const Web3 = require('web3'),
  web3 = new Web3();

module.exports = (callback, event, filter) => {

  return `${web3.sha3(callback)}:${web3.sha3(event)}:${web3.sha3(JSON.stringify(filter))}`;

};