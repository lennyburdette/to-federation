import { readFile } from "fs/promises";
import meow from "meow";
import getStdin from "get-stdin";
import {
  fromFederatedSDLToValidSDL,
  fromValidSDLToFederatedSDL,
} from "./convert";

const cli = meow(
  `
  Convert GraphQL SDL intended for Apollo Federation into valid SDL while 
  preserving Federation directives, and vice-versa.
  
	Usage
	  $ federation-converter <filename>

	Options
    <filename>    Path to a GraphQL Schema Definition file. Reads from stdin if left blank.
	  --from-valid  Transform a valid schema to federated schema.

	Examples
	  $ federation-converter myschema.graphql
    $ federation-converter --from-valid myschema.graphql 
`,
  {
    importMeta: import.meta,
    flags: {
      reverse: {
        type: "boolean",
        alias: "r",
      },
    },
  }
);

(async () => {
  const sdl =
    typeof cli.input?.[0] !== "string"
      ? await getStdin()
      : await readFile(cli.input[0], "utf-8");

  if (cli.flags.reverse) {
    console.log(fromValidSDLToFederatedSDL(sdl));
  } else {
    console.log(fromFederatedSDLToValidSDL(sdl));
  }
})();
