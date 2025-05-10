// src/common/openrouter.client.ts
import axios, { AxiosInstance } from "axios";

export class OpenRouterClient {
  private client: AxiosInstance;
  private key: string;

  constructor() {
    this.key = process.env.OPENROUTER_API_KEY || "";
    if (!this.key) {
      throw new Error(
        "Missing OPENROUTER_API_KEY environment variable. " +
          "Please set it to your valid OpenRouter API key."
      );
    }

    this.client = axios.create({
      baseURL: "https://openrouter.ai/api/v1",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.key}`,
      },
    });
  }

  async getCompletion(prompt: string) {
    try {
      const resp = await this.client.post("/chat/completions", {
        model: "deepseek/deepseek-r1:free",
        messages: [{ role: "user", content: prompt }],
        stream: false,
      });
      return resp.data;
    } catch (err: any) {
      // AxiosError
      if (err.response?.status === 401) {
        throw new Error(
          "OpenRouter authentication failed (401). " +
            "Check your OPENROUTER_API_KEY."
        );
      }
      throw new Error(`OpenRouter request failed: ${err.message}`);
    }
  }
}
