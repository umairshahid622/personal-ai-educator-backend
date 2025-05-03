import { CreateCertificateDto } from "./dto/create-certificate.dto";
import { Certificates } from "./entities/certificate.entity";
import { Repository } from "typeorm";
import { User } from "src/users/entities/users.entity";
export declare class CertificatesService {
    private readonly certificateRepo;
    private readonly usersRepo;
    constructor(certificateRepo: Repository<Certificates>, usersRepo: Repository<User>);
    generateCertificate(userId: string, dto: CreateCertificateDto): Promise<string>;
    private generateCertificatePdf;
    getUserCertificates(userId: string): Promise<Certificates[]>;
    userHasCertificateForThisCourse(userId: string, categoryId: string): Promise<{
        hasCertificate: boolean;
    }>;
}
