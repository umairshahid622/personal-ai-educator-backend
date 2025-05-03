import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateQuizeDto, UpdateQuizStatusDto } from "./dto/create-quize.dto";
import { Quiz } from "./entities/quize.entity";

@Injectable()
export class QuizesService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>
  ) {}

  async saveQuizTitles(userId: string, createQuizeDto: CreateQuizeDto) {

    const existingQuiz = await this.quizRepository.findOne({
      where: {
        userId,
        categoryId: createQuizeDto.categoryId,
      },
    });

    if (existingQuiz) {

      existingQuiz.titles = createQuizeDto.titles;
      return this.quizRepository.save(existingQuiz);
    }

    const newQuiz = this.quizRepository.create({
      userId,
      categoryId: createQuizeDto.categoryId,
      titles: createQuizeDto.titles,
    });

    return this.quizRepository.save(newQuiz);
  }

  async getUserQuiz(userId: string, categoryId: string) {
    const quiz = await this.quizRepository.findOne({
      where: {
        userId,
        categoryId,
      },
    });

    return quiz;
  }

  async updateQuizStatus(userId: string, updateDto: UpdateQuizStatusDto) {
    const quiz = await this.quizRepository.findOne({
      where: {
        userId,
        categoryId: updateDto.categoryId,
      },
    });

    if (!quiz) {
      throw new NotFoundException("Quiz not found for this user");
    }

    const updatedTitles = quiz.titles.map((item) => {
      if (item.title === updateDto.previousTitle) {
        return { ...item, status: updateDto.previousTitleStatus };
      }
      if (item.title === updateDto.quizTitle) {
        return { ...item, status: updateDto.status };
      }
      return item;
    });

    quiz.titles = updatedTitles;

    return this.quizRepository.save(quiz);
  }

  async findAll() {
    return this.quizRepository.find();
  }
}
