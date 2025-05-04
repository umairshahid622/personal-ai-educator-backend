import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
export declare class SubcategoryService {
    create(createSubcategoryDto: CreateSubcategoryDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateSubcategoryDto: UpdateSubcategoryDto): string;
    remove(id: number): string;
}
