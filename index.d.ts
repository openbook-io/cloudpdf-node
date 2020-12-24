/// <reference types="node" />
import { ReadStream } from 'fs';
import { GraphQLClient } from 'graphql-request';
interface options {
    accessSecret: string;
    accessKey: string;
    cloudName: string;
    url?: string;
}
interface getDocumentPayload {
    documentId: string;
    download?: boolean;
    search?: boolean;
    exp?: number;
    type: string;
}
interface uploadPayload {
    public?: boolean;
    exp?: number;
    type: string;
}
export declare class CloudPDF {
    accessSecret: string;
    accessKey: string;
    cloudName: string;
    url: string;
    graphqlClient: GraphQLClient;
    constructor(options: options);
    private jwtHeader;
    private getPrivateKey;
    private signPayload;
    private uploadFile;
    signDocument(payload: getDocumentPayload): string;
    uploadDocumentFromStream(stream: ReadStream, payload: uploadPayload): Promise<any>;
    uploadDocumentFromFilePath(path: string, payload: uploadPayload): Promise<any>;
}
export {};
