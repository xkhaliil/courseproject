import { readFile } from "node:fs/promises"

// Reads a saved file, and names what is missing when there is no file.
export async function readText(file: string, what: string): Promise<string> {
  try {
    return await readFile(file, "utf8")
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      throw new Error(`There is no ${what} at ${file}`, { cause: error })
    }

    throw error
  }
}
