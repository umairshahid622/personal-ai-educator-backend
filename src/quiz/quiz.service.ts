import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateQuizDto } from "./dto/create-quiz.dto";
import { UpdateQuizDto, UpdateQuizItemDto } from "./dto/update-quiz.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Quiz } from "./entities/quiz.entity";
import { OpenRouterClient } from "src/common/openrouter.client";
import { SubCategory } from "src/subcategory/entities/subcategory.entity";

export interface Mcq {
  question: string;
  options: string[];
  answer: string;
}

@Injectable()
export class QuizService {
  private ai = new OpenRouterClient();
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepo: Repository<Quiz>,
    @InjectRepository(SubCategory)
    private readonly subCatRepo: Repository<SubCategory>
  ) {}

  async getOrCreateForUser(
    userId: string,
    subCategoryId: string
  ): Promise<Quiz> {
    // 1) existing?
    let quiz = await this.quizRepo.findOne({
      where: { userId, subCategoryId },
    });
    if (quiz) return quiz;

    // 2) otherwise load the SubCategory so we know its name
    const subCat = await this.subCatRepo.findOne({
      where: { id: subCategoryId },
    });
    if (!subCat) {
      throw new NotFoundException(`SubCategory ${subCategoryId} not found.`);
    }

    const prompt = `Generate exactly 7 quiz titles for the course ${subCat.name} in pure JSON format. 
Only the first quiz should have status "unlocked", the rest "locked".
Return a JSON array like:
[
  {"title":"…","status":"unlocked"},
  …,
  {"title":"…","status":"locked"}
]
No explanation—just JSON.`;

    const aiResp = await this.ai.getCompletion(prompt);
    const raw = aiResp.choices?.[0]?.message?.content ?? "";
    const items = this.parseJsonArray(raw);

    // 3) save
    quiz = this.quizRepo.create({
      userId,
      subCategoryId,
      items,
      isPassed: false,
    });
    return this.quizRepo.save(quiz);
  }

  async generateExamByTitle(
    userId: string,
    subCategoryId: string,
    title: string
  ): Promise<Mcq[]> {
    // (Optionally, verify that a QuizBundle exists for this user/subCategory/title)
    const prompt = `
    You are an expert question-writer.  
    Based on the topic: "${title}", generate exactly 10 multiple-choice questions.  
    
    ❶ Each question must be numbered Q1 through Q10.       
    ❷ Immediately after each question’s four options, add a line that begins with “Correct Answer:”
    ❸ Do NOT include any other text, explanation, or analysis—only the questions, options, and correct answers, in this exact format:
    
    Q1: [Your question here]  
    option a  
    option b  
    option c  
    option d  
    
    Correct Answer: [a|b|c|d]
    
    Q2: …  
    …  
    Q10: …  
    
    Make sure every “Correct Answer:” line matches the actual correct option above it.
    `;

    const aiResp = await this.ai.getCompletion(prompt);
    const raw = aiResp.choices?.[0]?.message?.content ?? "";
    return this.parseMcq(raw);
  }

  private parseMcq(raw: string): Mcq[] {
    // split on “Q” lines, basic parsing—adjust to your format
    const lines = raw
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    const questions: Mcq[] = [];
    let current: Partial<Mcq> = {};
    for (const line of lines) {
      if (/^Q\d+:/.test(line)) {
        if (current.question) questions.push(current as Mcq);
        current = { question: line.replace(/^Q\d+:\s*/, ""), options: [] };
      } else if (/^[abcd]\)/.test(line)) {
        current.options!.push(line);
      } else if (/^Correct Answer:/i.test(line)) {
        current.answer = line.replace(/^Correct Answer:\s*/i, "");
      }
    }
    if (current.question) questions.push(current as Mcq);

    return questions;
  }

  async updateStatusByTitle(
    userId: string,
    dto: UpdateQuizItemDto
  ): Promise<any> {
    const { subCategoryId, title, marks } = dto;

    const quiz = await this.quizRepo.findOne({
      where: { userId, subCategoryId },
    });
    if (!quiz) throw new NotFoundException("Quiz bundle not found");

    const idx = quiz.items.findIndex((i) => i.title === title);
    if (idx === -1) throw new NotFoundException("Quiz title not found");

    const passed = marks >= 7;
    quiz.items[idx].status = passed ? "passed" : "fail";

    if (passed && idx + 1 < quiz.items.length) {
      if (quiz.items[idx + 1].status === "locked") {
        quiz.items[idx + 1].status = "unlocked";
      }
    }

    // recompute overall isPassed: all items must be passed
    quiz.isPassed = quiz.items.every((it) => it.status === "passed");

    await this.quizRepo.save(quiz);

    return {
      message: passed ? "Quiz has been passed." : "Quiz has been failed.",
      status: passed ? "passed" : "fail",
      title,
    };
  }

  private parseJsonArray(raw: string) {
    const fence = /```(?:json)?\s*([\s\S]*?)\s*```/i.exec(raw);
    const jsonText = fence ? fence[1] : raw;
    return JSON.parse(jsonText.trim());
  }
}
