import { program } from "commander"

import play from "./commands/play/index.ts"

program.name("quiz").description("Take a quiz in the terminal")

program
  .command("play")
  .description("Play a quiz")
  .argument("[quiz]", "The quiz to take", "pasta")
  .option("-n, --name <name>", "Your name")
  .action(play)

try {
  await program.parseAsync()
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
}
