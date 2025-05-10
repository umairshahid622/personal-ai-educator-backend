import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateQuizDto } from "./dto/create-quiz.dto";
import {
  UpdateQuizDto,
  UpdateQuizItemDto,
  UpdateQuizItemResponse,
} from "./dto/update-quiz.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Quiz } from "./entities/quiz.entity";
import { OpenRouterClient } from "src/common/openrouter.client";
import { SubCategory } from "src/subcategory/entities/subcategory.entity";
import { Certificate } from "src/certificates/entities/certificate.entity";
import { Degree } from "src/degree/entities/degree.entity";
import { createWriteStream, existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import * as path from "path";
import * as PDFKit from "pdfkit";
import { User } from "src/users/entities/users.entity";
import { Categories } from "src/categories/entities/category.entity";

const assetsRoot = path.resolve(__dirname, "../utilities");

const uniLogoPath = path.join(
  assetsRoot,
  "images",
  "bahria-university-logo.png"
);
const accentLogoPath = path.join(assetsRoot, "images", "blackLogo.png");
const signaturePath = path.join(assetsRoot, "images", "signature.png");

const fontRegular = path.join(assetsRoot, "fonts", "Poppins-Regular.ttf");
const fontSemiBold = path.join(assetsRoot, "fonts", "Poppins-SemiBold.ttf");
const fontBold = path.join(assetsRoot, "fonts", "Poppins-Bold.ttf");

export interface Mcq {
  question: string;
  options: string[];
  answer: string;
}

@Injectable()
export class QuizService {
  private ai = new OpenRouterClient();
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepo: Repository<Quiz>,

    @InjectRepository(SubCategory)
    private readonly subCatRepo: Repository<SubCategory>,

    @InjectRepository(Certificate)
    private readonly certRepo: Repository<Certificate>,

    @InjectRepository(Degree) private readonly degreeRepo: Repository<Degree>,

    @InjectRepository(User) private readonly userRepo: Repository<User>,

    @InjectRepository(Categories)
    private readonly catRepo: Repository<Categories>
  ) {}

  async getUserBundles(userId: string): Promise<Quiz[]> {
    return this.quizRepo.find({
      where: { userId },
      order: { createdAt: "DESC" },
    });
  }

  async getOrCreateForUser(
    userId: string,
    subCategoryId: string
  ): Promise<Quiz> {
    const quiz = await this.findOrCreateQuiz(userId, subCategoryId);
    await this.syncPassAndCertificates(quiz, userId, subCategoryId);
    return quiz;
  }

  async generateExamByTitle(
    userId: string,
    subCategoryId: string,
    title: string
  ): Promise<Mcq[]> {
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

  async updateStatusByTitle(
    userId: string,
    dto: UpdateQuizItemDto
  ): Promise<UpdateQuizItemResponse> {
    const { subCategoryId, title, marks } = dto;
    const quiz = await this.quizRepo.findOneOrFail({
      where: { userId, subCategoryId },
    });

    const idx = quiz.items.findIndex((i) => i.title === title);
    if (idx < 0) throw new NotFoundException("Quiz title not found");

    const totalQuestions = 10;
    const passingMarks = Math.ceil(totalQuestions * 0.7);
    const passed = marks >= passingMarks;

    quiz.items[idx].status = passed ? "passed" : "failed";

    let unlockMessage: string | undefined;
    if (passed && quiz.items[idx + 1]?.status === "locked") {
      quiz.items[idx + 1].status = "unlocked";
      unlockMessage = `Quiz "${quiz.items[idx + 1].title}" has been unlocked.`;
    }

    // persist status
    quiz.isPassed = quiz.items.every((i) => i.status === "passed");
    await this.quizRepo.save(quiz);

    // issue certificates if fully passed
    let certificateMessage: string | undefined;
    let degreeMessage: string | undefined;
    if (quiz.isPassed) {
      certificateMessage = await this.issueSubCategoryCert(
        userId,
        subCategoryId
      );
      degreeMessage = await this.issueDegreeCert(userId, subCategoryId);
    }

    return {
      message: passed
        ? `Quiz passed (${marks}/${totalQuestions}).`
        : `Quiz failed (${marks}/${totalQuestions}), need ${passingMarks} marks to pass.`,
      status: passed ? "passed" : "failed",
      title,
      totalQuestions,
      passingMarks,
      obtainedMarks: marks,
      ...(unlockMessage && { unlockMessage }),
      ...(certificateMessage && { certificateMessage }),
      ...(degreeMessage && { degreeMessage }),
    };
  }

  private async findOrCreateQuiz(
    userId: string,
    subCategoryId: string
  ): Promise<Quiz> {
    const existing = await this.quizRepo.findOne({
      where: { userId, subCategoryId },
    });
    if (existing) return existing;

    const subCat = await this.subCatRepo.findOneOrFail({
      where: { id: subCategoryId },
    });
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
    const items = this.parseJsonArray(
      aiResp.choices?.[0]?.message?.content || "[]"
    );

    const quiz = this.quizRepo.create({
      userId,
      subCategoryId,
      items,
      isPassed: false,
    });
    return this.quizRepo.save(quiz);
  }

  private async syncPassAndCertificates(
    quiz: Quiz,
    userId: string,
    subCategoryId: string
  ) {
    const allPassed = quiz.items.every((i) => i.status === "passed");
    if (quiz.isPassed !== allPassed) {
      quiz.isPassed = allPassed;
      await this.quizRepo.save(quiz);
    }
    if (allPassed) {
      await this.issueSubCategoryCert(userId, subCategoryId);
      await this.issueDegreeCert(userId, subCategoryId);
    }
  }

  private async issueSubCategoryCert(
    userId: string,
    subCategoryId: string
  ): Promise<string | undefined> {
    const exists = await this.certRepo.findOne({
      where: { userId, subCategoryId },
    });
    if (exists) return;

    const subCat = await this.subCatRepo.findOneOrFail({
      where: { id: subCategoryId },
    });
    const pdfPath = await this.buildSubCategoryPdf(userId, subCategoryId);
    await this.certRepo.save({
      userId,
      subCategoryId,
      pdfPath,
      originalName: subCat.name,
    });
    return `Certificate issued for sub-category "${subCat.name}".`;
  }

  private async issueDegreeCert(
    userId: string,
    subCategoryId: string
  ): Promise<string | undefined> {
    const subCat = await this.subCatRepo.findOneOrFail({
      where: { id: subCategoryId },
      relations: ["category", "category.subCategories"],
    });

    const allPassed = (
      await Promise.all(
        subCat.category.subCategories.map(async (sc) => {
          const q = await this.quizRepo.findOne({
            where: { userId, subCategoryId: sc.id },
          });
          return q?.isPassed;
        })
      )
    ).every((v) => v === true);
    if (!allPassed) return;

    const categoryId = subCat.category.uuid;
    const exists = await this.degreeRepo.findOne({
      where: { userId, categoryId },
    });
    if (exists) return;

    const pdfPath = await this.buildDegreePdf(userId, categoryId);
    await this.degreeRepo.save({
      userId,
      categoryId,
      pdfPath,
      originalName: subCat.category.name,
    });
    return `Degree certificate issued for "${subCat.category.name}".`;
  }

  //================================================================================

  private async buildSubCategoryPdf(
    userId: string,
    subCategoryId: string
  ): Promise<string> {
    const user = await this.userRepo.findOne({ where: { uuid: userId } });
    if (!user) throw new NotFoundException("User not found");
    const subCat = await this.subCatRepo.findOne({
      where: { id: subCategoryId },
    });
    if (!subCat) throw new NotFoundException("SubCategory not found");

    const dir = join(process.cwd(), "assets", "certs");
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    const timestamp = Date.now();
    const filename = `${timestamp}.pdf`;

    const outPath = join(dir, filename);

    const doc = new PDFKit({
      size: "A4",
      layout: "landscape",
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
    });
    const writeStream = createWriteStream(outPath);
    doc.pipe(writeStream);

    const { width: W, height: H, margins } = doc.page;
    const contentWidth = W - margins.left - margins.right;
    const contentHeight = H - margins.top - margins.bottom;
    const primaryColor = "#352626";

    doc
      .lineWidth(3)
      .strokeColor(primaryColor)
      .rect(
        margins.left - 10,
        margins.top - 10,
        W - 2 * (margins.left - 10),
        H - 2 * (margins.top - 10)
      )
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
      if (i < lines.length - 1) totalHeight += size * 0.5;
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
      .text(
        `Issued on: ${new Date().toLocaleDateString()}`,
        margins.left,
        footerY + 25,
        {
          width: contentWidth,
          align: "right",
        }
      );

    doc.end();

    await new Promise<void>((res, rej) => {
      writeStream.on("finish", () => res());
      writeStream.on("error", (err) => rej(err));
    });

    return `/assets/certs/${filename}`;
  }
  //==========================================================================================
  private async buildDegreePdf(
    userId: string,
    categoryId: string
  ): Promise<string> {
    const user = await this.userRepo.findOne({ where: { uuid: userId } });
    if (!user) throw new NotFoundException("User not found");
    const category = await this.catRepo.findOne({
      where: { uuid: categoryId },
    });
    if (!category) throw new NotFoundException("Category not found");

    const subCategories = await this.subCatRepo.find({
      where: { category: { uuid: categoryId } },
      relations: ["category"],
      order: { name: "ASC" },
    });

    if (!subCategories) throw new NotFoundException("Sub Category not found");

    const dir = join(process.cwd(), "assets", "degrees");
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    const timestamp = Date.now();
    const filename = `${timestamp}.pdf`;

    const outPath = join(dir, filename);

    const doc = new PDFKit({
      size: "A4",
      layout: "landscape",
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
    });
    const writeStream = createWriteStream(outPath);
    doc.pipe(writeStream);

    const primary = "#352626";
    const { width: W, height: H, margins } = doc.page;
    const CW = W - margins.left - margins.right;

    doc
      .lineWidth(3)
      .strokeColor(primary)
      .rect(
        margins.left - 10,
        margins.top - 10,
        W - 2 * (margins.left - 10),
        H - 2 * (margins.top - 10)
      )
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
      const line = subCategories.map((item) => item.name).join("  |  ");
      doc.text(line, margins.left + 20, listTop, {
        width: CW - 40,
        align: "center",
      });
    } else {
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

    await new Promise<void>((res, rej) => {
      writeStream.on("finish", () => res());
      writeStream.on("error", (err) => rej(err));
    });

    return `/assets/degrees/${filename}`;
  }

  private parseJsonArray(raw: string) {
    const fence = /```(?:json)?\s*([\s\S]*?)\s*```/i.exec(raw);
    const jsonText = fence ? fence[1] : raw;
    return JSON.parse(jsonText.trim());
  }

  private parseMcq(raw: string): Mcq[] {
    const lines = raw
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    const questions: Mcq[] = [];
    let current: Partial<Mcq> = {};
    for (const line of lines) {
      if (/^Q\d+:/.test(line)) {
        if (current.question) questions.push(current as Mcq);
        current = { question: line.replace(/^Q\d+:\s*/, ""), options: [] };
      } else if (/^[abcd]\)/.test(line)) {
        current.options!.push(line);
      } else if (/^Correct Answer:/i.test(line)) {
        current.answer = line.replace(/^Correct Answer:\s*/i, "");
      }
    }
    if (current.question) questions.push(current as Mcq);

    return questions;
  }
}
