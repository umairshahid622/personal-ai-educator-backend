import { Certificate } from "src/certificates/entities/certificate.entity";
import { Degree } from "src/degree/entities/degree.entity";
import { Quiz } from "src/quiz/entities/quiz.entity";
export declare class User {
    uuid: string;
    email: string;
    displayName: string;
    password: string;
    dateOfBirth: Date;
    quizzes: Quiz[];
    certificates: Certificate[];
    degrees: Degree[];
    emailVerified: boolean;
    emailVerificationToken: string | null;
    emailTokenExpires: Date | null;
    passwordResetToken: string | null;
    passwordResetExpires: Date | null;
    generateId(): void;
    createdAt: Date;
    updatedAt: Date;
}
