import { DegreeService } from "./degree.service";
import { Degree } from "./entities/degree.entity";
export declare class DegreeController {
    private readonly degreeService;
    constructor(degreeService: DegreeService);
    findAll(req: Request): Promise<Degree[]>;
}
