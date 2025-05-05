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
const certificate_entity_1 = require("../certificates/entities/certificate.entity");
const degree_entity_1 = require("../degree/entities/degree.entity");
const fs_1 = require("fs");
const path_1 = require("path");
const PDFKit = require("pdfkit");
const users_entity_1 = require("../users/entities/users.entity");
const category_entity_1 = require("../categories/entities/category.entity");
let QuizService = class QuizService {
    constructor(quizRepo, subCatRepo, certRepo, degreeRepo, userRepo, catRepo) {
        this.quizRepo = quizRepo;
        this.subCatRepo = subCatRepo;
        this.certRepo = certRepo;
        this.degreeRepo = degreeRepo;
        this.userRepo = userRepo;
        this.catRepo = catRepo;
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
  {"title":"…","status":"unlocked"},
  …,
  {"title":"…","status":"locked"}
]
No explanation—just JSON.`;
        const aiResp = await this.ai.getCompletion(prompt);
        const raw = aiResp.choices?.[0]?.message?.content ?? "";
        const items = this.parseJsonArray(raw);
        quiz = this.quizRepo.create({
            userId,
            subCategoryId,
            items,
            isPassed: false,
        });
        return this.quizRepo.save(quiz);
    }
    async generateExamByTitle(userId, subCategoryId, title) {
        const prompt = `
    You are an expert question-writer.  
    Based on the topic: "${title}", generate exactly 10 multiple-choice questions.  
    
    ❶ Each question must be numbered Q1 through Q10.       
    ❷ Immediately after each question’s four options, add a line that begins with “Correct Answer:”
    ❸ Do NOT include any other text, explanation, or analysis—only the questions, options, and correct answers, in this exact format:
    
    Q1: [Your question here]  
    option a  
    option b  
    option c  
    option d  
    
    Correct Answer: [a|b|c|d]
    
    Q2: …  
    …  
    Q10: …  
    
    Make sure every “Correct Answer:” line matches the actual correct option above it.
    `;
        const aiResp = await this.ai.getCompletion(prompt);
        const raw = aiResp.choices?.[0]?.message?.content ?? "";
        return this.parseMcq(raw);
    }
    parseMcq(raw) {
        const lines = raw
            .split(/\r?\n/)
            .map((l) => l.trim())
            .filter(Boolean);
        const questions = [];
        let current = {};
        for (const line of lines) {
            if (/^Q\d+:/.test(line)) {
                if (current.question)
                    questions.push(current);
                current = { question: line.replace(/^Q\d+:\s*/, ""), options: [] };
            }
            else if (/^[abcd]\)/.test(line)) {
                current.options.push(line);
            }
            else if (/^Correct Answer:/i.test(line)) {
                current.answer = line.replace(/^Correct Answer:\s*/i, "");
            }
        }
        if (current.question)
            questions.push(current);
        console.log(questions);
        return questions;
    }
    async updateStatusByTitle(userId, dto) {
        const { subCategoryId, title, marks } = dto;
        const quiz = await this.quizRepo.findOne({
            where: { userId, subCategoryId },
        });
        if (!quiz)
            throw new common_1.NotFoundException();
        const idx = quiz.items.findIndex((i) => i.title === title);
        if (idx < 0)
            throw new common_1.NotFoundException();
        const passed = marks >= 7;
        quiz.items[idx].status = passed ? "passed" : "fail";
        if (passed &&
            idx + 1 < quiz.items.length &&
            quiz.items[idx + 1].status === "locked") {
            quiz.items[idx + 1].status = "unlocked";
        }
        quiz.isPassed = quiz.items.every((it) => it.status === "passed");
        await this.quizRepo.save(quiz);
        if (passed && quiz.isPassed) {
            const exists = await this.certRepo.findOne({
                where: { userId, subCategoryId },
            });
            if (!exists) {
                const pdfPath = await this.buildSubCategoryPdf(userId, subCategoryId);
                await this.certRepo.save({ userId, subCategoryId, pdfPath });
            }
            const subCat = await this.subCatRepo.findOne({
                where: { id: subCategoryId },
                relations: ["category", "category.subCategories"],
            });
            const allPassed = await Promise.all(subCat.category.subCategories.map(async (sc) => {
                const qb = await this.quizRepo.findOne({
                    where: { userId, subCategoryId: sc.id },
                });
                return qb?.isPassed === true;
            })).then((arr) => arr.every((x) => x));
            if (allPassed) {
                const categoryId = subCat.category.uuid;
                const existsDeg = await this.degreeRepo.findOne({
                    where: { userId, categoryId },
                });
                if (!existsDeg) {
                    const pdfPath = await this.buildDegreePdf(userId, categoryId);
                    await this.degreeRepo.save({ userId, categoryId, pdfPath });
                }
            }
        }
        return {
            message: passed ? "Quiz has been passed." : "Quiz has been failed.",
            status: passed ? "passed" : "fail",
            title,
        };
    }
    async getUserBundles(userId) {
        const bundles = await this.quizRepo.find({
            where: { userId },
            order: { createdAt: "DESC" },
        });
        return bundles;
    }
    parseJsonArray(raw) {
        const fence = /```(?:json)?\s*([\s\S]*?)\s*```/i.exec(raw);
        const jsonText = fence ? fence[1] : raw;
        return JSON.parse(jsonText.trim());
    }
    async buildSubCategoryPdf(userId, subCategoryId) {
        const user = await this.userRepo.findOne({ where: { uuid: userId } });
        if (!user)
            throw new common_1.NotFoundException("User not found");
        const subCat = await this.subCatRepo.findOne({
            where: { id: subCategoryId },
        });
        if (!subCat)
            throw new common_1.NotFoundException("SubCategory not found");
        const dir = (0, path_1.join)(process.cwd(), "assets", "certs");
        if (!(0, fs_1.existsSync)(dir))
            (0, fs_1.mkdirSync)(dir, { recursive: true });
        const timestamp = Date.now();
        const filename = `${timestamp}.pdf`;
        const outPath = (0, path_1.join)(dir, filename);
        const doc = new PDFKit({ size: "A4", margin: 50 });
        const writeStream = (0, fs_1.createWriteStream)(outPath);
        doc.pipe(writeStream);
        doc
            .fontSize(24)
            .text("Certificate of Completion", { align: "center" })
            .moveDown(2)
            .fontSize(16)
            .text(`This certifies that user ${user.displayName}`, { align: "center" })
            .moveDown()
            .text(`has successfully completed all quizzes in sub‐category:`, {
            align: "center",
        })
            .moveDown()
            .fontSize(18)
            .text(`${subCat.name}`, { align: "center", underline: true })
            .moveDown(3)
            .fontSize(12)
            .text(`Issued on ${new Date().toLocaleDateString()}`, {
            align: "center",
        });
        doc.end();
        await new Promise((res, rej) => {
            writeStream.on("finish", () => res());
            writeStream.on("error", (err) => rej(err));
        });
        return `/assets/certs/${filename}`;
    }
    async buildDegreePdf(userId, categoryId) {
        const user = await this.userRepo.findOne({ where: { uuid: userId } });
        if (!user)
            throw new common_1.NotFoundException("User not found");
        const category = await this.catRepo.findOne({
            where: { uuid: categoryId },
        });
        if (!category)
            throw new common_1.NotFoundException("Category not found");
        const dir = (0, path_1.join)(process.cwd(), "assets", "degrees");
        if (!(0, fs_1.existsSync)(dir))
            (0, fs_1.mkdirSync)(dir, { recursive: true });
        const timestamp = Date.now();
        const filename = `${timestamp}.pdf`;
        const outPath = (0, path_1.join)(dir, filename);
        const doc = new PDFKit({ size: "A4", margin: 50 });
        const writeStream = (0, fs_1.createWriteStream)(outPath);
        doc.pipe(writeStream);
        doc
            .fontSize(24)
            .text("Degree Completion Certificate", { align: "center" })
            .moveDown(2)
            .fontSize(16)
            .text(`This certifies that user ${user.displayName}`, { align: "center" })
            .moveDown()
            .text(`has successfully passed ALL sub‐categories in:`, {
            align: "center",
        })
            .moveDown()
            .fontSize(18)
            .text(`${category.name}`, { align: "center", underline: true })
            .moveDown(3)
            .fontSize(12)
            .text(`Issued on ${new Date().toLocaleDateString()}`, {
            align: "center",
        });
        doc.end();
        await new Promise((res, rej) => {
            writeStream.on("finish", () => res());
            writeStream.on("error", (err) => rej(err));
        });
        return `/assets/degrees/${filename}`;
    }
};
exports.QuizService = QuizService;
exports.QuizService = QuizService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(quiz_entity_1.Quiz)),
    __param(1, (0, typeorm_1.InjectRepository)(subcategory_entity_1.SubCategory)),
    __param(2, (0, typeorm_1.InjectRepository)(certificate_entity_1.Certificate)),
    __param(3, (0, typeorm_1.InjectRepository)(degree_entity_1.Degree)),
    __param(4, (0, typeorm_1.InjectRepository)(users_entity_1.User)),
    __param(5, (0, typeorm_1.InjectRepository)(category_entity_1.Categories)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], QuizService);
//# sourceMappingURL=quiz.service.js.map