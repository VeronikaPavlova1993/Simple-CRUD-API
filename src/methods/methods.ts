import { v4 } from 'uuid';
import { User } from '../types';
import userRepository from '../repo/repo';
import userUtils from '../utils/userUtils';


const throwError = (statusCode: number, message: string): never => {
    throw { statusCode, message };
  };

const getAllUsers = () => {
  return userRepository.getUsers();
};

const filterFalsyUserFields = (obj: Partial<User>): Partial<User> => {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, value]) => Boolean(value))
    );
  };

const getUserById = (userId: string) => {
  userUtils.validateUserId(userId);

  const user = userRepository.getUser(userId);

  if (!user) {
    throwError(404, 'User not found');
  }

  return user;
};

const createUser = (userData: User) => {
  const { username, age, hobbies } = userData;

  userUtils.validateUserFields(userData, false);

  const user = { id: v4(), username, age, hobbies };

  userRepository.create(user);
  return user;
};

const updateUser = (userData: Partial<User>, userId: string) => {
  userUtils.validateUserId(userId);

  userUtils.validateUserFields(userData, true);

  const user = userRepository.getUser(userId);

  if (!user) {
    throwError(404, 'User not found');
  }

  const filteredUserData = filterFalsyUserFields(userData);
  return userRepository.update({...user, ...filteredUserData});
};

const deleteUser = (userId: string) => {
  userUtils.validateUserId(userId);

  const deleted = userRepository.deleteUser(userId);

  if (!deleted) {
    throwError(404, 'User not found');
  }
};


const userService = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};

export default userService;