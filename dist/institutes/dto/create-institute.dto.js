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
exports.CreateInstituteDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CreateInstituteDto {
}
exports.CreateInstituteDto = CreateInstituteDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Bahria University Islamabad" }),
    __metadata("design:type", String)
], CreateInstituteDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 33.7179 }),
    __metadata("design:type", Number)
], CreateInstituteDto.prototype, "lat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 73.0589 }),
    __metadata("design:type", Number)
], CreateInstituteDto.prototype, "lng", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ["Computer Science", "BBA", "Software Engineering"] }),
    __metadata("design:type", Array)
], CreateInstituteDto.prototype, "courses", void 0);
//# sourceMappingURL=create-institute.dto.js.map