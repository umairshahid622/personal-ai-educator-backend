declare class QuizItemDto {
    title: string;
    status: "locked" | "unlocked" | "passed" | "failed";
}
export declare class CreateQuizDto {
    subcategoryId: string;
    items: QuizItemDto[];
}
export {};
