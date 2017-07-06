const _ = require('lodash');

module.exports = (contracts) => {

  return _.chain(contracts)
    .map(value => //fetch all events
      _.chain(value).get('abi')
        .filter({type: 'event'})
        .value()
    )
    .flatten()
    .uniqBy('name')
    .transform((result, ev) => {
      result[ev.name] =
        _.chain(ev.inputs)
          .transform((result, obj) => {
            result[obj.name] = {
              type: new RegExp(/uint/).test(obj.type) ?
                'number' : 'string'
            };
          }, {})
          .value()
    }, {})
    .value();
};