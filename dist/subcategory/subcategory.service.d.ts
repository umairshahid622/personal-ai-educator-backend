import { CreateSubcategoryDto } from "./dto/create-subcategory.dto";
import { UpdateSubcategoryDto } from "./dto/update-subcategory.dto";
import { SubCategory } from "./entities/subcategory.entity";
import { Repository } from "typeorm";
export declare class SubcategoryService {
    private readonly subRepo;
    constructor(subRepo: Repository<SubCategory>);
    findByCategory(categoryId: string): Promise<SubCategory[]>;
    create(createSubcategoryDto: CreateSubcategoryDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateSubcategoryDto: UpdateSubcategoryDto): string;
    remove(id: number): string;
}
