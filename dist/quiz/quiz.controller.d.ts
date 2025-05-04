import { QuizService } from "./quiz.service";
export declare class QuizController {
    private readonly quizService;
    constructor(quizService: QuizService);
    getOrCreate(req: Request, subId: string): Promise<import("./entities/quiz.entity").Quiz>;
}
