import { Quiz } from "src/quiz/entities/quiz.entity";
export declare class User {
    uuid: string;
    email: string;
    displayName: string;
    password: string;
    dateOfBirth: Date;
    quizzes: Quiz[];
    createdAt: Date;
    updatedAt: Date;
    name: string;
}
