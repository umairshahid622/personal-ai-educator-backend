import { CreateQuizDto } from "./create-quiz.dto";
declare const UpdateQuizDto_base: import("@nestjs/common").Type<Partial<CreateQuizDto>>;
export declare class UpdateQuizDto extends UpdateQuizDto_base {
}
export declare class UpdateQuizItemDto {
    subCategoryId: string;
    title: string;
    marks: number;
}
export declare class UpdateQuizItemResponse {
    message: string;
    status: "passed" | "failed";
    title: string;
    totalQuestions: number;
    passingMarks: number;
    obtainedMarks: number;
    unlockMessage?: string;
    certificateMessage?: string;
    degreeMessage?: string;
}
export {};
