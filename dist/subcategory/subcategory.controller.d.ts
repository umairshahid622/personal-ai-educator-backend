import { SubcategoryService } from './subcategory.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
export declare class SubcategoryController {
    private readonly subcategoryService;
    constructor(subcategoryService: SubcategoryService);
    create(createSubcategoryDto: CreateSubcategoryDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateSubcategoryDto: UpdateSubcategoryDto): string;
    remove(id: string): string;
}
