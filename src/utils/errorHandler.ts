import { ServerResponse } from 'http';
import { CustomError } from '../types';

const isCustomError = (error: unknown): error is CustomError => {
 return typeof error === 'object' && error !== null && 'statusCode' in error;
};

export const errorHandler = (res: ServerResponse, error: unknown): void => {
 if (isCustomError(error)) {
  res.statusCode = error.statusCode;
  res.end(JSON.stringify({ message: error.message }));
 } else {
  res.statusCode = 500;
  res.end(JSON.stringify({ message: 'Internal server error' }));
 }
};
