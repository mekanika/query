# Query object

Query objects form the structure requests to adapters.

An example query:

```js
{
  resource: 'users',
  action: 'update',
  modifiers: [
    {set: 'status', value: 'platinum'},
    {inc: 'credits', value: 25}
  ],
  constraints: [
    {field:'followers', operator:'gte', condition:100},
    {field:'state', operator:'nin', condition:['CA']}
  ],
  fields: [ 'id' ]
}
/* Update all users outside of California who have 100 or more followers to 'platinum' status, add 25 credits to their balance, and return only their ids. */
```


## Structure

The only required parameter in a query is the `action`. As such the simplest query object would be:

```js
{ action: 'special' }
```

All other parameters are optional and should be handled as such.

### Parameters

Adapter query objects comprise:

  - **.action** - _String_ (required): `create`, `find`, `update`, `remove`, etc
  - **.resource** - _String_ : model `key` to query
  - **.data** - _Array_: Data to process
  - **.identifiers** - _Array_: `ids`
  - **.fields** - _Array_: select `fields` to return
  - **.excludeFields** - _Array_: select `fields` to exclude
  - **.display** - _Object_ how results return:
      - **.limit** - _Number_ `default: 0`
      - **.offset** - _Number_ `default: 0`
  - **.order** - _Array_ contains `{}`:
    - **.direction** - ascending or descending
    - **.index** - _String_ to sort on
  - **.modifiers** - _Array_: specific updates
  - **.constraints** - _Array_: `where` style conditions


## Properties

### .action

**Required** - An action MUST be provided.

Type: **String**

The `action` maps to the adapter method that is invoked.

```js
{
  action: 'create',
  resource: 'tags',
  data: [ {label:'sweet'} ]
}
```


###.resource

Type: **String**

A `resource` points to an entity to act upon, like a table (SQL), a document (Document stores), a resource (REST). It is almost always a unique reference to some end-point that an `action` will apply to.

Some actions may not use a resource, most do.

```js
{
  resource: 'tweets',
  action: 'find',
  display: { limit: 25 }
}
```


###.identifiers

Type: **Array** of strings or numbers

A simple array of entity IDs to which the `.action` should apply the `.data` or `.modifiers`. If `identifiers` are provided, the `.action` should **only** apply to those ids provided.

```js
{
  action: 'remove',
  identifiers: ['554120', '841042']
}
```

### .fields

Type: **Array** of strings

Selects the fields from the `.resource` **to return** with the result (rather than returning the entire resource schema). If no `.fields` are present, return all fields unless excluded by `.excludeFields`.

**Special case**: If `.fields` is set to `null`, the request MUST return only `true` or `false` if it succeeds.

```js
{
  action: 'find',
  resource: 'artists',
  fields: [ 'name', 'bio' ]
}
```


### .excludeFields

Type: **Array** of strings

Similar to `.fields` except this lists fields to NOT return. Exclude fields have precedent if a field appears in both `.fields` and `.excludeFields`.

Note: if `.fields` is set to `null`, only a boolean is returned.

```js
{
  action: 'find',
  resource: 'guitars',
  excludeFields: ['price']
}
```


###.modifiers

Type: **Array** of modifier objects

Modifier object format: `{ $type: $field [, value: $val ] }`

Modifiers are explicit _update_ instructions that inform changes to specific _fields_ in a resource. All modifiers set the `action` to `update`.

Example:
```js
{
  action: 'update',
  resource: 'wine',
  identifiers: ['4jn6014jmns058sa41'],
  modifiers: [
    {set:'age', value:21},
    {unset:'status'},
    {inc:'price', value:-5}
  ]
}
```

 Modifier types are:

- **set** : set `field` to `value`
```js
{set:'name', value:'Slash'}
```

- **unset** : remove any value from `field` (similar to `set` to `undefined`, but may be implemented differently per adapter)
```js
{unset:'secret'}
```

- **inc** : modify the `field` by the `value` (+ve or -ve)
```js
{inc:'price', value:-5}
```

- **rename** : renames a `field`. This usually  _changes schema_ - beware!
```js
{rename:'price', value:'cost'}
```


### .display

Type: **Object**

Affect the returned number of results and their starting point.

Assume **no** limit or offset if none present.

- **.limit** - _Number_ : How many results to return

- **.offset** - _Number_ : Results to 'skip' (ie. start from `offset`)



### .order

Type: **Array** of sort order objects

Ordering objects take the form: `{ direction: $dir, index: $index }` where _either_ direction or index may not be present.

As such, the following are valid:

```js
// Only specify a direction to sort results on
{ order: [ {direction:'asc'} ] }

// Only specify an index to sort on
{ order: [ {index: 'country'} ] }
```

Queries can request a sorting order by specifying a direction (`asc` or `desc`) on a specific `index`.

Multiple ordering objects in the `.order` array should apply sub sorting, in the order of declaration in the array.

```js
{
  order: [
    {direction:'asc', index:'name'},
    {direction:'desc', index:'price'}
  ]
}
```


### .constraints

Type: **Array** of constraint objects

Constraints take the form: `{ field: $, operator: $, condition: $ }`

```js
{
  resource: 'users',
  constraints: [
    { field: 'cars.age', operator: 'lt', condition: 48 },
    { field: 'state', operator: 'in', condition: ['CA','NY','WA'] }
  ]
}
```

The constraint operators are:

- **eq** - Equals
- **neq** - Not equals
- **in** - In, or, contains (array)
- **nin** - Not in, or, does not contain (array)
- **all** - has all the values (array)
- **lt** - Less than `<`
- **lte** - Less than or equal to `<=`
- **gt** - Greater than `>`
- **gte** - Greater than or equal to `>=`


### .data

Type: **Array** of data payloads

Data payloads are usually Objects of arbitrary structure.

`.data` is **always** an Array, even when your payload is only one object. Usually requires applying the action to each object in the array.

```js
{
  action: 'create',
  resource: 'guitars',
  data: [
    {label:'Fender Stratocaster', price:450.75},
    {label:'Parker Fly', price:399.00}
  ]
}
```
