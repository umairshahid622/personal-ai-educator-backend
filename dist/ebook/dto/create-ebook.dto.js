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
exports.CreateEbookDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateEbookDto {
}
exports.CreateEbookDto = CreateEbookDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Agile Methodologies Author Nicolas Viera" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEbookDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "http://localhost:3001/assets/ebook/images/Agile Methodologies Author Nicolas Viera.png",
        format: "url",
    }),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateEbookDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "http://localhost:3001/assets/ebook/pdf/Agile Methodologies Author Nicolas Viera.pdf",
        format: "url",
    }),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateEbookDto.prototype, "pdfUrl", void 0);
//# sourceMappingURL=create-ebook.dto.js.map