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
exports.Quiz = void 0;
const subcategory_entity_1 = require("../../subcategory/entities/subcategory.entity");
const users_entity_1 = require("../../users/entities/users.entity");
const typeorm_1 = require("typeorm");
let Quiz = class Quiz {
};
exports.Quiz = Quiz;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Quiz.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, (u) => u.quizzes, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", users_entity_1.User)
], Quiz.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "user_id", type: "uuid" }),
    __metadata("design:type", String)
], Quiz.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => subcategory_entity_1.SubCategory, (s) => s.quizzes, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "subcategory_id" }),
    __metadata("design:type", subcategory_entity_1.SubCategory)
], Quiz.prototype, "subCategory", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "subcategory_id", type: "uuid" }),
    __metadata("design:type", String)
], Quiz.prototype, "subCategoryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb" }),
    __metadata("design:type", Array)
], Quiz.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], Quiz.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], Quiz.prototype, "updatedAt", void 0);
exports.Quiz = Quiz = __decorate([
    (0, typeorm_1.Entity)("quizzes")
], Quiz);
//# sourceMappingURL=quiz.entity.js.map