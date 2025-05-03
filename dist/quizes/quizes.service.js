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
exports.QuizesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const quize_entity_1 = require("./entities/quize.entity");
let QuizesService = class QuizesService {
    constructor(quizRepository) {
        this.quizRepository = quizRepository;
    }
    async saveQuizTitles(userId, createQuizeDto) {
        const existingQuiz = await this.quizRepository.findOne({
            where: {
                userId,
                categoryId: createQuizeDto.categoryId,
            },
        });
        if (existingQuiz) {
            existingQuiz.titles = createQuizeDto.titles;
            return this.quizRepository.save(existingQuiz);
        }
        const newQuiz = this.quizRepository.create({
            userId,
            categoryId: createQuizeDto.categoryId,
            titles: createQuizeDto.titles,
        });
        return this.quizRepository.save(newQuiz);
    }
    async getUserQuiz(userId, categoryId) {
        const quiz = await this.quizRepository.findOne({
            where: {
                userId,
                categoryId,
            },
        });
        return quiz;
    }
    async updateQuizStatus(userId, updateDto) {
        const quiz = await this.quizRepository.findOne({
            where: {
                userId,
                categoryId: updateDto.categoryId,
            },
        });
        if (!quiz) {
            throw new common_1.NotFoundException("Quiz not found for this user");
        }
        const updatedTitles = quiz.titles.map((item) => {
            if (item.title === updateDto.previousTitle) {
                return { ...item, status: updateDto.previousTitleStatus };
            }
            if (item.title === updateDto.quizTitle) {
                return { ...item, status: updateDto.status };
            }
            return item;
        });
        quiz.titles = updatedTitles;
        return this.quizRepository.save(quiz);
    }
    async findAll() {
        return this.quizRepository.find();
    }
};
exports.QuizesService = QuizesService;
exports.QuizesService = QuizesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(quize_entity_1.Quiz)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], QuizesService);
//# sourceMappingURL=quizes.service.js.map