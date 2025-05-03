import { CreateInstituteDto } from "./dto/create-institute.dto";
import { UpdateInstituteDto } from "./dto/update-institute.dto";
import { Institute } from "./entities/institute.entity";
import { Repository } from "typeorm";
export declare class InstitutesService {
    private instituteRepository;
    constructor(instituteRepository: Repository<Institute>);
    create(createInstituteDto: CreateInstituteDto): Promise<Institute>;
    findByCourseName(courseName: string): Promise<Institute[]>;
    findAll(): Promise<Institute[]>;
    findOne(id: number): string;
    update(id: number, updateInstituteDto: UpdateInstituteDto): string;
    remove(id: number): string;
}
