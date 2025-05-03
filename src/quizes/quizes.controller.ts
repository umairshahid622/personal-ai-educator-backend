import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
} from "@nestjs/common";
import { QuizesService } from "./quizes.service";
import { CreateQuizeDto } from "./dto/create-quize.dto";
import { UpdateQuizStatusDto } from "./dto/update-quiz-status.dto";
import { AuthGuard } from "src/guards/auth/auth.guard";

@Controller("quizes")
@UseGuards(AuthGuard)
export class QuizesController {
  constructor(private readonly quizesService: QuizesService) {}

  @Post("save")
  saveQuizTitles(@Req() req, @Body() createQuizeDto: CreateQuizeDto) {
    const userId = req.user.userId;
    return this.quizesService.saveQuizTitles(userId, createQuizeDto);
  }

  @Get("user-quiz/:categoryId")
  getUserQuiz(@Req() req, @Param("categoryId") categoryId: string) {
    const userId = req.user.userId;
    return this.quizesService.getUserQuiz(userId, categoryId);
  }

  @Patch("status")
  updateStatus(@Req() req, @Body() updateDto: UpdateQuizStatusDto) {
    const userId = req.user.userId;
    return this.quizesService.updateQuizStatus(userId, updateDto);
  }

  @Get()
  findAll() {
    return this.quizesService.findAll();
  }
}
