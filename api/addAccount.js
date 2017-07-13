const request = require('request');

module.exports =(host, address)=>{

  return new Promise((resolve, reject)=>
    request({
      url: `${host}/account`,
      method: 'POST',
      json: {
        address: address
      }
    }, (err, resp) => {
      err || resp.statusCode !== 200 ? reject(err) : resolve(resp.body)
    })
  ).catch(err=>{console.log(err)});
};