import { readFile } from "fs/promises";
import meow from "meow";
import getStdin from "get-stdin";
import {
  fromFederatedSDLToValidSDL,
  fromValidSDLToFederatedSDL,
} from "./convert";

const cli = meow(
  `
	Usage
	  $ to-federation --schema <filename>

	Options
    --string,  -s  Schema file to transform. Pass '-' to use stdin.
	  --reverse, -r  Transform a federated schema to non-federated one.

	Examples
	  $ to-federation --schema myschema.graphql
    $ to-federation --schema myschema.graphql --reverse 
`,
  {
    importMeta: import.meta,
    flags: {
      schema: {
        type: "string",
        alias: "s",
        isRequired: true,
      },
      reverse: {
        type: "boolean",
        alias: "r",
      },
    },
  }
);

(async () => {
  const sdl =
    cli.flags.schema === "-"
      ? await getStdin()
      : await readFile(cli.flags.schema, "utf-8");

  if (cli.flags.reverse) {
    console.log(fromValidSDLToFederatedSDL(sdl));
  } else {
    console.log(fromFederatedSDLToValidSDL(sdl));
  }
})();
