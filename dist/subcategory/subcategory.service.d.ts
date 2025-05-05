import { SubCategory } from "./entities/subcategory.entity";
import { Repository } from "typeorm";
export declare class SubcategoryService {
    private readonly subRepo;
    constructor(subRepo: Repository<SubCategory>);
    findByCategory(categoryId: string): Promise<SubCategory[]>;
}
