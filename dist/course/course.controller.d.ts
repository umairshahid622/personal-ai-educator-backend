import { CourseService } from "./course.service";
import { CreateCourseDto, PaginationDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
export declare class CourseController {
    private readonly courseService;
    constructor(courseService: CourseService);
    findCourses(paginationDto: PaginationDto): Promise<{
        data: import("./entities/course.entity").Courses[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    create(createCourseDto: CreateCourseDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateCourseDto: UpdateCourseDto): string;
    remove(id: string): string;
}
