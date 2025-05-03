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
exports.Skills = void 0;
const course_entity_1 = require("../course/entities/course.entity");
const typeorm_1 = require("typeorm");
let Skills = class Skills {
};
exports.Skills = Skills;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Skills.prototype, "uuid", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Skills.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => course_entity_1.Courses, (course) => course.skills),
    __metadata("design:type", Array)
], Skills.prototype, "courses", void 0);
exports.Skills = Skills = __decorate([
    (0, typeorm_1.Entity)({ name: "skills" })
], Skills);
//# sourceMappingURL=skills.entity.js.map