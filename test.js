const middleware = require('./index');

let mw = new middleware('http://localhost:8081');

let request = mw.getEvent('issue', {by: '0xe5a8e00efe771eed3586be7746bcee5510a1c025'}, {limit: 10, offset: 1, sort: '-age'});

request.then(data=>console.log(data)).catch(err=>console.log(err));