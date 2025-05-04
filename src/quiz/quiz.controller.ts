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
} from "@nestjs/common";
import { QuizService } from "./quiz.service";
import { CreateQuizDto } from "./dto/create-quiz.dto";
import { AuthGuard } from "src/guards/auth/auth.guard";

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
}
