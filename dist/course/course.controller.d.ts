import { CourseService } from "./course.service";
import { PaginationDto } from "./dto/create-course.dto";
export declare class CourseController {
    private readonly courseService;
    constructor(courseService: CourseService);
    findCourses(paginationDto: PaginationDto): Promise<{
        data: import("./entities/course.entity").Courses[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    search(page: number | undefined, limit: number | undefined, categoryUuid: string, search?: string): Promise<{
        data: import("./entities/course.entity").Courses[];
        page: number;
        lastPage: number;
        total: number;
    }>;
}
