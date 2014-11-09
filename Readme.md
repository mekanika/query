# query

**Alpha release version**
[![Code Climate](https://codeclimate.com/github/mekanika/query.png)](https://codeclimate.com/github/mekanika/query)

`query` is an isomorphic interface for working with [**Qe** - Query envelopes](https://github.com/mekanika/qe).

There are two distinct parts of `query`:

1. **Qe builder** for creating valid Qe
2. **Adapter bridge** for passing Qe to adapters and receiving results

An example query:

```js
query( someAdapter )
  .on( 'users' )         // Resource to query
  .where( 'name' )       // Match conditions
    .in( ['Tom','Bob'] )
  .and( 'age' )          // also supports `.or()`
    .gt( 25 )
  .limit( 20 )           // Number of results
  .offset( 5 )           // Result to skip
  .done( callback );     // `callback(err, results)`
```

## Installation

      npm install --production


## Usage

Build _**Qe** - Query envelopes_:

```js
var myq = query().on('villains').find().limit(5);
// -> {do:'find',on:'villains',limit:5}
```

Plug into _Qe_ **adapters** with `.useAdapter( adptr )`:

```js
var superdb = require('superhero-adapter');
myq.useAdapter( superdb );
```

**Invoke** adapter with `.done( cb )`:

```js
var handler = function (err, res) {
  console.log('Returned!', err, res);
}

myq.done( handler );
// Passes `myq.qe` to `myq.adapter.exec()`
```

`query` chains nicely. So you can do the following:
```js
query( superdb )
  .find()
  .on('villains')
  .limit(5)
  .done( handler );
```

Go crazy.

## Building **Qe** - Query envelopes

Initiate a query:

```js
query() // -> new Query

// Or with an adapter
query( myadapter )

```

Build up your _Qe_ using the fluent interface methods that correspond to the [_Qe_ spec](https://github.com/mekanika/qe):

- **Actions** - `create()`, `find()`, `update()`, `remove()`
- **Target** - `on()`
- **Matching** - `ids()`, `match()`
- **Return control** - `select()`, `populate()`
- **Results display** - `limit()`, `offset()`
- **Custom data** - `meta()`

#### Writing _Qe_ directly

Qe are stored as `query().qe` - so you can optionally assign _Qe_ directly without using the fluent interface:

```js
var myq = query();
myq.qe = {on:'villains', do:'find', limit:5};

// Plug into an adapter and execute
myq.useAdapter( superheroAdapter );
myq.done( cb ); // `cb` receives (err, results)
```


### Query `.do` actions

The available `.do` actions are provided as methods.

All parameters are **optional** (ie. empty action calls will simply set `.do` to method name). Parameter descriptions follow:

- `body` is the data to set in the _Qe_ `.body`. May be an array or a single object. Arrays of objects will apply multiple
- `ids` is either a string/number or an array of strings/numbers to apply the action to. Sets _Qe_ `.ids` field.
- `cb` callback will immediately invoke `.done( cb )` if provided, thus executing the query (remember to set an adapter).

Available actions:

- **create(** body, cb **)** - create _new_
- **update(** ids, body, cb **)** - update _existing_
- **remove(** ids, cb **)** - delete
- **find(** ids, cb **)** - fetch

> All methods can apply to **multiple** entities if their first parameter is an array. ie. Create multiple entities by passing an array of objects in `body`, or update multiple by passing an array of several `ids`.
>
> Update/find/remove can all also **.match** on conditions. (See 'match')

### Setting `.match` conditions

Conditions are set using the following pattern:

    .where( field ).<operator>( value )

**Operators** include:

  - **.eq(** val **)** - Equality (exact) match. Alias: `.is()`.
  - **.neq(** val **)** - Not equal to. Alias: `not()`.
  - **.in(** array **)** - Where field value is in the array.
  - **.nin(** array **)** - Where field value is _not_ in the array.
  - **.all(** array **)** - everything in the list
  - **.lt(** num **)** - Less than number.
  - **.gt(** num **)** - More (greater) than than number.
  - **.lte(** num **)** - Less than or equal to number.
  - **.gte(** num **)** - More (greater) than or equal to number.

Examples:

```js
query().where( 'name' ).is( 'Mordecai' );
// Match any record with `{name: 'Mordecai'}`

query().where( 'age' ).gte( 21 );
// Match records where `age` is 21 or higher
```

Multiple conditions may be added using **either** `.and()`or `.or()`:

```js
// AND chain
query()
  .where('type').is('knight')
  .and('power').gt(20)
  .and('state').not('terrified');

// OR chain
query()
  .where('type', 'wizard')
  .or('level').gte(75)
  .or('numfollowers').gt(100);
```

To nest match container conditions see the `query.mc()` method below.

### Nested Matching **`query.mc()`**

The fluent `.where()` methods are actually just delegates for the generalised **`query.mc()`** method for creating `MatchContainer` objects.

> The _Qe_ spec describes match containers as:
>
> ```js
> { '$boolOp': [ mo|mc ... ] }
> ```
>
> The 'mc' array is made up of match objects (mo) of the form `{$field: {$op:$val}}`

'mc' objects chain the familiar `.where()` method and match operator methods.  For example:

```js
var mc = query.mc( 'and' )
  .where('power').gt(50)
  .where('state').neq('scared');

// Generates Qe match container:
{and: [ {power:{gte:50}}, {state:{neq:'scared'}} ]}
```

Which means, the fluent API expression:

```js
query().where('power').gt(50).where('state').neq('scared');
```

Is **identical** to:

```js
query().match( mc );
```

The upshot is **nesting** is fully supported, if not fluently.  To generate a _Qe_ that matches a nested expression as follows:

```js
(power > 30 && type == 'wizard') || type == 'knight'
```

A few approaches:

```js
// Using 'where' and 'or' to set the base 'mc'
query()
  .where(
    // Generate the 'and' sub match container
    query.mc('and')
      .where('power').gt(30)
      .where('type', 'wizard')
  )
  .or('type').is('knight');

// Directly setting .match and passing 'mc'
query().match(
  // Generate the top level 'or' match container
  query.mc('or')
    .where( query.mc('and').where('power').... )
    .where( 'state', 'NY' )
);
```

### Setting `.update` operators

`query` supports the following update operator methods (with their update object _Qe_ output shown):

- **.inc(** field, number **)** - `{$field: {inc: $number}}`
- **.pull(** field, values **)** - `{$field: {pull: $values}}`
- **.push(** field, values **)** - `{$field: {push: $values}}`

Where `field` is the field on the matching records to update, `number` is the number to increment/decrement and `values` is an array of values to pull or push.


## The Adapter bridge

`query` can delegate execution to an adapter.

Which means, it can pass _Qe_ to adapters and return the results.

To do this, call `.done( cb )` on a query that has an adapter set.

```js
query( customAdapter )
  .on( 'users' )
  .find()
  .done( cb ); // cb( err, results )
```

This passes the _Qe_ for that query, and the callback handler to the adapter. The errors and results from the adapter are then passed back to the handler - `cb( err, results)`

> Specifically, `query#done( cb )` delegates to:
>
> ```js
> query#adapter.exec( query#qe, cb );
> ```

### Setting an adapter

  Pass an adapter directly to each query:

```js
  var myadapter = require('my-adapter');
  query( myadapter );
```

  This is sugar for the identical call:

      query().useAdapter( myadapter );

  See [https://github.com/mekanika/adapter](https://github.com/mekanika/adapter) for more details on adapters.


## Middleware

`query` supports _pre_ and _post_ `.done(cb)` request processing.

This enables custom modifications of _Qe_ prior to passing to an adapter, and the custom processing of errors and results prior to passing these to `.done(cb)` callback handlers. Note that middleware:

  - is executed **ONLY if an adapter is set**
  - can add multiple methods to pre and post
  - executes in the order it is added

### Pre

  Pre-processing middleware is executed **before** the query is handed to its adapter, and are passed  `fn( query )` with _the current Qe_ as their only parameter.

  This enables you to modify the query prior to adapter execution.

  There are no special requirements for pre-middleware functions.

```js
function preHandler( qe ) {
  qe.on += ':magic_suffix';
  // Example modification of the Qe passed to the adapter
}

query().pre( preHandler );
// Adds `preHandler` to the pre-processing queue
```

Also supports adding multiple middleware methods

```js
query().pre( fn1 ).pre( fn2 ); // etc
```

### Post

  Post middleware hooks are functions that accept `(err, res, qe)` and **must return** either:

- `[err, res]` array tuple, OR
- an `Error` object to throw.

Failing to return either an `[err,res]` tuple or an error will cause the query to throw an `Error` and halt processing.

  Posts run asynchronously **after** the adapter execution is complete, and are passed the the `err` and `res` responses from the adapter, and `query` is _this query_.

> **A note on Exceptions**: Post middleware runs _asynchronously_, which means if your post middleware generates an exception, _it will crash the process_ and the final query callback will fail to excute (or be caught). You **should** wrap your middleware in a `try-catch` block and handle errors appropriately.

  You may optionally modify the results from the server. Or simply return the no-op `[err, res]` array if your processing has nothing


```js
  function postHandler( err, res, qe ) {
    try {
      err = 'My modified error';
      res = 'Custom results!';
      // MUST return [err, res] array
      return [err, res];
    }
    catch (e) {
      // Note 'return'. NOT 'throw':
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

  GNU Lesser General Public License, either version 3 of the License, or (at your option) any later version ([LGPL-3.0+](https://www.gnu.org/licenses/lgpl.html)). See the `License.` files for full details.
