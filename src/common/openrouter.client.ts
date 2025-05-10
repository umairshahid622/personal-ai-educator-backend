// src/common/openrouter.client.ts
import axios, { AxiosInstance } from "axios";

export class OpenRouterClient {
  private readonly lectureKey: string;
  private readonly quizKey: string;
  private readonly mcqKey: string;
  private readonly baseURL = "https://openrouter.ai/api/v1";
  private readonly model = "deepseek/deepseek-r1:free";

  constructor() {
    this.lectureKey = process.env.OPENROUTER_API_KEY_LECTURE || "";
    this.quizKey = process.env.OPENROUTER_API_KEY_QUIZ_TITLES || "";
    this.mcqKey = process.env.OPENROUTER_API_KEY_MCQS || "";
  }

  async generateLecture(topic: string) {
    const prompt = `You are an expert lecturer.\nProvide a comprehensive lecture on the topic: "${topic}".\nUse clear headings, concise explanations, and examples.\nNo conversational filler—just the lecture content.`;
    const client = this.createClient(this.lectureKey, "LECTURE");
    return this.doCompletion(client, prompt, "Lecture generation failed");
  }

  async generateQuizTitles(courseName: string) {
    const prompt = `Generate exactly 7 quiz titles for the course ${courseName} in pure JSON format.
  Only the first quiz should have status "unlocked", the rest "locked".
  Return a JSON array like:
  [
    {"title":"…","status":"unlocked"},
    …,
    {"title":"…","status":"locked"}
  ]
  No explanation—just JSON.`;
    const client = this.createClient(this.quizKey, "QUIZ TITLES");
    return this.doCompletion(client, prompt, "Quiz title generation failed");
  }

  async generateMcqs(topic: string) {
    const prompt = `You are an expert question-writer.
Based on the subject or topic: "${topic}", generate exactly 10 multiple-choice questions that fully cover the key concepts.
❶ Number questions Q1 through Q10.
❷ After each question’s four options, add a line “Correct Answer:” indicating the correct choice.
❸ Include no additional text—only the questions, options, and answer lines in this format:

Q1: [Question]
option a
option b
option c
option d

Correct Answer: [a|b|c|d]

… through Q10.
Ensure each 'Correct Answer:' matches the correct option above it.`;
    const client = this.createClient(this.mcqKey, "MCQ");
    return this.doCompletion(client, prompt, "MCQ generation failed");
  }

  private createClient(apiKey: string, keyName: string): AxiosInstance {
    if (!apiKey) {
      throw new Error(
        `Missing or Expired OPENROUTER_${keyName}_API_KEY environment variable.`
      );
    }
    return axios.create({
      baseURL: this.baseURL,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    });
  }

  private async doCompletion(
    client: AxiosInstance,
    prompt: string,
    errorMessage: string
  ) {
    try {
      const resp = await client.post("/chat/completions", {
        model: this.model,
        messages: [{ role: "user", content: prompt }],
        stream: false,
      });
      return resp.data;
    } catch (err: any) {
      if (err.response?.status === 401) {
        throw new Error(
          `${errorMessage}: authentication failed (401). Check your API key.`
        );
      }
      throw new Error(`${errorMessage}: ${err.message}`);
    }
  }
}
