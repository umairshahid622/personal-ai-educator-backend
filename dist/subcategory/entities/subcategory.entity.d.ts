import { Categories } from "../../categories/entities/category.entity";
import { Courses } from "../../course/entities/course.entity";
export declare class SubCategory {
    id: string;
    name: string;
    category: Categories;
    courses: Courses[];
    isPassed: boolean;
}
