// Write from the documentation
// https://docs.nestjs.com/openapi/cli-plugin
// https://docs.nestjs.com/recipes/swc#monorepo-and-cli-plugins

import { ReadonlyVisitor } from '@nestjs/swagger/dist/plugin';
import { PluginMetadataGenerator } from '@nestjs/cli/lib/compiler/plugins/plugin-metadata-generator';

const generator = new PluginMetadataGenerator();

generator.generate({
  visitors: [
    new ReadonlyVisitor({ introspectComments: true, pathToSource: __dirname }),
  ],
  outputDir: __dirname,
  watch: true,
  tsconfigPath: 'tsconfig.json',
});
