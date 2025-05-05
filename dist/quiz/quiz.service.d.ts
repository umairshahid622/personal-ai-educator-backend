import { UpdateQuizItemDto } from "./dto/update-quiz.dto";
import { Repository } from "typeorm";
import { Quiz } from "./entities/quiz.entity";
import { SubCategory } from "src/subcategory/entities/subcategory.entity";
export interface Mcq {
    question: string;
    options: string[];
    answer: string;
}
export declare class QuizService {
    private readonly quizRepo;
    private readonly subCatRepo;
    private ai;
    constructor(quizRepo: Repository<Quiz>, subCatRepo: Repository<SubCategory>);
    getOrCreateForUser(userId: string, subCategoryId: string): Promise<Quiz>;
    generateExamByTitle(userId: string, subCategoryId: string, title: string): Promise<Mcq[]>;
    private parseMcq;
    updateStatusByTitle(userId: string, dto: UpdateQuizItemDto): Promise<any>;
    private parseJsonArray;
}
