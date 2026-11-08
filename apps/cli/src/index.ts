import { program } from "commander"

import play from "./commands/play/index.ts"
import replay from "./commands/replay/index.ts"

program.name("quiz").description("Take a quiz in the terminal")

program
  .command("play")
  .description("Play a quiz")
  .argument("[quiz]", "The quiz to take", "pasta")
  .option("-n, --name <name>", "Your name")
  .action(play)

program
  .command("replay")
  .description("Play a quiz again with the answers saved in saved/game.json")
  .argument("[quiz]", "The quiz to replay", "pasta")
  .action(replay)

try {
  await program.parseAsync()
} catch (error) {
  // Inquirer throws an ExitPromptError when the player presses Ctrl+C.
  if (error instanceof Error && error.name === "ExitPromptError") {
    console.log("Bye!")
  } else {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  }
}
