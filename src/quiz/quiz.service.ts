import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateQuizDto } from "./dto/create-quiz.dto";
import { UpdateQuizDto } from "./dto/update-quiz.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Quiz } from "./entities/quiz.entity";
import { OpenRouterClient } from "src/common/openrouter.client";
import { SubCategory } from "src/subcategory/entities/subcategory.entity";

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
  {"title":"Quiz 1: …","status":"unlocked"},
  …,
  {"title":"Quiz 7: …","status":"locked"}
]
No explanation—just JSON.`;

    const aiResp = await this.ai.getCompletion(prompt);
    const raw = aiResp.choices?.[0]?.message?.content ?? "";
    const items = this.parseJsonArray(raw);

    // 3) save
    quiz = this.quizRepo.create({ userId, subCategoryId, items });
    return this.quizRepo.save(quiz);
  }

  private parseJsonArray(raw: string) {
    const fence = /```(?:json)?\s*([\s\S]*?)\s*```/i.exec(raw);
    const jsonText = fence ? fence[1] : raw;
    return JSON.parse(jsonText.trim());
  }

  create(createQuizDto: CreateQuizDto) {
    return "This action adds a new quiz";
  }

  findAll() {
    return `This action returns all quiz`;
  }

  findOne(id: number) {
    return `This action returns a #${id} quiz`;
  }

  update(id: number, updateQuizDto: UpdateQuizDto) {
    return `This action updates a #${id} quiz`;
  }

  remove(id: number) {
    return `This action removes a #${id} quiz`;
  }
}
