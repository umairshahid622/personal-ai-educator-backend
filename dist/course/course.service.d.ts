import { CreateCourseDto, PaginationDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { Courses } from "./entities/course.entity";
import { Repository } from "typeorm";
export declare class CourseService {
    private readonly courseRepo;
    constructor(courseRepo: Repository<Courses>);
    paginate({ page, limit, categoryId }: PaginationDto): Promise<{
        data: Courses[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    create(createCourseDto: CreateCourseDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateCourseDto: UpdateCourseDto): string;
    remove(id: number): string;
}
