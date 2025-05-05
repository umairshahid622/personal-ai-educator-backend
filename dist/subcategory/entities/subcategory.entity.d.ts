import { Categories } from "../../categories/entities/category.entity";
import { Courses } from "../../course/entities/course.entity";
import { Quiz } from "src/quiz/entities/quiz.entity";
import { Certificate } from "src/certificates/entities/certificate.entity";
export declare class SubCategory {
    id: string;
    name: string;
    category: Categories;
    quizzes: Quiz[];
    courses: Courses[];
    certificates: Certificate[];
}
