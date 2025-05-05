import { UpdateQuizItemDto } from "./dto/update-quiz.dto";
import { Repository } from "typeorm";
import { Quiz } from "./entities/quiz.entity";
import { SubCategory } from "src/subcategory/entities/subcategory.entity";
import { Certificate } from "src/certificates/entities/certificate.entity";
import { Degree } from "src/degree/entities/degree.entity";
import { User } from "src/users/entities/users.entity";
import { Categories } from "src/categories/entities/category.entity";
export interface Mcq {
    question: string;
    options: string[];
    answer: string;
}
export declare class QuizService {
    private readonly quizRepo;
    private readonly subCatRepo;
    private readonly certRepo;
    private readonly degreeRepo;
    private readonly userRepo;
    private readonly catRepo;
    private ai;
    constructor(quizRepo: Repository<Quiz>, subCatRepo: Repository<SubCategory>, certRepo: Repository<Certificate>, degreeRepo: Repository<Degree>, userRepo: Repository<User>, catRepo: Repository<Categories>);
    getOrCreateForUser(userId: string, subCategoryId: string): Promise<Quiz>;
    generateExamByTitle(userId: string, subCategoryId: string, title: string): Promise<Mcq[]>;
    private parseMcq;
    updateStatusByTitle(userId: string, dto: UpdateQuizItemDto): Promise<any>;
    getUserBundles(userId: string): Promise<Quiz[]>;
    private parseJsonArray;
    private buildSubCategoryPdf;
    private buildDegreePdf;
}
