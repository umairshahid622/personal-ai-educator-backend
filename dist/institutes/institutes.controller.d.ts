import { InstitutesService } from "./institutes.service";
import { CreateInstituteDto } from "./dto/create-institute.dto";
import { UpdateInstituteDto } from "./dto/update-institute.dto";
export declare class InstitutesController {
    private readonly institutesService;
    constructor(institutesService: InstitutesService);
    create(createInstituteDto: CreateInstituteDto): Promise<import("./entities/institute.entity").Institute>;
    findByCourse(courseName: string): Promise<import("./entities/institute.entity").Institute[]>;
    findAll(): Promise<import("./entities/institute.entity").Institute[]>;
    findOne(id: string): string;
    update(id: string, updateInstituteDto: UpdateInstituteDto): string;
    remove(id: string): string;
}
