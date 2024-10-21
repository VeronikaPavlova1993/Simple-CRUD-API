import { IncomingMessage, ServerResponse } from 'node:http';
import { errorHandler } from '../utils/errorHandler';
import userRepository from '../repo/repo';
import userUtils from '../utils/userUtils';
import { User } from '../types';
import { uuidv4 } from 'uuid';

const getUsers = (_: IncomingMessage, res: ServerResponse) => {
 try {
  const users = userRepository.getUsers();

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(users));
 } catch (error) {
  errorHandler(res, error);
 }
};

const createUser = async (req: IncomingMessage, res: ServerResponse) => {
 const create = (userData: User) => {
  const { username, age, hobbies } = userData;
  if (!username || !age || !hobbies) {
   throw { statusCode: 400, message: 'Missing required fields' };
  }
  if (typeof username !== 'string') {
   throw { statusCode: 400, message: 'Username field must be a string' };
  }
  if (typeof age !== 'number') {
   throw { statusCode: 400, message: 'Age field must be a number' };
  }
  if (
   !Array.isArray(hobbies) ||
   hobbies.some((hobby) => typeof hobby !== 'string')
  ) {
   throw {
    statusCode: 400,
    message: 'Hobbies field must be an array of strings',
   };
  }
  const user = { id: uuidv4(), username, age, hobbies };
  userRepository.create(user);
  return user;
 };

 try {
  const userData = await userUtils.userData(req);
  const user = create(userData);

  res.writeHead(201, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(user));
 } catch (error) {
  errorHandler(res, error);
 }
};



const userController = {
 getUsers,
 getUser,
 createUser,
};

export default userController;
