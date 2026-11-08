import { isErrorResponse } from "../play/index.ts"

const apiUrl = "http://localhost:3000"

// Sends a request to the API and checks the reply with `check` before handing
// it back. Every failure becomes an Error whose message an app can show as is.
export async function apiRequest<Result>({
  path,
  method = "GET",
  body,
  headers = {},
  check,
}: {
  path: string
  method?: string
  body?: unknown
  headers?: Record<string, string>
  check: (value: unknown) => value is Result
}): Promise<Result> {
  let response: Response

  try {
    response = await fetch(`${apiUrl}${path}`, {
      method,
      headers: {
        ...(body === undefined ? {} : { "content-type": "application/json" }),
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch (error) {
    throw new Error(
      `Cannot reach the quiz server at ${apiUrl}. Is it running?`,
      {
        cause: error,
      },
    )
  }

  const value: unknown = await response.json().catch(() => undefined)

  if (!response.ok) {
    throw new Error(
      isErrorResponse(value)
        ? value.error
        : `The quiz server replied with status ${response.status}`,
    )
  }

  if (!check(value)) {
    throw new Error("The quiz server sent a reply this app does not understand")
  }

  return value
}
