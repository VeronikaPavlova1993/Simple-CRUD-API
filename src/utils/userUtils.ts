import { IncomingMessage } from "http";
import { User } from "../types";

const userData = (req: IncomingMessage): Promise<User> => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', (error) => {
      reject(error);
    });
  });
};
const userUtils = {
  userData
};
export default userUtils;