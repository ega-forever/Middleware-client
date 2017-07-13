const Promise = require('bluebird'),
  Web3 = require('web3'),
  _ = require('lodash'),
  path = require('path'),
  mongoose = require('mongoose'),
  require_all = require('require-all'),
  eventTransformer = require('./helpers/eventTransformer'),
  bytes32 = require('./helpers/bytes32'),
  bytes32fromBase58 = require('./helpers/bytes32fromBase58'),
  middleware = require('../.'),
  ctx = {
    web3: null,
    factory: {},
    accounts: []
  };

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

beforeAll(() => {
  ctx.provider = new Web3.providers.HttpProvider('http://localhost:8545');
  ctx.web3 = new Web3();
  ctx.web3.setProvider(ctx.provider);
  ctx.contracts = require_all({ //scan dir for all smartContracts, excluding emitters (except ChronoBankPlatformEmitter) and interfaces
    dirname: path.join(__dirname, '../node_modules', 'chronobank-smart-contracts/build/contracts'),
    filter: /(^((ChronoBankPlatformEmitter)|(?!(Emitter|Interface)).)*)\.json$/
  });
  ctx.middleware = new middleware('http://localhost:8081');
  ctx.events = eventTransformer(ctx.provider);

  return new Promise(res => {
    ctx.web3.eth.getAccounts((err, result) => res(result));
  })
    .then(accounts => {
      ctx.accounts = accounts;
      return mongoose.connect('mongodb://localhost:32772/data'); //todo set
    })

});

afterAll(() => {
  ctx.web3.currentProvider.connection.end();
  return mongoose.disconnect();
});

test('get all events', () => {

  return Promise.all(
    _.map(ctx.events, (ev, name) =>
      ctx.middleware.getEvent(name)
        .then(data => ({data, definition: ev}))
    )
  ).then(data => {
    _.chain(data)
      .forEach(ev => {
        if (!_.isEmpty(ev.data))
          ev.data.forEach(record => {
            _.forEach(ev.definition, (def, field) => {
              expect(typeof record[field]).toEqual(def.type);
            })
          })
      })
      .value()
  })
});

test('create tx', () =>
  new Promise(res => {
    ctx.web3.eth.sendTransaction({
      from: ctx.accounts[0],
      to: ctx.accounts[1],
      value: ctx.web3.toWei(0.05, 'ether')
    }, (err, address) => {
      res(address);
    });
  })
    .then(result => {
      expect(result).toBeDefined();
      return Promise.resolve();
    })
);

test('get all transactions', () => {

  let schema = {
    blockHash: {type: 'string'},
    blockNumber: {type: 'string'},
    from: {type: 'string'},
    gasUsed: {type: 'string'},
    to: {type: 'string'},
    transactionHash: {type: 'string'},
    value: {type: 'string'}

  };

  ctx.middleware.getTransactions()
    .then(data => {

      _.chain(data)
        .forEach(tx => {
          _.forEach(schema, (def, field) => {
            expect(typeof tx[field]).toEqual(def.type);
          })
        })
        .value()

    })
});

test('fetch accounts from db', () =>
  mongoose.model('Account', {
    address: String
  }).find({})
    .then(accounts => {

      expect(accounts).toBeDefined();
      accounts = _.map(accounts, a=>a.address);

      ctx.accounts = _.chain(ctx.accounts)
        .reject(a =>
          accounts.includes(a)
        )
        .value();

      return Promise.resolve();
    })
);



test('add new account', () =>
  ctx.middleware.addAccount(_.head(ctx.accounts))
    .then(result=>{
      expect(result).toBeDefined();
      expect(result.success).toEqual(true);
    })
);
