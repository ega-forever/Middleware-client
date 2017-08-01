# Middleware REST client API [![Build Status](https://travis-ci.org/ega-forever/Middleware-client.svg?branch=master)](https://travis-ci.org/ega-forever/Middleware-client)

The rest API client for middleware.

### Usage

```
const middleware = require('middleware-client'),
    mw = new middleware('http://localhost:8081');

/** get event, called 'issue' **/
 let request = mw.getEvent('issue', {by: '0xe5a8e00efe771eed3586be7746bcee5510a1c025'}, {limit: 10, offset: 1, sort: '-age'});

request.then(data=>{
    ..do stuff with data
})
```

### Signatures

##### new middleware(<address>).getEvent(event_name, query, opts);
Return all records from the speicified event's collection

| param | description|
| ------ | ------ |
| event_name   | name of event (required)
| query | query of request (optional)
| opts | options (limit, offset, sort) (optional)


##### new middleware(<address>).getTransactions(query, opts);
Return all records from the speicified event's collection

| param | description|
| ------ | ------ |
| query | query of request (optional)
| opts | options (limit, offset, sort) (optional)


##### new middleware(<address>).addFilter(callback, event, filter);
Add new listener for events with specified filter

| param | description|
| ------ | ------ |
| callback | the callback url, which will be triggered on update
| event | name of the event, which we are going to listen to
| filter | the filter criteria


##### new middleware(<address>).removeFilter(hash);
Remove listener by calculated hash (check utils.convertFilterToHash)

##### new middleware(<address>).utils.convertFilterToHash(callback, event, filter);
calculate hash by filter props. This hash is a unique identifier for each event, which makes filters unique and avoid duplicates.

### Testing
As this is the client side module - the intergration tests are take the first place.
It means, that for testing, you already should have a middleware running in a background.

In order to run them, type:
```sh
npm run test
```

License
----

MIT