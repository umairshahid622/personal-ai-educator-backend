export interface AiChoice {
    message: {
        role: string;
        content: string;
    };
}
export interface AiResponse {
    choices: AiChoice[];
}
export declare class OpenRouterClient {
    private readonly apiKey;
    private readonly baseUrl;
    getCompletion(prompt: string): Promise<AiResponse>;
}
