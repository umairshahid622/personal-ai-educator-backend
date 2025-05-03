import { Categories } from "src/categories/entities/category.entity";
import { User } from "src/users/entities/users.entity";
interface QuizTitle {
    title: string;
    status: string;
}
export declare class Quiz {
    id: string;
    user: User;
    userId: string;
    category: Categories;
    categoryId: string;
    titles: QuizTitle[];
    createdAt: Date;
}
export {};
