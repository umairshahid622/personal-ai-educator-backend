import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
export declare class ProgressService {
    create(createProgressDto: CreateProgressDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateProgressDto: UpdateProgressDto): string;
    remove(id: number): string;
}
