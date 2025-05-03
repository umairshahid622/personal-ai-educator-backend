import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { Repository } from "typeorm";
import { Categories } from "./entities/category.entity";
export declare class CategoriesService {
    private readonly categoryRepo;
    constructor(categoryRepo: Repository<Categories>);
    createCategory(dto: CreateCategoryDto): Promise<Categories | undefined>;
    findAllCategories(): Promise<Categories[]>;
    create(createCategoryDto: CreateCategoryDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateCategoryDto: UpdateCategoryDto): string;
    remove(id: number): string;
}
