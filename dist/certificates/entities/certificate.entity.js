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
exports.Certificates = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let Certificates = class Certificates {
};
exports.Certificates = Certificates;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Certificates.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("uuid"),
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", String)
], Certificates.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)({ example: "Computer Science" }),
    __metadata("design:type", String)
], Certificates.prototype, "courseName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)({ example: "category-uuid" }),
    __metadata("design:type", String)
], Certificates.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, swagger_1.ApiProperty)({ example: "http://localhost:3001/assets/certificates/1.pdf" }),
    __metadata("design:type", String)
], Certificates.prototype, "certificateUrl", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], Certificates.prototype, "issuedAt", void 0);
exports.Certificates = Certificates = __decorate([
    (0, typeorm_1.Entity)()
], Certificates);
//# sourceMappingURL=certificate.entity.js.map