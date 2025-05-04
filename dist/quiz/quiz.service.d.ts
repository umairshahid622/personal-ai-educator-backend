import { CreateQuizDto } from "./dto/create-quiz.dto";
import { UpdateQuizDto } from "./dto/update-quiz.dto";
import { Repository } from "typeorm";
import { Quiz } from "./entities/quiz.entity";
import { SubCategory } from "src/subcategory/entities/subcategory.entity";
export declare class QuizService {
    private readonly quizRepo;
    private readonly subCatRepo;
    private ai;
    constructor(quizRepo: Repository<Quiz>, subCatRepo: Repository<SubCategory>);
    getOrCreateForUser(userId: string, subCategoryId: string): Promise<Quiz>;
    private parseJsonArray;
    create(createQuizDto: CreateQuizDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateQuizDto: UpdateQuizDto): string;
    remove(id: number): string;
}
