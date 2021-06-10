import {
  fromFederatedSDLToValidSDL,
  fromValidSDLToFederatedSDL,
} from "../src/convert.js";

test("fromFederatedSDLToValidSDL", async () => {
  expect(
    fromFederatedSDLToValidSDL(`
    schema @core(feature: "http://specs.apollo.dev/core/v0.1") {
      query: Query
    }

    extend type Query {
      me: User
    }

    type User @key(fields: "id") {
      id: ID!
      username: String! @custom
    }

    directive @core(feature: String!) repeatable on SCHEMA 

    directive @custom on FIELD_DEFINITION
  `)
  ).toMatchInlineSnapshot(`
    "schema @core(feature: \\"http://specs.apollo.dev/core/v0.1\\") {
      query: Query
    }

    directive @key(fields: String!) on OBJECT | INTERFACE

    directive @extends on OBJECT | INTERFACE

    directive @external on OBJECT | FIELD_DEFINITION

    directive @requires(fields: String!) on FIELD_DEFINITION

    directive @provides(fields: String!) on FIELD_DEFINITION

    directive @core(feature: String!) repeatable on SCHEMA

    directive @custom on FIELD_DEFINITION

    type User @key(fields: \\"id\\") {
      id: ID!
      username: String! @custom
    }

    type Query {
      _entities(representations: [_Any!]!): [_Entity]!
      _service: _Service!
      me: User
    }

    union _Entity = User

    scalar _Any

    type _Service {
      \\"\\"\\"The sdl representing the federated service capabilities. Includes federation directives, removes federation types, and includes rest of full schema after schema directives have been applied\\"\\"\\"
      sdl: String
    }
    "
  `);
});

test("fromValidSDLToFederatedSDL", async () => {
  expect(
    fromValidSDLToFederatedSDL(`
    schema {
      query: Query
    }

    directive @key(fields: String!) on OBJECT | INTERFACE

    directive @extends on OBJECT | INTERFACE

    directive @external on OBJECT | FIELD_DEFINITION

    directive @requires(fields: String!) on FIELD_DEFINITION

    directive @provides(fields: String!) on FIELD_DEFINITION

    directive @custom on FIELD_DEFINITION

    type User @key(fields: "id") {
      id: ID!
      username: String! @custom # IS STRIPPED
    }

    type Query {
      _entities(representations: [_Any!]!): [_Entity]!
      _service: _Service!
      me: User
    }

    union _Entity = User

    scalar _Any

    type _Service {
      """The sdl representing the federated service capabilities. Includes federation directives, removes federation types, and includes rest of full schema after schema directives have been applied"""
      sdl: String
    }
  `)
  ).toMatchInlineSnapshot(`
    "directive @custom on FIELD_DEFINITION

    type Query {
      me: User
    }

    type User @key(fields: \\"id\\") {
      id: ID!
      username: String!
    }
    "
  `);
});
