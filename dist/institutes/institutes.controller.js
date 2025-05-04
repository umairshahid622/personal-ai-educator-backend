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
exports.InstitutesController = void 0;
const common_1 = require("@nestjs/common");
const institutes_service_1 = require("./institutes.service");
const create_institute_dto_1 = require("./dto/create-institute.dto");
const swagger_1 = require("@nestjs/swagger");
let InstitutesController = class InstitutesController {
    constructor(institutesService) {
        this.institutesService = institutesService;
    }
    async create(createInstituteDto) {
        return this.institutesService.create(createInstituteDto);
    }
    async bulkCreate(list) {
        return this.institutesService.bulkCreate(list);
    }
    async findByCourseName(courseName) {
        return this.institutesService.findByCourseName(courseName);
    }
};
exports.InstitutesController = InstitutesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_institute_dto_1.CreateInstituteDto]),
    __metadata("design:returntype", Promise)
], InstitutesController.prototype, "create", null);
__decorate([
    (0, common_1.Post)("bulk"),
    (0, swagger_1.ApiBody)({ type: [create_institute_dto_1.CreateInstituteDto] }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], InstitutesController.prototype, "bulkCreate", null);
__decorate([
    (0, common_1.Get)("search"),
    __param(0, (0, common_1.Query)("courseName")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InstitutesController.prototype, "findByCourseName", null);
exports.InstitutesController = InstitutesController = __decorate([
    (0, swagger_1.ApiTags)("institutes"),
    (0, common_1.Controller)("institutes"),
    __metadata("design:paramtypes", [institutes_service_1.InstitutesService])
], InstitutesController);
//# sourceMappingURL=institutes.controller.js.map