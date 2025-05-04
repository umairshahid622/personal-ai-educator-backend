import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(createCategoryDto: CreateCategoryDto): Promise<import("./entities/category.entity").Categories | undefined>;
    find3Categories(): Promise<import("./entities/category.entity").Categories[]>;
}
