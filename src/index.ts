import * as path from "path";
import { createPorts } from "./adapters";
import { FileConfigAdapter } from "./adapters/infrastructure/config.adapter";
import { NodeFileSystemAdapter } from "./adapters/infrastructure/file-system.adapter";
import { TerminalRenderer } from "./adapters/presentation/terminal-renderer";
import { createGenerateProfileUseCase } from "./application/use-cases/generate-profile";
import { createGenerateShareCardUseCase } from "./application/use-cases/generate-share-card";

async function main() {
  console.log("🚀 Starting Terminal Profile Generator...");

  const fsAdapter = new NodeFileSystemAdapter();
  const configAdapter = new FileConfigAdapter();

  // 1. Load Config
  const configPath = path.resolve(process.cwd(), "terminal_profile.yml");
  if (!(await fsAdapter.exists(configPath))) {
    console.error(`❌ Config file not found at: ${configPath}`);
    process.exit(1);
  }

  const configResult = await configAdapter.load(configPath);

  if (!configResult.ok) {
    console.error("❌ Invalid configuration:", configResult.error);
    process.exit(1);
  }

  const config = configResult.value;
  console.log(`✅ Loaded configuration for @${config.owner.username}`);

  const githubToken = process.env.GITHUB_TOKEN;
  const ports = createPorts(githubToken);

  const isShareCard = process.argv.includes("--share-card");

  // 2. Generate Profile
  // F18: Use Share Card Use Case if requested
  const useCase = isShareCard
    ? createGenerateShareCardUseCase(ports)
    : createGenerateProfileUseCase(ports);

  const result = await useCase(config);

  if (!result.ok) {
    console.error("❌ Failed to generate profile:", result.error);
    process.exit(1);
  }

  // 3. Render
  const renderer = new TerminalRenderer();
  const svg = renderer.render(result.value);

  // 4. Save
  const outputPath = isShareCard ? "share-card.svg" : "profile.svg";
  await ports.fileSystem.writeFile(outputPath, svg);
  console.log(`✅ Terminal Profile generated at ${outputPath}`);
}

main().catch((err) => {
  console.error("💥 Fatal error:", err);
  process.exit(1);
});
