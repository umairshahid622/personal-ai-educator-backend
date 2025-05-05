import { Certificate } from "./entities/certificate.entity";
import { Repository } from "typeorm";
export declare class CertificatesService {
    private readonly certRepo;
    constructor(certRepo: Repository<Certificate>);
    findForUser(userId: string): Promise<Certificate[]>;
}
