import {
  fromFederatedSDLToValidSDL,
  fromValidSDLToFederatedSDL,
} from "../src/convert";

test("fromFederatedSDLToValidSDL", async () => {
  expect(
    fromFederatedSDLToValidSDL(`
    type Astronaut @key(fields: "id") {
      id: ID!
      name: String @deprecated
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

    type Astronaut @key(fields: \\"id\\") {
      id: ID!
      name: String @deprecated
    }

    type Query {
      _entities(representations: [_Any!]!): [_Entity]!
      _service: _Service!
    }

    union _Entity = Astronaut

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
    directive @key(fields: String!) on OBJECT | INTERFACE

    directive @extends on OBJECT | INTERFACE

    directive @external on OBJECT | FIELD_DEFINITION

    directive @requires(fields: String!) on FIELD_DEFINITION

    directive @provides(fields: String!) on FIELD_DEFINITION

    type Astronaut @key(fields: "id") {
      id: ID!
      name: String @deprecated
    }

    type Query {
      _entities(representations: [_Any!]!): [_Entity]!
      _service: _Service!
    }

    union _Entity = Astronaut

    scalar _Any

    type _Service {
      """
      The sdl representing the federated service capabilities. Includes federation directives, removes federation types, and includes rest of full schema after schema directives have been applied
      """
      sdl: String
    }
  `)
  ).toMatchInlineSnapshot(`
    "type Astronaut @key(fields: \\"id\\") {
      id: ID!
      name: String @deprecated
    }
    "
  `);
});
