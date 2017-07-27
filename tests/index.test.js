const Promise = require('bluebird'),
  config = require('middleware/config'),
  Web3 = require('web3'),
  _ = require('lodash'),
  path = require('path'),
  mongoose = require('mongoose'),
  contract = require('truffle-contract'),
  http = require('http'),
  express = require('express'),
  bodyParser = require('body-parser'),
  require_all = require('require-all'),
  eventTransformer = require('./helpers/eventTransformer'),
  bytes32 = require('./helpers/bytes32'),
  bytes32fromBase58 = require('./helpers/bytes32fromBase58'),
  middleware = require('../.'),
  ctx = {
    web3: null,
    factory: {},
    accounts: [],
    express: {
      app: express()
    }
  };

jasmine.DEFAULT_TIMEOUT_INTERVAL = 90000;

beforeAll(() => {
  ctx.provider = new Web3.providers.HttpProvider('http://localhost:8545');
  ctx.web3 = new Web3();
  ctx.web3.setProvider(ctx.provider);
  ctx.contracts = require_all({ //scan dir for all smartContracts, excluding emitters (except ChronoBankPlatformEmitter) and interfaces
    dirname: path.join(__dirname, '../node_modules', 'chronobank-smart-contracts/build/contracts'),
    filter: /(^((ChronoBankPlatformEmitter)|(?!(Emitter|Interface)).)*)\.json$/,
    resolve: Contract => {
      let c = contract(Contract);
      c.defaults({gas: 3000000});
      c.setProvider(ctx.provider);
      return c;
    }
  });
  ctx.middleware = new middleware(`http://${config.rest.domain}:${config.rest.port}`);
  ctx.events = eventTransformer(ctx.provider);
  ctx.express.server = http.createServer(ctx.express.app);
  ctx.express.app.use(bodyParser.urlencoded({extended: false}));
  ctx.express.app.use(bodyParser.json());

  return new Promise(res => {
    ctx.web3.eth.getAccounts((err, result) => res(result));
  })
    .then(accounts => {
      ctx.accounts = accounts;
      return Promise.all([
        new Promise(res =>
          ctx.express.server.listen(config.rest.port + 1, res)
        ),
        mongoose.connect(config.mongo.uri)
      ])
    })

});

afterAll(() => {
  ctx.express.server.close();
  mongoose.disconnect();
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

test('add new filter', () =>
  ctx.middleware.addFilter(
    `http://localhost:${config.rest.port + 1}/test`,
    'transfer',
    {
      to: ctx.accounts[1],
      symbol: bytes32('TIME')
    }
  )
);

test('transfer a token and validate', () =>
  Promise.all([
    ctx.contracts.AssetsManager.deployed()
      .then(instance =>
        instance.sendAsset(
          bytes32('TIME'), ctx.accounts[1], 100, {
            from: ctx.accounts[0],
            gas: 3000000
          })
      ),
    new Promise(resolve => {
      ctx.express.app.post('/test', (req, res) => {
        expect(req.body.to).toEqual(ctx.accounts[1]);
        expect(req.body.symbol).toEqual(bytes32('TIME'));
        resolve();
        res.send();
      });
    })
  ]).catch(err => console.log(err))
);