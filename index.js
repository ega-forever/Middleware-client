const getCollection = require('./api/getCollection');

module.exports = class MiddlewareClient{

  constructor(host){
    this.host = host;
    this.getEvent = getCollection.bind(null, this.host, 'events');
    this.getTransactions = getCollection.bind(null, this.host, null, 'transactions');
  }

};