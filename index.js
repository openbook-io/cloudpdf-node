"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudPDF = void 0;
const ed = require("./utils/noble-ed25519");
const base64_1 = require("./utils/base64");
const fs_1 = require("fs");
const graphql_request_1 = require("graphql-request");
const UploadDocument = `
  mutation UPLOAD_DOCUMENT_MUTATION($file: Upload!) {
    uploadDocumentApi(file: $file) {
      id
      name
    }
  }
`;
class CloudPDF {
    constructor(options) {
        const url = options.url || 'https://api.cloudpdf.io';
        this.accessSecret = options.accessSecret;
        this.accessKey = options.accessKey;
        this.cloudName = options.cloudName;
        this.url = url;
        this.graphqlClient = new graphql_request_1.GraphQLClient(url + '/graphql');
    }
    jwtHeader() {
        const jwtHeader = {
            kid: this.cloudName,
            alg: "EdDSA"
        };
        return base64_1.objectToSafeBase64(jwtHeader);
    }
    getPrivateKey() {
        return Buffer.from(base64_1.base64DecodeUrl(this.accessSecret), 'base64');
    }
    signPayload(payload) {
        const privateKey = this.getPrivateKey();
        const headerBase64 = this.jwtHeader();
        const payloadBase64 = base64_1.objectToSafeBase64(payload);
        const jwtBody = headerBase64 + '.' + payloadBase64;
        const signature = ed.sign(Buffer.from(jwtBody), privateKey);
        const safeSignature = base64_1.base64EncodeUrl(Buffer.from(signature).toString('base64'));
        const signedJwt = jwtBody + '.' + safeSignature;
        return signedJwt;
    }
    uploadFile(stream, token) {
        return this.graphqlClient.request(UploadDocument, {
            file: stream,
        }, {
            'v-authorization': token
        });
    }
    signDocument(payload) {
        return this.signPayload(payload);
    }
    uploadDocumentFromStream(stream, payload) {
        const token = this.signPayload(payload);
        return this.uploadFile(stream, token);
    }
    uploadDocumentFromFilePath(path, payload) {
        const readable = fs_1.createReadStream(path);
        const token = this.signPayload(payload);
        return this.uploadFile(readable, token);
    }
}
exports.CloudPDF = CloudPDF;
