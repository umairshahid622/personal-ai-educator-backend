import { SubCategory } from "src/subcategory/entities/subcategory.entity";
import { User } from "src/users/entities/users.entity";
export declare class Certificate {
    id: string;
    user: User;
    userId: string;
    subCategory: SubCategory;
    subCategoryId: string;
    pdfPath: string;
    issuedAt: Date;
    originalName: string;
}
