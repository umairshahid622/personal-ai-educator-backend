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
exports.Courses = void 0;
const typeorm_1 = require("typeorm");
const category_entity_1 = require("../../categories/entities/category.entity");
const subcategory_entity_1 = require("../../subcategory/entities/subcategory.entity");
let Courses = class Courses {
};
exports.Courses = Courses;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Courses.prototype, "uuid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], Courses.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], Courses.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => category_entity_1.Categories, (category) => category.courses, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: "categoryUuid" }),
    __metadata("design:type", category_entity_1.Categories)
], Courses.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "categoryUuid", type: "uuid" }),
    __metadata("design:type", String)
], Courses.prototype, "categoryUuid", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => subcategory_entity_1.SubCategory, (sub) => sub.courses, {
        nullable: true,
        eager: true,
    }),
    (0, typeorm_1.JoinColumn)({ name: "subCategoryId" }),
    __metadata("design:type", Object)
], Courses.prototype, "subCategory", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "subCategoryId", type: "uuid", nullable: true }),
    __metadata("design:type", Object)
], Courses.prototype, "subCategoryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 100, nullable: true }),
    __metadata("design:type", Object)
], Courses.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 10, default: "0" }),
    __metadata("design:type", String)
], Courses.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", Object)
], Courses.prototype, "site", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50 }),
    __metadata("design:type", String)
], Courses.prototype, "programType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", Object)
], Courses.prototype, "skills", void 0);
exports.Courses = Courses = __decorate([
    (0, typeorm_1.Entity)({ name: "courses" })
], Courses);
//# sourceMappingURL=course.entity.js.map