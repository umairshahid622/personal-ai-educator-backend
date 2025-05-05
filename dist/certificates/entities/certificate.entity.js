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
exports.Certificate = void 0;
const subcategory_entity_1 = require("../../subcategory/entities/subcategory.entity");
const users_entity_1 = require("../../users/entities/users.entity");
const typeorm_1 = require("typeorm");
let Certificate = class Certificate {
};
exports.Certificate = Certificate;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Certificate.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, (u) => u.certificates, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", users_entity_1.User)
], Certificate.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)("uuid", { name: "user_id" }),
    __metadata("design:type", String)
], Certificate.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => subcategory_entity_1.SubCategory, (s) => s.certificates, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "subcategory_id" }),
    __metadata("design:type", subcategory_entity_1.SubCategory)
], Certificate.prototype, "subCategory", void 0);
__decorate([
    (0, typeorm_1.Column)("uuid", { name: "subcategory_id" }),
    __metadata("design:type", String)
], Certificate.prototype, "subCategoryId", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { name: "pdf_path" }),
    __metadata("design:type", String)
], Certificate.prototype, "pdfPath", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "issued_at" }),
    __metadata("design:type", Date)
], Certificate.prototype, "issuedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "original_name", type: "varchar", length: 255 }),
    __metadata("design:type", String)
], Certificate.prototype, "originalName", void 0);
exports.Certificate = Certificate = __decorate([
    (0, typeorm_1.Entity)("certificates"),
    (0, typeorm_1.Unique)(["userId", "subCategoryId"])
], Certificate);
//# sourceMappingURL=certificate.entity.js.map