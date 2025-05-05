import { CreateCategoryDto } from "./dto/create-category.dto";
import { Repository } from "typeorm";
import { Categories } from "./entities/category.entity";
export declare class CategoriesService {
    private readonly categoryRepo;
    constructor(categoryRepo: Repository<Categories>);
    createCategory(dto: CreateCategoryDto): Promise<Categories | undefined>;
    findAllCategories(): Promise<Categories[]>;
}
