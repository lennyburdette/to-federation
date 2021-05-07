import {
  fromFederatedSDLToValidSDL,
  fromValidSDLToFederatedSDL,
} from "../src/convert";

test("fromFederatedSDLToValidSDL", async () => {
  expect(
    fromFederatedSDLToValidSDL(`
    extend type Query {
      me: User
    }

    type User @key(fields: "id") {
      id: ID!
      username: String!
    }
  `)
  ).toMatchInlineSnapshot(`
    "schema {
      query: Query
    }

    directive @key(fields: String!) on OBJECT | INTERFACE

    directive @extends on OBJECT | INTERFACE

    directive @external on OBJECT | FIELD_DEFINITION

    directive @requires(fields: String!) on FIELD_DEFINITION

    directive @provides(fields: String!) on FIELD_DEFINITION

    type User @key(fields: \\"id\\") {
      id: ID!
      username: String!
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

    type User @key(fields: "id") {
      id: ID!
      username: String!
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
    "type Query {
      me: User
    }

    type User @key(fields: \\"id\\") {
      id: ID!
      username: String!
    }
    "
  `);
});
