import { InstitutesService } from "./institutes.service";
import { CreateInstituteDto } from "./dto/create-institute.dto";
export declare class InstitutesController {
    private readonly institutesService;
    constructor(institutesService: InstitutesService);
    create(createInstituteDto: CreateInstituteDto): Promise<import("./entities/institute.entity").Institute>;
    bulkCreate(list: CreateInstituteDto[]): Promise<import("./entities/institute.entity").Institute[]>;
    findByCourseName(courseName: string): Promise<import("./entities/institute.entity").Institute[]>;
}
