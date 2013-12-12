# **Qo** - Query objects

Query objects _(Qo)_ seek to:

- provide a _standardised_ description for arbitrary requests
- abstract API 'calls' into discrete transform objects
- act as _control messages_ for your _Qo_-aware API
- describe the 'what', leaving the 'how' to you

_Qo_ are drivers for APIs. They do not _do_ anything - they are consumed by _Qo_-aware APIs and used to instruct actions.

An example _Qo_:

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
/* Update all users outside of California who have 100
or more followers to 'platinum' status, add 25 credits
to their balance, and return only their ids. */
```


## Structure

The only required parameter in a query is the `action`. As such the simplest _Qo_ would be:

```js
{ action: 'special' }
```

All other parameters are optional and should be handled as such.

### Serialisation

All examples in this document are shown as Javascript Objects. Serialising _Qo_ as JSON is acceptable.

### Parameters

Query objects comprise:

  - **.action** - _String_ (required): `create`, `find`, `update`, `remove`, etc
  - **.resource** - _String_ : model `key` to query
  - **.content** - _Array_: Data to process
  - **.identifiers** - _Array_: `ids`
  - **.idField** - _String_ : name id field (often used with `idenfifiers`)
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

The `action` usually maps to the method that is invoked, but generally describes what "to do".

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


###.idField

Type: **String**

Used to specify the name of the id field used for the `.identifiers`. If not specified, it should be left to the API consuming the _Qo_ to make a 'best guess' (usually something like `'id'` or `'_id`).

```js
{
  action: 'find',
  resource: 'players',
  identifiers: ['12345'],
  idField: 'special_id'
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

Modifiers are explicit _update_ instructions that inform changes to specific _fields_ in a resource. If `.modifiers` is present, the _Qo_ `action` should be `update`.

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

- **unset** : remove any value from `field` (similar to `set` to `undefined`, but may be implemented differently by various _Qo_-aware APIs)
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

_Qo_ can request a sorting order by specifying a direction (`asc` or `desc`) on a specific `index`.

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

> **Warning:** this section is under review and may introduce breaking changes in future versions

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


### .content

Type: **Array** of data payloads

Data payloads are usually Objects of arbitrary structure.

`.content` is **always** an Array, even when your payload is only one object. Usually requires applying the action to each object in the array.

```js
{
  action: 'create',
  resource: 'guitars',
  content: [
    {label:'Fender Stratocaster', price:450.75},
    {label:'Parker Fly', price:399.00}
  ]
}
```

## License

GNU Lesser General Public License, either version 3 of the License, or (at your option) any later version ([LGPL3+](https://www.gnu.org/licenses/lgpl.html)).
