import { IncomingHttpHeaders } from "http";

export const tokenExtractor = (headers: IncomingHttpHeaders) => {
    const token = headers.token as string; 
    return JSON.parse(token);
}