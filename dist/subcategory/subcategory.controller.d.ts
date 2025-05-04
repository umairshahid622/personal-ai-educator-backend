import { SubcategoryService } from "./subcategory.service";
export declare class SubcategoryController {
    private readonly subcategoryService;
    constructor(subcategoryService: SubcategoryService);
    findByCategory(id: string): Promise<import("./entities/subcategory.entity").SubCategory[]>;
}
