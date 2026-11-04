import { readdir, readFile } from "node:fs/promises"
import path, { basename } from "node:path"

import { type Quiz, isQuiz } from "../play/index.ts"

export async function listQuizzes(): Promise<string[]> {
  const files = await readdir(import.meta.dirname)
  const quizzes = files
    .filter((name) => name.endsWith(".json"))
    .map((name) => basename(name, ".json"))

  return quizzes
}

export async function loadQuiz(name: string): Promise<Quiz> {
  const file = path.join(import.meta.dirname, `${name}.json`)

  let text: string

  try {
    text = await readFile(file, "utf8")
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      throw new Error(`There is no quiz called "${name}".`, { cause: error })
    }

    throw error
  }

  let value: unknown

  try {
    value = JSON.parse(text)
  } catch {
    throw new Error(`The quiz "${name}" is not valid JSON`)
  }

  if (!isQuiz(value)) {
    throw new Error(`The quiz "${name}" does not have the shape of a quiz`)
  }

  return value
}
