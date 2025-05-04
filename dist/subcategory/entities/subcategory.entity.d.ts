import { Categories } from "../../categories/entities/category.entity";
import { Courses } from "../../course/entities/course.entity";
import { Quiz } from "src/quiz/entities/quiz.entity";
export declare class SubCategory {
    id: string;
    name: string;
    category: Categories;
    quizzes: Quiz[];
    courses: Courses[];
    isPassed: boolean;
}
