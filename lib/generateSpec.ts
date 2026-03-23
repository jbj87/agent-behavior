interface GenerateSpecResponse {
  spec?: string;
  error?: string;
}

export async function generateSpec(requirements: string): Promise<string> {
  const response = await fetch("/api/generate-spec", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requirements }),
  });

  const data: GenerateSpecResponse = await response.json();

  if (!response.ok || data.error) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  if (!data.spec) {
    throw new Error("No specification returned.");
  }

  return data.spec;
}
