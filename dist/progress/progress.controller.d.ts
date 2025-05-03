import { ProgressService } from './progress.service';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
export declare class ProgressController {
    private readonly progressService;
    constructor(progressService: ProgressService);
    create(createProgressDto: CreateProgressDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateProgressDto: UpdateProgressDto): string;
    remove(id: string): string;
}
