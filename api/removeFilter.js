const request = require('request'),
  log = require('loglevel');

/**
 * @function removeFilter
 * @description removes exciting filter
 * @param host - address of middleware
 * @param hash - the calculated hash of listener
 * @returns {Promise|Promise.<T>}
 */

module.exports =(host, hash)=>{

  return new Promise((resolve, reject)=>
    request({
      url: `${host}/events/listener`,
      method: 'DELETE',
      json: {
        id: hash
      }
    }, (err, resp) => {
      err || resp.statusCode !== 200 ? reject(err) : resolve(resp.body);
    })
  )
    .catch(err => log.error(err));
};