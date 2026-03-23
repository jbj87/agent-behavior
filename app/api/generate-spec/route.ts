import { createSpecPrompt } from "@/lib/specGenerationPrompt";

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  let requirements: string;
  try {
    const body = await request.json();
    requirements = body.requirements;
  } catch {
    return Response.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  if (!requirements || requirements.trim().length < 20) {
    return Response.json(
      { error: "Requirements must be at least 20 characters." },
      { status: 400 }
    );
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        messages: [
          {
            role: "user",
            content: createSpecPrompt(requirements),
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const message =
        errorData?.error?.message || `Anthropic API error: ${response.status}`;
      return Response.json({ error: message }, { status: response.status });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text;

    if (!text) {
      return Response.json(
        { error: "No content returned from the API." },
        { status: 502 }
      );
    }

    return Response.json({ spec: text });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error occurred";
    return Response.json(
      { error: `Failed to generate specification: ${message}` },
      { status: 500 }
    );
  }
}
