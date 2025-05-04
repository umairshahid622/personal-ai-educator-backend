"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenRouterClient = void 0;
const axios_1 = require("axios");
class OpenRouterClient {
    constructor() {
        this.apiKey = process.env.OPENROUTER_API_KEY;
        this.baseUrl = "https://openrouter.ai/api/v1/chat/completions";
    }
    async getCompletion(prompt) {
        if (!this.apiKey) {
            throw new Error("Missing OPENROUTER_API_KEY in env");
        }
        const resp = await axios_1.default.post(this.baseUrl, {
            model: "deepseek/deepseek-r1:free",
            messages: [{ role: "user", content: prompt }],
        }, {
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
                "Content-Type": "application/json",
            },
        });
        if (resp.status !== 200) {
            throw new Error(`AI error: ${resp.status} ${JSON.stringify(resp.data)}`);
        }
        return resp.data;
    }
}
exports.OpenRouterClient = OpenRouterClient;
//# sourceMappingURL=openrouter.client.js.map