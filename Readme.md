# query

  `query` is a fluent isomorphic interface for building [**Qo** - Query objects](https://github.com/mekanika/qo).

  **Alpha release version**

  [![Code Climate](https://codeclimate.com/github/mekanika/query.png)](https://codeclimate.com/github/mekanika/query)

```js
query()                  // Create query
  .from( 'user' )        // Resource to execute on
  .where( 'name' )       // Constraint field
    .in( ['Tom','Bob'] ) //  - operator and conditions
  .and( 'age' )          // AND constraint (also supports `.or()`)
    .gt( 25 )            //  - operator and conditions
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

  - **.{action}(...)** - {action} to execute (find, save, etc)

Execute a query with `.done( cb )`. Calls can be chained to this `query#` instance and executed by calling:

```js
  query()
    .from( 'users' )
    .find()
    .done( cb );
    // `cb` is required callback, passed `cb( err, res, query )`
```

### Query actions (Query#action)

  The available actions supported by query are:

  - **create**
  - **save**
  - **update**
  - **remove**
  - **find**


### Setting match constraints

  Constraints are set using the `.where( field ).<operator>( condition )` pattern.

  The `field` is the named target to apply an `operator` (the criteria) and `condition` to. **Operators** include:

  - **.eq(** value **)** - Equality (exact) match. Alias: `.is()`.
  - **.neq(** value **)** - Not equal to. Alias `not()`.
  - **.in(** array **)** - Where field value is in the array.
  - **.nin(** array **)** - Where field value is _not_ in the array.
  - **.all(** array **)** - everything in the list
  - **.lt(** number **)** - Less than number.
  - **.gt(** number **)** - More (greater) than than number.
  - **.lte(** number **)** - Less than or equal to number.
  - **.gte(** number **)** - More (greater) than or equal to number.

Examples:

```js
query().where( 'name' ).is( 'Mordecai' );
// Match any record with `{name: 'Mordecai'}`

query().where( 'age' ).gte( 21 );
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

  Post middleware hooks are functions that accept `(err, res, query)` and **must** return either `[err, res]` array OR an `Error` object to throw. Failing to return either of these will cause the query to throw an `Error` and halt processing.

  Posts run asynchronously **after** the adapter execution is complete, and are passed the the `err` and `res` responses from the adapter, and `query` is _this query_.

  **A note on Exceptions**: Post middleware runs _asynchronously_, which means if your post middleware generates an exception, _it will crash the process_ and the final query callback will fail to excute (or be caught). You **should** wrap your middleware in a `try-catch` block and handle errors appropriately.

  You may optionally modify the results from the server. Or simply return the no-op `[err, res]` array if your processing has nothing


```js
  function postHandler( err, res, qry ) {
    try {
      // MUST return [err, res] array
      err = 'My modified error';
      res = 'Custom results!';
      return [err, res];
    }
    catch (e) {
      return e; // Cause query to throw this Error
    }

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

  GNU Lesser General Public License, either version 3 of the License, or (at your option) any later version ([LGPL3+](https://www.gnu.org/licenses/lgpl.html)). See the `License.` files for full details.
