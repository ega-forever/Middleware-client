const getCollection = require('./api/getCollection'),
  addFilter = require('./api/addFilter'),
  removeFilter = require('./api/removeFilter'),
  convertFilterToHash = require('./api/utils/convertFilterToHash');

/**
 * @class MiddlewareClient
 * @description middleware client
 * @param host - host, on which middleware listen to connections
 */

module.exports = class MiddlewareClient {

  constructor(host) {
    this.host = host;
    this.getEvent = getCollection.bind(null, this.host, 'events');
    this.getTransactions = getCollection.bind(null, this.host, null, 'transactions');
    this.addFilter = addFilter.bind(null, this.host);
    this.removeFilter = removeFilter.bind(null, this.host);
    this.utils = {
      convertFilterToHash: convertFilterToHash
    };
  }

};