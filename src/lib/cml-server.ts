import "server-only"

export type GlobalContextStatus =
  | { readonly kind: "complete" }
  | { readonly kind: "degraded"; readonly unavailableComponents: readonly string[] }

export interface RedRiseGlobalContextResult {
  readonly result: unknown
  readonly citations: readonly unknown[]
  readonly status: GlobalContextStatus
  readonly correlationId?: string
}

export type CmlAdapterErrorCode = "configuration_missing" | "sdk_unavailable" | "request_failed"

export class CmlAdapterError extends Error {
  constructor(readonly code: CmlAdapterErrorCode, message: string, readonly cause?: unknown) {
    super(message)
    this.name = "CmlAdapterError"
  }
}

type OfficialSdk = {
  CmlClient: new (options: { baseUrl: string; getAccessToken: () => string | Promise<string> }) => unknown
  searchGlobalContext: (
    client: unknown,
    text: string,
    options?: { budget?: { inputTokens: number; outputTokens: number; maxResults: number } },
  ) => Promise<RedRiseGlobalContextResult>
}

let clientPromise: Promise<{ sdk: OfficialSdk; client: unknown }> | undefined

async function loadClient() {
  clientPromise ??= (async () => {
    const baseUrl = process.env.CML_API_BASE_URL?.trim()
    const accessToken = process.env.CML_CONSUMER_ACCESS_TOKEN?.trim()
    if (!baseUrl || !accessToken) {
      throw new CmlAdapterError("configuration_missing", "CML server configuration is incomplete.")
    }

    try {
      const packageName: string = "@correnth/context-memory/sdk"
      const sdk = await import(packageName) as OfficialSdk
      const client = new sdk.CmlClient({ baseUrl, getAccessToken: () => accessToken })
      return { sdk, client }
    } catch (error) {
      if (error instanceof CmlAdapterError) throw error
      throw new CmlAdapterError("sdk_unavailable", "The official CML SDK is unavailable on the server.", error)
    }
  })()
  return clientPromise
}

export async function searchRedRiseGlobalContext(
  text: string,
  budget?: { inputTokens: number; outputTokens: number; maxResults: number },
): Promise<RedRiseGlobalContextResult> {
  try {
    const { sdk, client } = await loadClient()
    return await sdk.searchGlobalContext(client, text, budget ? { budget } : undefined)
  } catch (error) {
    if (error instanceof CmlAdapterError) throw error
    throw new CmlAdapterError("request_failed", "Global context is temporarily unavailable.", error)
  }
}