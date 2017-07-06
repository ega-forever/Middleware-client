const request = require('request'),
  q2mb = require('query-to-mongo-and-back');

module.exports =(host, namespace, collection, query, opts)=>{

  return new Promise((resolve, reject)=>
    request(`${host}${namespace ? '/' + namespace : ''}/${collection}?${q2mb.toQuery(query, opts)}`, (err, response, body)=>{
      try {
        resolve(JSON.parse(body));
      }catch (e){
        reject(`wrong event's name passed: ${collection}`);
      }
    })
  ).catch(err=>{console.log(err)});
};