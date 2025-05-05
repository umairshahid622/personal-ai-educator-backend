import { Categories } from "src/categories/entities/category.entity";
import { User } from "src/users/entities/users.entity";
export declare class Degree {
    id: string;
    user: User;
    userId: string;
    category: Categories;
    categoryId: string;
    pdfPath: string;
    issuedAt: Date;
}
