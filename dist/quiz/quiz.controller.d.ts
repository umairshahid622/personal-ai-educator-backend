import { QuizService } from "./quiz.service";
import { Quiz } from "./entities/quiz.entity";
import { UpdateQuizItemDto } from "./dto/update-quiz.dto";
export declare class QuizController {
    private readonly quizService;
    constructor(quizService: QuizService);
    getOrCreate(req: Request, subId: string): Promise<Quiz>;
    generateExamByTitle(title: string, subCategoryId: string, req: Request): Promise<import("./quiz.service").Mcq[]>;
    updateItemStatus(req: Request, dto: UpdateQuizItemDto): Promise<any>;
    getUserBundles(req: Request): Promise<Quiz[]>;
}
