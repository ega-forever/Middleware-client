const Web3 = require('web3'),
  web3 = new Web3();

/**
 * @function convertFilterToHash
 * @description converts filter props to unique hash
 * @param callback - the callback url, which will be triggered on update
 * @param event - name of the event, which we are going to listen to
 * @param filter - the filter criteria
 * @returns {string}
 */

module.exports = (callback, event, filter) => {

  return `${web3.sha3(callback)}:${web3.sha3(event)}:${web3.sha3(JSON.stringify(filter))}`;

};