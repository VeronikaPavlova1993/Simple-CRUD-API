import { IncomingMessage, ServerResponse } from 'node:http';
import userUtils from '../utils/userUtils';
import userService from '../methods/methods';
import { errorHandler } from '../utils/errorHandler';

const getUsers = (_: IncomingMessage, res: ServerResponse) => {
 try {
  const users = userService.getAllUsers();

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(users));
 } catch (error) {
  errorHandler(res, error);
 }
};

const getUser = (_: IncomingMessage, res: ServerResponse, userId: string) => {
 try {
  const user = userService.getUserById(userId);

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(user));
 } catch (error) {
  errorHandler(res, error);
 }
};

const createUser = async (req: IncomingMessage, res: ServerResponse) => {
 try {
  const userData = await userUtils.collectUserData(req);
  const user = userService.createUser(userData);

  res.writeHead(201, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(user));
 } catch (error) {
  errorHandler(res, error);
 }
};

const updateUser = async (
 req: IncomingMessage,
 res: ServerResponse,
 userId: string
) => {
 try {
  const userData = await userUtils.collectUserData(req);
  const user = userService.updateUser(userData, userId);

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(user));
 } catch (error) {
  errorHandler(res, error);
 }
};

const deleteUser = (
 _: IncomingMessage,
 res: ServerResponse,
 userId: string
) => {
 try {
  userService.deleteUser(userId);

  res.writeHead(204);
  res.end();
 } catch (error) {
  errorHandler(res, error);
 }
};

const userController = {
 getUsers,
 getUser,
 createUser,
 updateUser,
 deleteUser,
};

export default userController;
