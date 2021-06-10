import { readFile } from "fs/promises";
import execa from "execa";
import { dirname, resolve } from "path";
import { fromFederatedSDLToValidSDL } from "../src/convert.js";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

test("integration", async () => {
  const partial = await readFile(
    resolve(__dirname, "partial.graphql"),
    "utf-8"
  );
  const converted = fromFederatedSDLToValidSDL(partial);

  const lintProcess = execa(
    "yarn",
    [
      "-s",
      "graphql-schema-linter",
      "--stdin",
      "--config-directory",
      "test",
      "--format",
      "json",
    ],
    { input: converted }
  );
  try {
    await lintProcess;
  } catch (stderr) {
    expect(lintProcess.exitCode).toEqual(1);
    expect(stderr).toMatchInlineSnapshot(`
      [Error: Command failed with exit code 1: yarn -s graphql-schema-linter --stdin --config-directory test --format json
      {"errors":[{"message":"A \`PageInfo\` object type is required as per the Relay spec.","location":{"line":1,"column":1,"file":"stdin"},"rule":"relay-page-info-spec"}]}]
    `);
  }
});
