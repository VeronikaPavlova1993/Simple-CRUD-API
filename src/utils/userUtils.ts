import { IncomingMessage } from 'http';
import { validate as validateUUID } from 'uuid';
import { User } from '../types';

const throwError = (statusCode: number, message: string): never => {
 throw { statusCode, message };
};

const collectUserData = (req: IncomingMessage): Promise<User> => {
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

const validateUserId = (userId: string): boolean => {
 if (!validateUUID(userId)) {
  throwError(400, 'Invalid user ID');
 }

 return true;
};

const validateUserFields = (userData: Partial<User>, isUpdate = false) => {
 const { username, age, hobbies } = userData;

 if (!isUpdate) {
  if (!username || !age || !hobbies) {
   throwError(400, 'Missing required fields');
  }
 } else {
  if (!username && !age && !hobbies) {
   throwError(400, 'At least one field must be provided');
  }
 }

 if (username && typeof username !== 'string') {
  throwError(400, 'Username field must be a string');
 }

 if (age && typeof age !== 'number') {
  throwError(400, 'Age field must be a number');
 }

 if (
  hobbies &&
  (!Array.isArray(hobbies) ||
   hobbies.some((hobby) => typeof hobby !== 'string'))
 ) {
  throwError(400, 'Hobbies field must be an array of strings');
 }
};

const userUtils = {
 collectUserData,
 validateUserId,
 validateUserFields,
};

export default userUtils;
