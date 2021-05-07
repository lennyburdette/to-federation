import { buildSchema, GraphQLObjectType, GraphQLSchema, parse } from "graphql";
import {
  buildFederatedSchema,
  printSchema as printFederatedSchema,
} from "@apollo/federation";
import { printSchemaWithDirectives } from "@graphql-tools/utils";

/**
 * Take a GraphQL SDL string intended for Apollo Federation and
 * convert it to a valid SDL while preserving Federation directives.
 */
export function fromFederatedSDLToValidSDL(sdl: string) {
  const schema = buildFederatedSchema(parse(sdl));
  return printSchemaWithDirectives(schema);
}

/**
 * Take a valid GraphQL SDL string and strip out Apollo Federation
 * directives, types, and fields.
 */
export function fromValidSDLToFederatedSDL(sdl: string) {
  const schema = buildSchema(sdl);

  const query =
    schema.getQueryType() ??
    new GraphQLObjectType({ name: "Query", fields: () => ({}) });

  const typesWithoutQuery = Object.values(schema.getTypeMap()).filter(
    (t) => t.name !== query.name
  );

  delete query.getFields()["_entities"];
  delete query.getFields()["_service"];

  const queryHasFields = Object.keys(query.getFields()).length > 0;

  const schemaWithoutFederationRootFields = new GraphQLSchema({
    ...schema.toConfig(),
    query: queryHasFields ? new GraphQLObjectType(query.toConfig()) : null,
    types: typesWithoutQuery,
  });

  return printFederatedSchema(schemaWithoutFederationRootFields);
}
