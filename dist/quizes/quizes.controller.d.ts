import { QuizesService } from "./quizes.service";
import { CreateQuizeDto } from "./dto/create-quize.dto";
import { UpdateQuizStatusDto } from "./dto/update-quiz-status.dto";
export declare class QuizesController {
    private readonly quizesService;
    constructor(quizesService: QuizesService);
    saveQuizTitles(req: any, createQuizeDto: CreateQuizeDto): Promise<import("./entities/quize.entity").Quiz>;
    getUserQuiz(req: any, categoryId: string): Promise<import("./entities/quize.entity").Quiz | null>;
    updateStatus(req: any, updateDto: UpdateQuizStatusDto): Promise<import("./entities/quize.entity").Quiz>;
    findAll(): Promise<import("./entities/quize.entity").Quiz[]>;
}
