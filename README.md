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
