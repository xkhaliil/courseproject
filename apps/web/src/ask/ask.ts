// builds the question with createElement:
//  a heading with the text of the prompt
//  the hint in a paragraph after it when there is one
//  and a list of buttons, one for each option
//    each with its label and its position in a data-index
// It puts them in app, replacing what was there.
// It returns a promise of the submission of the option that is clicked.
//
// One listener on the list finds the button with the target of the event and closest, removes itself, and resolves the promise with the submission of the option at the data-index.

import { type Prompt, type Submission } from "@platform/quiz/play"
import { optionsFor } from "./options.ts"

export default function ask(
  app: HTMLDivElement,
  prompt: Prompt,
): Promise<Submission> {
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

  app.replaceChildren(heading, list)

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
