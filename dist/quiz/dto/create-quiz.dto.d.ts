declare class QuizItemDto {
    title: string;
    status: "locked" | "unlocked";
}
export declare class CreateQuizDto {
    subcategoryId: string;
    items: QuizItemDto[];
}
export {};
