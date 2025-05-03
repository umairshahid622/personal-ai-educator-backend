interface QuizTitle {
    title: string;
    status: string;
}
export declare class CreateQuizeDto {
    categoryId: string;
    titles: QuizTitle[];
}
export declare class UpdateQuizStatusDto {
    categoryId: string;
    quizTitle: string;
    previousTitle: string;
    previousTitleStatus: string;
    status: string;
}
export {};
