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
exports.CourseService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const course_entity_1 = require("./entities/course.entity");
const typeorm_2 = require("typeorm");
let CourseService = class CourseService {
    constructor(courseRepo) {
        this.courseRepo = courseRepo;
    }
    async paginate({ page = 1, limit = 10, categoryId }) {
        const skip = (page - 1) * limit;
        const query = this.courseRepo
            .createQueryBuilder("course")
            .skip(skip)
            .take(limit);
        if (categoryId) {
            query.where("course.categoryUuid = :categoryId", { categoryId });
        }
        const [data, total] = await query.getManyAndCount();
        return {
            data,
            total,
            page,
            lastPage: Math.ceil(total / limit),
        };
    }
    create(createCourseDto) {
        return "This action adds a new course";
    }
    findAll() {
        return "this action will return All Coureses";
    }
    findOne(id) {
        return `This action returns a #${id} course`;
    }
    update(id, updateCourseDto) {
        return `This action updates a #${id} course`;
    }
    remove(id) {
        return `This action removes a #${id} course`;
    }
};
exports.CourseService = CourseService;
exports.CourseService = CourseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(course_entity_1.Courses)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CourseService);
//# sourceMappingURL=course.service.js.map