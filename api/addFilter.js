const request = require('request');

module.exports =(host, callback, event, filter)=>{

  return new Promise((resolve, reject)=>
    request({
      url: `${host}/events/listener`,
      method: 'POST',
      json: {
        callback: callback,
        event: event,
        filter: filter
      }
    }, (err, resp) => {
      err || resp.statusCode !== 200 ? reject(err) : resolve(resp.body)
    })
  ).catch(err=>{console.log(err)});
};