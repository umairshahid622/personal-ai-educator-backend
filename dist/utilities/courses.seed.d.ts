import { OnModuleInit } from "@nestjs/common";
import { Repository } from "typeorm";
import { Courses } from "src/course/entities/course.entity";
import { Categories } from "src/categories/entities/category.entity";
import { SubCategory } from "src/subcategory/entities/subcategory.entity";
export declare class CourseSeeder implements OnModuleInit {
    private readonly courseRepo;
    private readonly categoryRepo;
    private readonly subCategoryRepo;
    constructor(courseRepo: Repository<Courses>, categoryRepo: Repository<Categories>, subCategoryRepo: Repository<SubCategory>);
    onModuleInit(): Promise<void>;
    private seedCourses;
}
