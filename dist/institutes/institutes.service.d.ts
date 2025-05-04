import { CreateInstituteDto } from "./dto/create-institute.dto";
import { Institute } from "./entities/institute.entity";
import { Repository } from "typeorm";
export declare class InstitutesService {
    private instituteRepository;
    constructor(instituteRepository: Repository<Institute>);
    create(createInstituteDto: CreateInstituteDto): Promise<Institute>;
    bulkCreate(list: CreateInstituteDto[]): Promise<Institute[]>;
    findByCourseName(courseName: string): Promise<Institute[]>;
}
