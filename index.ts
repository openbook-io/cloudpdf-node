import * as ed from './utils/noble-ed25519';
import { base64DecodeUrl, base64EncodeUrl, objectToSafeBase64 } from './utils/base64';
import { ReadStream, createReadStream } from 'fs';
import { GraphQLClient } from 'graphql-request'

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

const UploadDocument = `
  mutation UPLOAD_DOCUMENT_MUTATION($file: Upload!) {
    uploadDocumentApi(file: $file) {
      id
      name
    }
  }
`

export class CloudPDF {
  accessSecret: string;
  accessKey: string;
  cloudName: string;
  url: string;
  graphqlClient: GraphQLClient;

  constructor(options: options) {
    const url =  options.url || 'https://api.cloudpdf.io';

    this.accessSecret = options.accessSecret;
    this.accessKey = options.accessKey;
    this.cloudName = options.cloudName;
    this.url = url;
    this.graphqlClient = new GraphQLClient(url + '/graphql')
  }

  private jwtHeader() {
    const jwtHeader = {
      kid: this.cloudName,
      alg: "EdDSA"
    };

    return objectToSafeBase64(jwtHeader)
  }

  private getPrivateKey() {
    return Buffer.from(base64DecodeUrl(this.accessSecret), 'base64');
  }

  private signPayload(payload: getDocumentPayload | uploadPayload) {
    const privateKey = this.getPrivateKey();

    const headerBase64 = this.jwtHeader();
    const payloadBase64 = objectToSafeBase64(payload);
    const jwtBody = headerBase64 + '.' + payloadBase64

    const signature = ed.sign(Buffer.from(jwtBody), privateKey);
    const safeSignature = base64EncodeUrl(Buffer.from(signature).toString('base64'));

    const signedJwt = jwtBody + '.' + safeSignature;

    return signedJwt;
  }

  private uploadFile(stream: ReadStream, token: string) {
    return this.graphqlClient.request(UploadDocument, {
      file: stream,
    }, {
      'v-authorization': token
    })
  }

  signDocument(payload: getDocumentPayload) {
    return this.signPayload(payload);
  }

  uploadDocumentFromStream(stream: ReadStream, payload: uploadPayload) {
    const token = this.signPayload(payload);
    return this.uploadFile(stream, token)
  }

  uploadDocumentFromFilePath(path: string, payload: uploadPayload) {
    const readable = createReadStream(path);
    const token = this.signPayload(payload);
    return this.uploadFile(readable, token)
  }
}