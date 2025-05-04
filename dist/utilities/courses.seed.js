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
const subcategory_entity_1 = require("../subcategory/entities/subcategory.entity");
let CourseSeeder = class CourseSeeder {
    constructor(courseRepo, categoryRepo, subCategoryRepo) {
        this.courseRepo = courseRepo;
        this.categoryRepo = categoryRepo;
        this.subCategoryRepo = subCategoryRepo;
    }
    async onModuleInit() {
        await this.seedCourses();
    }
    async seedCourses() {
        const filePath = path.resolve(__dirname, "/Users/umairshahid/Desktop/Scraped data/Arts and Humanities.xlsx");
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const records = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        console.log(`📚 Found ${records.length} records to insert.`);
        for (const record of records) {
            const title = record["Title"]?.toString().trim();
            const url = record["URL"]?.toString().trim();
            if (!title || !url)
                continue;
            const exists = await this.courseRepo.findOne({ where: { title, url } });
            if (exists) {
                console.log(`⏭️ Already exists: ${title}`);
                continue;
            }
            const categoryName = record["Category"]?.toString().trim();
            if (!categoryName) {
                console.warn(`⚠️ Skipping "${title}" (no Category)`);
                continue;
            }
            let category = await this.categoryRepo.findOne({
                where: { name: categoryName },
            });
            if (!category) {
                category = this.categoryRepo.create({ name: categoryName });
                await this.categoryRepo.save(category);
                console.log(`➕ Created Category: ${categoryName}`);
            }
            const subCatName = record["Sub-Category"]?.toString().trim();
            let subCategory = null;
            if (subCatName) {
                subCategory = await this.subCategoryRepo.findOne({
                    where: {
                        name: subCatName,
                        isPassed: false,
                        category: category,
                    },
                    relations: ["category"],
                });
                if (!subCategory) {
                    subCategory = this.subCategoryRepo.create({
                        name: subCatName,
                        category: category,
                    });
                    await this.subCategoryRepo.save(subCategory);
                    console.log(`   🔖 Created SubCategory: ${subCatName}`);
                }
            }
            const course = this.courseRepo.create({
                uuid: (0, uuid_1.v4)(),
                title,
                url,
                category,
                subCategory,
                duration: record["Duration"]?.trim(),
                rating: record["Rating"]?.toString().trim() || "0",
                site: record["Site"]?.trim(),
                programType: record["Program Type"]?.trim()
                    ? "Free Course"
                    : "Paid Course",
                skills: record["Skills"]?.trim() || "",
            });
            try {
                await this.courseRepo.save(course);
                console.log(`✅ Inserted Course: ${title}`);
            }
            catch (err) {
                console.error(`❌ Failed to insert ${title}:`, err.message);
            }
        }
        console.log("🎉 All courses (plus categories & subcategories) seeded.");
    }
};
exports.CourseSeeder = CourseSeeder;
exports.CourseSeeder = CourseSeeder = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(course_entity_1.Courses)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Categories)),
    __param(2, (0, typeorm_1.InjectRepository)(subcategory_entity_1.SubCategory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CourseSeeder);
//# sourceMappingURL=courses.seed.js.map