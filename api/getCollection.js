const request = require('request'),
  log = require('loglevel'),
  q2mb = require('query-to-mongo-and-back');

/**
 * @function getCollection
 * @description generic method for fetching collections (events or raw transactions)
 * @param host - address of middleware
 * @param namespace - optional (for fetching tx it should be null, for events -> 'events')
 * @param collection - the collection name
 * @param query - filter object
 * @param opts - the options, for sort and limit
 * @returns {Promise|Promise.<T>}
 */

module.exports =(host, namespace, collection, query, opts)=>{

  return new Promise((resolve, reject)=>
    request(`${host}${namespace ? '/' + namespace : ''}/${collection}?${q2mb.toQuery(query, opts)}`, (err, response, body)=>{
      try {
        resolve(JSON.parse(body));
      }catch (e){
        reject(`wrong event's name passed: ${collection}`);
      }
    })
  )
    .catch(err => log.error(err));
};