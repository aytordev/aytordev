import * as path from "path";
import { createPorts } from "./adapters";
import { createFileConfigAdapter } from "./adapters/infrastructure/config.adapter";
import { createConsoleLoggerAdapter } from "./adapters/infrastructure/console-logger.adapter";
import { createNodeFileSystemAdapter } from "./adapters/infrastructure/file-system.adapter";
import { createNodeEnvironmentAdapter } from "./adapters/infrastructure/node-environment.adapter";
import { createNodeProcessAdapter } from "./adapters/infrastructure/node-process.adapter";
import { renderTerminal } from "./adapters/presentation/terminal-renderer";
import { createGenerateProfileUseCase } from "./application/use-cases/generate-profile";
import { createGenerateShareCardUseCase } from "./application/use-cases/generate-share-card";

async function main() {
  // 1. Create infrastructure adapters (single place with side effects)
  const logger = createConsoleLoggerAdapter();
  const environment = createNodeEnvironmentAdapter();
  const processAdapter = createNodeProcessAdapter();
  const fsAdapter = createNodeFileSystemAdapter();
  const configAdapter = createFileConfigAdapter(fsAdapter);

  logger.log("🚀 Starting Terminal Profile Generator...");

  // 2. Load configuration
  const configPath = path.resolve(environment.cwd(), "terminal_profile.yml");
  if (!(await fsAdapter.exists(configPath))) {
    logger.error(`❌ Config file not found at: ${configPath}`);
    processAdapter.exit(1);
    return;
  }

  const configResult = await configAdapter.load(configPath);

  if (!configResult.ok) {
    logger.error(`❌ Invalid configuration: ${configResult.error}`);
    processAdapter.exit(1);
    return;
  }

  const config = configResult.value;
  logger.log(`✅ Loaded configuration for @${config.owner.username}`);

  // 3. Create remaining ports with dependency injection
  const githubToken = environment.get("GITHUB_TOKEN");
  const ports = createPorts(githubToken);

  // 4. Determine generation type
  const isShareCard = processAdapter.argv.includes("--share-card");

  // 5. Execute use case
  const useCase = isShareCard
    ? createGenerateShareCardUseCase(ports)
    : createGenerateProfileUseCase(ports);

  const result = await useCase(config);

  if (!result.ok) {
    logger.error(`❌ Failed to generate profile: ${result.error}`);
    processAdapter.exit(1);
    return;
  }

  // 6. Render (pure function)
  const svg = renderTerminal(result.value);

  // 7. Save output
  const outputPath = isShareCard ? "share-card.svg" : "profile.svg";
  await ports.fileSystem.writeFile(outputPath, svg);
  logger.log(`✅ Terminal Profile generated at ${outputPath}`);
}

main().catch((err) => {
  console.error("💥 Fatal error:", err);
  process.exit(1);
});
