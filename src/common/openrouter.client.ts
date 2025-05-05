// src/common/openrouter.client.ts
import axios from "axios";

export interface AiChoice {
  message: { role: string; content: string };
}

export interface AiResponse {
  choices: AiChoice[];
}

export class OpenRouterClient {
  private readonly apiKey = process.env.OPENROUTER_API_KEY!;
  private readonly baseUrl = "https://openrouter.ai/api/v1/chat/completions";

  async getCompletion(prompt: string): Promise<AiResponse> {
    if (!this.apiKey) {
      throw new Error("Missing OPENROUTER_API_KEY in env");
    }
    try {
      const resp = await axios.post<AiResponse>(
        this.baseUrl,
        {
          model: "deepseek/deepseek-r1:free",
          messages: [{ role: "user", content: prompt }],
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (resp.status !== 200) {
        throw new Error(
          `AI error: ${resp.status} ${JSON.stringify(resp.data)}`
        );
      }

      const result = resp.data
      return result;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}
