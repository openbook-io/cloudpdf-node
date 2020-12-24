interface options {
    accessSecret: string;
    accessKey: string;
    cloudName: string;
}
interface payload {
    documentId: string;
    download?: boolean;
    search?: boolean;
    exp?: number;
}
export declare class CloudPDF {
    accessSecret: string;
    accessKey: string;
    cloudName: string;
    constructor(options: options);
    private jwtHeader;
    private getPrivateKey;
    private signPayload;
    signDocument(payload: payload): string;
}
export {};
