import * as fs from "fs/promises";
import * as path from "path";
import { FileConfigAdapter } from "./adapters/infrastructure/config.adapter";
import { NodeFileSystemAdapter } from "./adapters/infrastructure/file-system.adapter";
import { TerminalRenderer } from "./adapters/presentation/terminal-renderer";
import { GenerateProfileUseCase } from "./application/use-cases/generate-profile";

import { createPorts } from "./adapters";

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

  const ports = createPorts(config);

  // 2. Use Case: Generate Profile State
  const useCase = new GenerateProfileUseCase(ports);
  const stateResult = await useCase.execute(config);

  if (!stateResult.ok) {
    throw stateResult.error;
  }

  const state = stateResult.value;

  // 3. Render
  console.log("🎨 Rendering SVG...");
  const renderer = new TerminalRenderer();
  const svg = renderer.render(state);

  // 4. Write Output
  const outputPath = path.resolve(process.cwd(), "profile.svg");
  await fs.writeFile(outputPath, svg);
  console.log(`✨ Generated profile at: ${outputPath}`);
}

main().catch((err) => {
  console.error("💥 Fatal error:", err);
  process.exit(1);
});
