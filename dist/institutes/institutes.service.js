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
exports.InstitutesService = void 0;
const common_1 = require("@nestjs/common");
const institute_entity_1 = require("./entities/institute.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let InstitutesService = class InstitutesService {
    constructor(instituteRepository) {
        this.instituteRepository = instituteRepository;
    }
    async create(createInstituteDto) {
        const institute = this.instituteRepository.create(createInstituteDto);
        return await this.instituteRepository.save(institute);
    }
    async bulkCreate(list) {
        return this.instituteRepository.save(list);
    }
    async findByCourseName(courseName) {
        return this.instituteRepository
            .createQueryBuilder("institute")
            .where(":courseName = ANY(institute.courses)", { courseName })
            .getMany();
    }
};
exports.InstitutesService = InstitutesService;
exports.InstitutesService = InstitutesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(institute_entity_1.Institute)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], InstitutesService);
//# sourceMappingURL=institutes.service.js.map