"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenRouterClient = void 0;
const axios_1 = require("axios");
class OpenRouterClient {
    constructor() {
        this.key = process.env.OPENROUTER_API_KEY || "";
        if (!this.key) {
            throw new Error("Missing OPENROUTER_API_KEY environment variable. " +
                "Please set it to your valid OpenRouter API key.");
        }
        this.client = axios_1.default.create({
            baseURL: "https://openrouter.ai/api/v1",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.key}`,
            },
        });
    }
    async getCompletion(prompt) {
        try {
            const resp = await this.client.post("/chat/completions", {
                model: "deepseek/deepseek-r1:free",
                messages: [{ role: "user", content: prompt }],
                stream: false,
            });
            return resp.data;
        }
        catch (err) {
            if (err.response?.status === 401) {
                throw new Error("OpenRouter authentication failed (401). " +
                    "Check your OPENROUTER_API_KEY.");
            }
            throw new Error(`OpenRouter request failed: ${err.message}`);
        }
    }
}
exports.OpenRouterClient = OpenRouterClient;
//# sourceMappingURL=openrouter.client.js.map