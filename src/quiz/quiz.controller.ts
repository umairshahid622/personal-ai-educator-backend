import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  NotFoundException,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { QuizService } from "./quiz.service";
import { CreateQuizDto } from "./dto/create-quiz.dto";
import { AuthGuard } from "src/guards/auth/auth.guard";
import { Quiz } from "./entities/quiz.entity";
import { UpdateQuizItemDto } from "./dto/update-quiz.dto";

@Controller("quizzes")
@UseGuards(AuthGuard)
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get()
  async getOrCreate(
    @Req() req: Request,
    @Query("subcategoryId") subId: string
  ) {
    const userId = req["user"]["userId"];
    return this.quizService.getOrCreateForUser(userId, subId);
  }
  @Get("exam")
  async generateExamByTitle(
    @Query("title") title: string,
    @Query("subCategoryId") subCategoryId: string,
    @Req() req: Request
  ) {
    if (!title) {
      throw new NotFoundException("quiz title is required");
    }
    const userId: string = req["user"]["userId"];

    return this.quizService.generateExamByTitle(userId, subCategoryId, title);
  }

  @Patch("item-status")
  async updateItemStatus(
    @Req() req: Request,
    @Body() dto: UpdateQuizItemDto
  ): Promise<any> {
    const userId = req["user"]["userId"];
    return this.quizService.updateStatusByTitle(userId, dto);
  }

  @Get("getUserBundle")
  async getUserBundles(@Req() req: Request) {
    const userId = req["user"]["userId"];
    return this.quizService.getUserBundles(userId);
  }
}
