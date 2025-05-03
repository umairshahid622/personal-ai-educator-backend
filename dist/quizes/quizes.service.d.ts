import { Repository } from "typeorm";
import { CreateQuizeDto, UpdateQuizStatusDto } from "./dto/create-quize.dto";
import { Quiz } from "./entities/quize.entity";
export declare class QuizesService {
    private readonly quizRepository;
    constructor(quizRepository: Repository<Quiz>);
    saveQuizTitles(userId: string, createQuizeDto: CreateQuizeDto): Promise<Quiz>;
    getUserQuiz(userId: string, categoryId: string): Promise<Quiz | null>;
    updateQuizStatus(userId: string, updateDto: UpdateQuizStatusDto): Promise<Quiz>;
    findAll(): Promise<Quiz[]>;
}
