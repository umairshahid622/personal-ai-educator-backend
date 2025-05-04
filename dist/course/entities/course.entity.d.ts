import { Categories } from "src/categories/entities/category.entity";
import { SubCategory } from "src/subcategory/entities/subcategory.entity";
export declare class Courses {
    uuid: string;
    title: string;
    url: string;
    category: Categories;
    categoryUuid: string;
    subCategory: SubCategory | null;
    subCategoryId: string | null;
    duration: string | null;
    rating: string;
    site: string | null;
    programType: string;
    skills: string | null;
}
