import { Repository } from "typeorm";
import { Degree } from "./entities/degree.entity";
export declare class DegreeService {
    private readonly degreeRepo;
    constructor(degreeRepo: Repository<Degree>);
    findForUser(userId: string): Promise<Degree[]>;
}
