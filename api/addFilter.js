const request = require('request'),
  log = require('loglevel');

/**
 * @function addFilter
 * @description add new filter
 * @param host - address of middleware
 * @param callback - the callback url, which will be triggered on update
 * @param event - name of the event, which we are going to listen to
 * @param filter - the filter criteria
 * @returns {Promise|Promise.<T>}
 */

module.exports = (host, callback, event, filter) => {

  return new Promise((resolve, reject) =>
    request({
      url: `${host}/events/listener`,
      method: 'POST',
      json: {
        callback: callback,
        event: event,
        filter: filter
      }
    }, (err, resp) => {
      err || resp.statusCode !== 200 ? reject(err) : resolve(resp.body);
    })
  )
    .catch(err => log.error(err));
};