import { PaginationDto } from "./dto/create-course.dto";
import { Courses } from "./entities/course.entity";
import { Repository } from "typeorm";
import { FindCoursesDto } from "./dto/find-course.dto";
export declare class CourseService {
    private readonly courseRepo;
    constructor(courseRepo: Repository<Courses>);
    paginate({ page, limit, categoryId }: PaginationDto): Promise<{
        data: Courses[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    findPaginated(dto: FindCoursesDto): Promise<{
        data: Courses[];
        page: number;
        lastPage: number;
        total: number;
    }>;
}
