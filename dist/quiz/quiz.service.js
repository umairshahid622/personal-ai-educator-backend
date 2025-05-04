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
exports.QuizService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const quiz_entity_1 = require("./entities/quiz.entity");
const openrouter_client_1 = require("../common/openrouter.client");
const subcategory_entity_1 = require("../subcategory/entities/subcategory.entity");
let QuizService = class QuizService {
    constructor(quizRepo, subCatRepo) {
        this.quizRepo = quizRepo;
        this.subCatRepo = subCatRepo;
        this.ai = new openrouter_client_1.OpenRouterClient();
    }
    async getOrCreateForUser(userId, subCategoryId) {
        let quiz = await this.quizRepo.findOne({
            where: { userId, subCategoryId },
        });
        if (quiz)
            return quiz;
        const subCat = await this.subCatRepo.findOne({
            where: { id: subCategoryId },
        });
        if (!subCat) {
            throw new common_1.NotFoundException(`SubCategory ${subCategoryId} not found.`);
        }
        const prompt = `Generate exactly 7 quiz titles for the course ${subCat.name} in pure JSON format. 
Only the first quiz should have status "unlocked", the rest "locked".
Return a JSON array like:
[
  {"title":"Quiz 1: …","status":"unlocked"},
  …,
  {"title":"Quiz 7: …","status":"locked"}
]
No explanation—just JSON.`;
        const aiResp = await this.ai.getCompletion(prompt);
        const raw = aiResp.choices?.[0]?.message?.content ?? "";
        const items = this.parseJsonArray(raw);
        quiz = this.quizRepo.create({ userId, subCategoryId, items });
        return this.quizRepo.save(quiz);
    }
    parseJsonArray(raw) {
        const fence = /```(?:json)?\s*([\s\S]*?)\s*```/i.exec(raw);
        const jsonText = fence ? fence[1] : raw;
        return JSON.parse(jsonText.trim());
    }
    create(createQuizDto) {
        return "This action adds a new quiz";
    }
    findAll() {
        return `This action returns all quiz`;
    }
    findOne(id) {
        return `This action returns a #${id} quiz`;
    }
    update(id, updateQuizDto) {
        return `This action updates a #${id} quiz`;
    }
    remove(id) {
        return `This action removes a #${id} quiz`;
    }
};
exports.QuizService = QuizService;
exports.QuizService = QuizService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(quiz_entity_1.Quiz)),
    __param(1, (0, typeorm_1.InjectRepository)(subcategory_entity_1.SubCategory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], QuizService);
//# sourceMappingURL=quiz.service.js.map