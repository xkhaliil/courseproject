export async function apiRequest<Result, Body = never>({
  path,
  method = "GET",
  body,
  headers = {},
}: {
  path: string
  method?: string
  body?: Body
  headers?: HeadersInit
}): Promise<Result> {
  const response = await fetch(`http://localhost:3000${path}`, {
    method,
    headers: {
      ...headers,
      ...(body ? { "content-type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const error = await response.json()
    console.error(error)
    throw new Error("Something went wrong")
  }

  const result = (await response.json()) as Result

  return result
}
