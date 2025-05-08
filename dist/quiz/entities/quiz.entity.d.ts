import { SubCategory } from "src/subcategory/entities/subcategory.entity";
import { User } from "src/users/entities/users.entity";
export declare class Quiz {
    id: string;
    user: User;
    userId: string;
    subCategory: SubCategory;
    subCategoryId: string;
    items: {
        title: string;
        status: "locked" | "unlocked" | "passed" | "failed";
    }[];
    isPassed: boolean;
    createdAt: Date;
    updatedAt: Date;
}
