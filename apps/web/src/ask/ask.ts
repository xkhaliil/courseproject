import { type Prompt, type Submission } from "@platform/quiz/play"
import { optionsFor } from "./options.ts"

// Shows the prompt in app with one button per option, under a line of
// progress, and resolves with the submission of the option that is clicked.
export default function ask(
  app: HTMLDivElement,
  prompt: Prompt,
  progress: string,
): Promise<Submission> {
  const progressLine = document.createElement("p")
  progressLine.textContent = progress

  const heading = document.createElement("h2")
  heading.textContent = prompt.label

  const list = document.createElement("ul")

  const options = optionsFor(prompt)
  for (const [index, option] of options.entries()) {
    const item = document.createElement("li")
    const button = document.createElement("button")

    button.textContent = option.label
    button.dataset.index = `${index}`

    item.append(button)
    list.append(item)
  }

  app.replaceChildren(progressLine, heading, list)

  if (prompt.hint) {
    const hint = document.createElement("p")
    hint.textContent = prompt.hint

    heading.after(hint)
  }

  return new Promise((resolve) => {
    function handleClick(event: MouseEvent): void {
      if (!(event.target instanceof HTMLElement)) return

      const button = event.target.closest("button")
      if (!button) return

      const index = parseInt(button.dataset.index ?? "")
      const option = options[index]
      if (!option) return

      list.removeEventListener("click", handleClick)
      resolve(option.submission)
    }

    list.addEventListener("click", handleClick)
  })
}
