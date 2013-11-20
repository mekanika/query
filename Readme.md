# query

  An isomorphic fluent interface query-object builder.

  [![Code Climate](https://codeclimate.com/github/mekanika/query.png)](https://codeclimate.com/github/mekanika/query)

  **Massive work in progress. DO NOT USE.**

```js
query('service')         // The service to query
  .from( 'user' )        // Resource to execute on
  .includes( 'orders' )  // Associations to eager-load
    .on( 'uid' )         //  - join key (defaults as `{resource}_id`)
    .as( 'bookings' )    //  - return naming
  .where( 'name' )       // Constraint field
    .in( ['Tom','Bob'] ) //  - operator and conditions
  .and( 'age' )          // AND constraint (also supports `.or()`)
    .between( 12, 25 )   //  - operator and conditions
  .limit( 20 )           // Number of results
  .offset( 5 )           // Result offset (used for paging)
  .done( callback );     // Execute and return `callback( err, res )`
```

## Installation

      npm install --production


## Queries

  Initiate a query:

```js
  query()
  // -> new Query
```

Queries **require** setting:

  - **.from( resource )** - the `resource` to query
  - **.{action}(...)** - {action} to execute (find, save, etc)

Execute a query with `.done( cb )`. Calls can be chained to this `query#` instance and executed by calling:

```js
  query()
    .from( 'users' )
    .find()
    .done( cb );
    // `cb` is required callback, passed `cb( err, res, query )`
```

  Default query type/action is `find`, which returns records matching **criteria**.

### Query actions (Query#action)

  The available actions supported by query are:

  - **create**
  - **save**
  - **update**
  - **delete**
  - **find**


### Query selectors

  The more advanced _selector_ queries (modifiers on `find` results) are:

  - **.distinct( field )**  
    Sets the `Query#unique` property to `field`, instructing an adapter to apply this property to its `find` query.


### Setting criteria (selectors)

  Criteria are set using the `.where( field ).<operator>( condition )` pattern.

  The `field` is the named target to apply an `operator` (the criteria) and `condition` to. **Operators** include:

  * **.eq(** value **)** - Equality (exact) match. Alias: `.is()`.
  * **.neq(** value **)** - Not equal to. Alias `not()`.
  * **.in(** array **)** - Where field value is in the array.
  * **.nin(** array **)** - Where field value is _not_ in the array.
  * **.lt(** number **)** - Less than number.
  * **.gt(** number **)** - More (greater) than than number.
  * **.lte(** number **)** - Less than or equal to number.
  * **.gte(** number **)** - More (greater) than or equal to number.

Examples:

```js
query#.where( 'name' ).is( 'Mordecai' );
// Match any record with `{name: 'Mordecai'}`

query#.where( 'age' ).gte( 21 );
// Match records where `age` is 21 or higher
```


## Middleware

  `query` supports _pre_ and _post_ processing middleware, and:

  - is only executed **if an adapter is set**
  - can add multiple methods to pre and post
  - executes in the order it is added

### Pre

  Pre-processing middleware is executed **before** the query is handed to its adapter, and are passed  `fn( query )` with _this query_ as their only parameter.

  This enables you to modify the query prior to adapter execution.

  There are no special requirements for pre-middleware functions.

```js
  function preHandler( qry ) {
    qry.resource += ':magic_suffix';
    // Example modification of the query passed to the adapter
  }

  query().pre( preHandler );
  // Adds `preHandler` to the pre-processing queue
```

Also supports adding multiple middleware methods

```js
  query().pre( fn1 ).pre( fn2 ); // etc
```

### Post

  Post-processing middleware is run **after** the adapter execution is complete, and are passed `fn( err, res, query )`, where `err` and `res` are responses from the adapter, and `query` is _this query_.

  This enables you to modify the results from the server.

  Post middleware functions **must** return an `[error, results]` array, which will presumably include your modifications.

```js
  function postHandler( err, res, qry ) {
    // MUST return [err, res] array
    err = 'My modified error';
    res = 'Custom results!';
    return [err, res];
  }

  query().post( postHandler );
  // Adds `postHandler` to post-processing queue
```

Also supports adding multiple middleware methods:

```js
  query().post( fn1 ).post( fn2 ); // etc
```


## Adapter

  `query` can _optionally_ delegate execution to an adapter.

  This means that calling `.done( cb )` on a query will delegate to:

      query#adapter.exec( query, cb );

### Setting an adapter

  Pass an adapter directly to each query:

```js
  var myadapter = require('my-adapter');
  query( myadapter );
```

  This is syntactic sugar for the identical call:

      query().useAdapter( myadapter );

  See [https://github.com/mekanika/adapter](https://github.com/mekanika/adapter) for more details on adapters.

### Advanced: Custom adapter classes

  You may also specify a custom adapter class handler on the `query` class itself (note the lack of `query()` parentheses):

      query.adapterClass( adapter.Adapter );

  This exposes the adapter cache via `adapter( 'adapterName' )`.

  Adapter references may then be passed as strings, and are retrieved from the adapter cache:

      query( 'adapterName' );

  Which is syntactic sugar for:

      query().use( 'adapterName' );



## Tests

  Ensure you have installed the development dependencies:

      make install

  To run the tests:

      make test


### Test Coverage
To generate a `coverage.html` report, run:

    make coverage

### Bugs
If you [find a bug, report it](https://github.com/mekanika/query/issues).

## License

  MIT
