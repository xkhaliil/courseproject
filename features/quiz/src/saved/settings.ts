import { readText } from "./read.ts"

export interface Settings {
  name: string
}

export function loadSettings(saved: string): Settings {
  let value: unknown

  try {
    value = JSON.parse(saved)
  } catch {
    throw new Error("The settings are not valid JSON")
  }

  if (!isSettings(value)) {
    throw new Error("The settings need a name")
  }

  return value
}

export async function readSettings(file: string): Promise<Settings> {
  return loadSettings(await readText(file, "settings file"))
}

function isSettings(value: unknown): value is Settings {
  if (typeof value !== "object" || value === null) {
    return false
  }

  return "name" in value && typeof value.name === "string"
}
