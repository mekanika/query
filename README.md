# query

  An isomorphic fluent interface query-object builder.


## Installation

      npm install --production


## Usage

### Adapter

  `query` can _optionally_ delegate execution to an adapter.

  This means that calling `.done( cb )` on a query will delegate to:

      query#adapter.exec( query, cb );

#### Setting an adapter

  Simply pass an adapter reference in to the query directly:

      var myadapter = require('my-adapter');
      query( myadapter );

  This is syntactic sugar for the identical call:

      query().useAdapter( myadapter );

  See [https://github.com/cayuu/adapter](https://github.com/cayuu/adapter) for more details on adapters.

#### Advanced: Custom adapter classes

  You may also specify a custom adapter class handler on the `query` class itself (note the lack of `query()` parentheses):

      query.adapterClass( adapter.Adapter );

  This exposes the adapter cache via `adapter( 'adapterName' )`.

  Adapter references may then be passed as strings, and are retrieved from the adapter cache:

      query( 'adapterName' );

  Which is syntactic sugar for:

      query().use( 'adapterName' );


## Tests

  Ensure you have installed the development dependencies:

      npm install

  To run the tests:

      grunt test

  Or to set tests to run on changes:

      grunt watch:test


## License

  MIT
