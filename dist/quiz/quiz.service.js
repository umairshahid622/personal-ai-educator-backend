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
const path = require("path");
const PDFKit = require("pdfkit");
const users_entity_1 = require("../users/entities/users.entity");
const category_entity_1 = require("../categories/entities/category.entity");
const assetsRoot = path.resolve(__dirname, "../utilities");
const uniLogoPath = path.join(assetsRoot, "images", "bahria-university-logo.png");
const accentLogoPath = path.join(assetsRoot, "images", "blackLogo.png");
const signaturePath = path.join(assetsRoot, "images", "signature.png");
const fontRegular = path.join(assetsRoot, "fonts", "Poppins-Regular.ttf");
const fontSemiBold = path.join(assetsRoot, "fonts", "Poppins-SemiBold.ttf");
const fontBold = path.join(assetsRoot, "fonts", "Poppins-Bold.ttf");
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
    async getUserBundles(userId) {
        const bundles = await this.quizRepo.find({
            where: { userId },
            order: { createdAt: "DESC" },
        });
        return bundles;
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
        return questions;
    }
    async updateStatusByTitle(userId, dto) {
        const { subCategoryId, title, marks } = dto;
        const quiz = await this.quizRepo.findOne({
            where: { userId, subCategoryId },
        });
        if (!quiz)
            throw new common_1.NotFoundException("Quiz bundle not found");
        const idx = quiz.items.findIndex((i) => i.title === title);
        if (idx < 0)
            throw new common_1.NotFoundException("Quiz title not found");
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
            const subCat = await this.subCatRepo.findOne({
                where: { id: subCategoryId },
                relations: ["category", "category.subCategories"],
            });
            if (!subCat)
                throw new common_1.NotFoundException("SubCategory not found");
            const certExists = await this.certRepo.findOne({
                where: { userId, subCategoryId },
            });
            if (!certExists) {
                const pdfPath = await this.buildSubCategoryPdf(userId, subCategoryId);
                await this.certRepo.save({
                    userId,
                    subCategoryId,
                    pdfPath,
                    originalName: subCat.name,
                });
            }
            const allPassed = await Promise.all(subCat.category.subCategories.map(async (sc) => {
                const b = await this.quizRepo.findOne({
                    where: { userId, subCategoryId: sc.id },
                });
                return b?.isPassed === true;
            })).then((arr) => arr.every((x) => x));
            if (allPassed) {
                const categoryId = subCat.category.uuid;
                const degExists = await this.degreeRepo.findOne({
                    where: { userId, categoryId },
                });
                if (!degExists) {
                    const pdfPath = await this.buildDegreePdf(userId, categoryId);
                    await this.degreeRepo.save({
                        userId,
                        categoryId,
                        pdfPath,
                        originalName: subCat.category.name,
                    });
                }
            }
        }
        return {
            message: passed ? "Quiz has been passed." : "Quiz has been failed.",
            status: passed ? "passed" : "fail",
            title,
        };
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
        const doc = new PDFKit({
            size: "A4",
            layout: "landscape",
            margins: { top: 50, bottom: 50, left: 50, right: 50 },
        });
        const writeStream = (0, fs_1.createWriteStream)(outPath);
        doc.pipe(writeStream);
        const { width: W, height: H, margins } = doc.page;
        const contentWidth = W - margins.left - margins.right;
        const contentHeight = H - margins.top - margins.bottom;
        const primaryColor = "#352626";
        doc
            .lineWidth(3)
            .strokeColor(primaryColor)
            .rect(margins.left - 10, margins.top - 10, W - 2 * (margins.left - 10), H - 2 * (margins.top - 10))
            .stroke();
        doc.image(uniLogoPath, margins.left, margins.top, { width: 70 });
        doc.image(accentLogoPath, W - margins.right - 220, margins.top, {
            width: 220,
        });
        const lines = [
            {
                text: "COURSE CERTIFICATE",
                font: fontBold,
                size: 52,
                color: primaryColor,
            },
            { text: "AWARDED TO", font: fontRegular, size: 18, color: "#555555" },
            {
                text: user.displayName,
                font: fontSemiBold,
                size: 32,
                color: primaryColor,
            },
            {
                text: "For successfully completing a free online course",
                font: fontRegular,
                size: 16,
                color: "#333333",
            },
            { text: subCat.name, font: fontBold, size: 22, color: primaryColor },
        ];
        let totalHeight = 0;
        for (let i = 0; i < lines.length; i++) {
            const { text, font, size } = lines[i];
            doc.font(font).fontSize(size);
            const h = doc.heightOfString(text, {
                width: contentWidth,
                align: "center",
            });
            totalHeight += h;
            if (i < lines.length - 1)
                totalHeight += size * 0.5;
        }
        const startY = margins.top + (contentHeight - totalHeight) / 2;
        let cursorY = startY;
        for (let i = 0; i < lines.length; i++) {
            const { text, font, size, color } = lines[i];
            doc
                .font(font)
                .fontSize(size)
                .fillColor(color)
                .text(text, margins.left, cursorY, {
                width: contentWidth,
                align: "center",
            });
            const h = doc.heightOfString(text, {
                width: contentWidth,
                align: "center",
            });
            cursorY += h + (i < lines.length - 1 ? size * 0.5 : 0);
        }
        const footerY = H - margins.bottom - 60;
        doc.image(signaturePath, margins.left + 30, footerY - 40, { width: 180 });
        doc
            .moveTo(margins.left + 30, footerY + 22)
            .lineTo(margins.left + 210, footerY + 22)
            .lineWidth(1)
            .strokeColor(primaryColor)
            .stroke();
        doc
            .font(fontRegular)
            .fontSize(12)
            .fillColor("#555555")
            .text("Head of Personal Ai Educator", margins.left + 30, footerY + 25);
        doc
            .font(fontRegular)
            .fontSize(14)
            .fillColor("#555555")
            .text(`Issued on: ${new Date().toLocaleDateString()}`, margins.left, footerY + 25, {
            width: contentWidth,
            align: "right",
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
        const subCategories = await this.subCatRepo.find({
            where: { category: { uuid: categoryId } },
            relations: ["category"],
            order: { name: "ASC" },
        });
        if (!subCategories)
            throw new common_1.NotFoundException("Sub Category not found");
        const dir = (0, path_1.join)(process.cwd(), "assets", "degrees");
        if (!(0, fs_1.existsSync)(dir))
            (0, fs_1.mkdirSync)(dir, { recursive: true });
        const timestamp = Date.now();
        const filename = `${timestamp}.pdf`;
        const outPath = (0, path_1.join)(dir, filename);
        const doc = new PDFKit({
            size: "A4",
            layout: "landscape",
            margins: { top: 50, bottom: 50, left: 50, right: 50 },
        });
        const writeStream = (0, fs_1.createWriteStream)(outPath);
        doc.pipe(writeStream);
        const primary = "#352626";
        const { width: W, height: H, margins } = doc.page;
        const CW = W - margins.left - margins.right;
        doc
            .lineWidth(3)
            .strokeColor(primary)
            .rect(margins.left - 10, margins.top - 10, W - 2 * (margins.left - 10), H - 2 * (margins.top - 10))
            .stroke();
        doc.image(uniLogoPath, margins.left, margins.top, { width: 70 });
        doc.image(accentLogoPath, W - margins.right - 180, margins.top, {
            width: 180,
        });
        const header = [
            {
                text: "PROFESSIONAL CERTIFICATE",
                font: fontBold,
                size: 42,
                color: primary,
            },
            { text: "AWARDED TO", font: fontRegular, size: 16, color: "#555" },
            { text: user.displayName, font: fontSemiBold, size: 28, color: primary },
            {
                text: "In recognition of successful completion of:",
                font: fontRegular,
                size: 14,
                color: "#333",
            },
            { text: category.name, font: fontBold, size: 20, color: primary },
            {
                text: "Consisting of the following subjects:",
                font: fontRegular,
                size: 14,
                color: "#333",
            },
        ];
        const footerSig = {
            text: "Head of Personal Ai Educator",
            font: fontRegular,
            size: 12,
            color: "#555",
        };
        const footerDate = {
            text: `Issued on: ${new Date().toLocaleDateString()}`,
            font: fontRegular,
            size: 12,
            color: "#555",
        };
        function renderBlock(lines, startY, width) {
            let y = startY;
            for (let line of lines) {
                doc
                    .font(line.font)
                    .fontSize(line.size)
                    .fillColor(line.color)
                    .text(line.text, margins.left, y, { width, align: "center" });
                y +=
                    doc.heightOfString(line.text, { width, align: "center" }) +
                        line.size * 0.3;
            }
            return y;
        }
        let cursorY = renderBlock(header, margins.top + 60, CW) + 10;
        const listTop = cursorY;
        const listBottom = H - margins.bottom - 80;
        const listH = listBottom - listTop;
        doc.font(fontRegular).fontSize(16).fillColor("#333");
        if (subCategories.length >= 5) {
            const line = subCategories.join("  |  ");
            doc.text(line, margins.left + 20, listTop, {
                width: CW - 40,
                align: "center",
            });
        }
        else {
            const lineHeight = doc.heightOfString(subCategories[0].name, {
                width: CW - 40,
                align: "center",
            });
            const spacing = lineHeight * 0.3;
            let y = listTop;
            subCategories.forEach((txt) => {
                doc
                    .font(fontRegular)
                    .fontSize(16)
                    .fillColor("#333")
                    .text(txt.name, margins.left + 20, y, {
                    width: CW - 40,
                    align: "center",
                });
                y += lineHeight + spacing;
            });
        }
        const footerY = H - margins.bottom - 60;
        doc.image(signaturePath, margins.left + 20, footerY - 20, { width: 140 });
        doc
            .moveTo(margins.left + 20, footerY + 35)
            .lineTo(margins.left + 160, footerY + 35)
            .lineWidth(1)
            .strokeColor(primary)
            .stroke();
        doc
            .font(footerSig.font)
            .fontSize(footerSig.size)
            .fillColor(footerSig.color)
            .text(footerSig.text, margins.left + 20, footerY + 40);
        doc
            .font(footerDate.font)
            .fontSize(footerDate.size)
            .fillColor(footerDate.color)
            .text(footerDate.text, margins.left, footerY + 40, {
            width: CW,
            align: "right",
        });
        doc.end();
        await new Promise((res, rej) => {
            writeStream.on("finish", () => res());
            writeStream.on("error", (err) => rej(err));
        });
        return `/assets/degrees/${filename}`;
    }
    parseJsonArray(raw) {
        const fence = /```(?:json)?\s*([\s\S]*?)\s*```/i.exec(raw);
        const jsonText = fence ? fence[1] : raw;
        return JSON.parse(jsonText.trim());
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