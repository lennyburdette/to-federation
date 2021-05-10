# to-federation

Utility for converting GraphQL schemas intended for [Apollo Federation][fed]
into valid GraphQL documents.

## Motivation

When creating federated graphs, you end up writing invalid GraphQL schemas:

- directives like `@key` and `@provides` are not defined.
- `extend type` extensions reference undefined types.

This precludes the use of tools like [graphql-schema-linter][lint]. Use this
utility to convert the schema before linting:

```sh
npx github:lennyburdette/to-federation --schema myschema.graphql | npx \
  graphql-schema-linter --stdin
```

You can also convert a valid GraphQL schema into a federated schema for use
with Apollo tools like [rover][rover]:

```sh
npx github:lennyburdette/to-federation --schema accounts.graphql --reverse | \
  rover subgraph publish mygraph@current --name accounts --schema -
```

[fed]: https://www.apollographql.com/docs/federation/
[lint]: https://github.com/cjoudrey/graphql-schema-linter
[rover]: https://www.apollographql.com/docs/rover/

## Caveats

- The transformations are not symmetrical: some information like the `extend`
  keyword is lost, so you can't transform your schema then reverse the
  transformation and expect the same output.
- Line numbers change completely, so the schema linting report won't accurately
  reference lines and columns in the original file.
- Federation elements like `\_Entity` may not pass your lint rules.
