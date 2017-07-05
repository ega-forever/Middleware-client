const request = require('request'),
  q2mb = require('query-to-mongo-and-back');

module.exports =(host, namespace, collection, query, opts)=>{

  return new Promise((res)=>
    request(`${host}${namespace ? '/' + namespace : ''}/${collection}?${q2mb.toQuery(query, opts)}`, (err, response, body)=> res(JSON.parse(body)))
  );
};