import { OnModuleInit } from "@nestjs/common";
import { Repository } from "typeorm";
import { Courses } from "src/course/entities/course.entity";
import { Categories } from "src/categories/entities/category.entity";
export declare class CourseSeeder implements OnModuleInit {
    private readonly courseRepo;
    private readonly categoryRepo;
    constructor(courseRepo: Repository<Courses>, categoryRepo: Repository<Categories>);
    onModuleInit(): Promise<void>;
    seedCourses(): Promise<void>;
}
