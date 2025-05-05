declare class QuizItemDto {
    title: string;
    status: "locked" | "unlocked" | "passed" | "fail";
}
export declare class CreateQuizDto {
    subcategoryId: string;
    items: QuizItemDto[];
}
export {};
