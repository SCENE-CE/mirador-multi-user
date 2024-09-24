import { PluginMetadataGenerator } from '@nestjs/cli/lib/compiler/plugins';
import { ReadonlyVisitor } from '@nestjs/swagger/dist/plugin';

// Write from the documentation
// https://docs.nestjs.com/openapi/cli-plugin
// https://docs.nestjs.com/recipes/swc#monorepo-and-cli-plugins

const generator = new PluginMetadataGenerator();
generator.generate({
  visitors: [new ReadonlyVisitor({ introspectComments: true, pathToSource: __dirname })],
  outputDir: __dirname,
  watch: true,
  tsconfigPath: 'tsconfig.json',
});
