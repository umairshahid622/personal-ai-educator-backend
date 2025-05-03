"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseSeeder = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const path = require("path");
const xlsx = require("xlsx");
const uuid_1 = require("uuid");
const course_entity_1 = require("../course/entities/course.entity");
const category_entity_1 = require("../categories/entities/category.entity");
let CourseSeeder = class CourseSeeder {
    constructor(courseRepo, categoryRepo) {
        this.courseRepo = courseRepo;
        this.categoryRepo = categoryRepo;
    }
    async onModuleInit() {
        await this.seedCourses();
    }
    async seedCourses() {
        const filePath = path.resolve(__dirname, "/Users/umairshahid/Desktop/Scraped data/Social Sciences.xlsx");
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const records = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        console.log(`📚 Found ${records.length} records to insert.`);
        for (const record of records) {
            const existing = await this.courseRepo.findOne({
                where: { title: record["Title"]?.trim(), url: record["URL"]?.trim() },
            });
            if (existing) {
                console.log(`⏭️ Course already exists: ${record["Title"]}`);
                continue;
            }
            try {
                const categoryName = record["Category"]?.trim();
                if (!categoryName) {
                    console.warn(`⚠️ Skipping course with missing category.`);
                    continue;
                }
                let category = await this.categoryRepo.findOne({
                    where: { name: categoryName },
                });
                if (!category) {
                    category = this.categoryRepo.create({ name: categoryName });
                    await this.categoryRepo.save(category);
                    console.log(`➕ Created new category: ${categoryName}`);
                }
                const course = this.courseRepo.create({
                    uuid: (0, uuid_1.v4)(),
                    title: record["Title"]?.trim(),
                    url: record["URL"]?.trim(),
                    category: category,
                    duration: record["Duration"]?.trim(),
                    rating: record["Rating"]?.toString().trim() || "0",
                    site: record["Site"]?.trim(),
                    subCategory: record["Sub-Category"]?.trim(),
                    programType: record["Program Type"]?.trim() ? "Free Course" : "Paid Course",
                    skills: record["Skills"]?.trim() || "",
                });
                await this.courseRepo.save(course);
            }
            catch (error) {
                console.error(`❌ Failed to insert course: ${record["Title"]}`, error.message);
            }
        }
        console.log("✅ All courses seeded successfully.");
    }
};
exports.CourseSeeder = CourseSeeder;
exports.CourseSeeder = CourseSeeder = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(course_entity_1.Courses)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Categories)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CourseSeeder);
//# sourceMappingURL=courses.seed.js.map