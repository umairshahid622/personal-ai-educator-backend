import { Courses } from "src/course/entities/course.entity";
import { SubCategory } from "src/subcategory/entities/subcategory.entity";
export declare class Categories {
    uuid: string;
    name: string;
    imageUrl: string;
    courses: Courses[];
    subCategories: SubCategory[];
}
