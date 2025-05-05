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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubCategory = void 0;
const typeorm_1 = require("typeorm");
const category_entity_1 = require("../../categories/entities/category.entity");
const course_entity_1 = require("../../course/entities/course.entity");
const quiz_entity_1 = require("../../quiz/entities/quiz.entity");
let SubCategory = class SubCategory {
};
exports.SubCategory = SubCategory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], SubCategory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SubCategory.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => category_entity_1.Categories, (category) => category.subCategories, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", category_entity_1.Categories)
], SubCategory.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => quiz_entity_1.Quiz, (quiz) => quiz.subCategory),
    __metadata("design:type", Array)
], SubCategory.prototype, "quizzes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => course_entity_1.Courses, (course) => course.subCategory),
    __metadata("design:type", Array)
], SubCategory.prototype, "courses", void 0);
exports.SubCategory = SubCategory = __decorate([
    (0, typeorm_1.Entity)()
], SubCategory);
//# sourceMappingURL=subcategory.entity.js.map