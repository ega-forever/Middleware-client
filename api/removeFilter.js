const request = require('request');

module.exports =(host, hash)=>{

  return new Promise((resolve, reject)=>
    request({
      url: `${host}/events/listener`,
      method: 'DELETE',
      json: {
        id: hash
      }
    }, (err, resp) => {
      err || resp.statusCode !== 200 ? reject(err) : resolve(resp.body)
    })
  ).catch(err=>{console.log(err)});
};