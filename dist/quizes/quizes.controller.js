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
exports.QuizesController = void 0;
const common_1 = require("@nestjs/common");
const quizes_service_1 = require("./quizes.service");
const create_quize_dto_1 = require("./dto/create-quize.dto");
const update_quiz_status_dto_1 = require("./dto/update-quiz-status.dto");
const auth_guard_1 = require("../guards/auth/auth.guard");
let QuizesController = class QuizesController {
    constructor(quizesService) {
        this.quizesService = quizesService;
    }
    saveQuizTitles(req, createQuizeDto) {
        const userId = req.user.userId;
        return this.quizesService.saveQuizTitles(userId, createQuizeDto);
    }
    getUserQuiz(req, categoryId) {
        const userId = req.user.userId;
        return this.quizesService.getUserQuiz(userId, categoryId);
    }
    updateStatus(req, updateDto) {
        const userId = req.user.userId;
        return this.quizesService.updateQuizStatus(userId, updateDto);
    }
    findAll() {
        return this.quizesService.findAll();
    }
};
exports.QuizesController = QuizesController;
__decorate([
    (0, common_1.Post)("save"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_quize_dto_1.CreateQuizeDto]),
    __metadata("design:returntype", void 0)
], QuizesController.prototype, "saveQuizTitles", null);
__decorate([
    (0, common_1.Get)("user-quiz/:categoryId"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("categoryId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], QuizesController.prototype, "getUserQuiz", null);
__decorate([
    (0, common_1.Patch)("status"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_quiz_status_dto_1.UpdateQuizStatusDto]),
    __metadata("design:returntype", void 0)
], QuizesController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QuizesController.prototype, "findAll", null);
exports.QuizesController = QuizesController = __decorate([
    (0, common_1.Controller)("quizes"),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [quizes_service_1.QuizesService])
], QuizesController);
//# sourceMappingURL=quizes.controller.js.map