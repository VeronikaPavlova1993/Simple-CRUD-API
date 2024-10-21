import http, { IncomingMessage, ServerResponse } from 'node:http';
import { v4 as uuidv4, validate as validateUUID } from 'uuid';
import url from 'node:url';
import { User } from '../types';
import userController from '../controllers/controller';

const router = (req: IncomingMessage, res: ServerResponse) => {
    const method = req.method;
    const parsedUrl = url.parse(req?.url || '', true);
    let path = parsedUrl.pathname || '';
  
    path = path.replace(/\/+$/, '');
    const parts = path.split('/').filter(Boolean);
  
    if (method === 'GET' && parts[0] === 'api' && parts[1] === 'users' && parts[2]) {
      const userId = parts[2];
      userController.getUser(req, res, userId);
    } else if (method === 'GET' && path === '/api/users') {
      userController.getUsers(req, res);
    } else if (method === 'POST' && path === '/api/users') {
      userController.createUser(req, res);
    } else if (method === 'PUT' && parts[0] === 'api' && parts[1] === 'users' && parts[2]) {
      const userId = parts[2];
      userController.updateUser(req, res, userId);
    } else if (method === 'DELETE' && parts[0] === 'api' && parts[1] === 'users' && parts[2]) {
      const userId = parts[2];
      userController.deleteUser(req, res, userId);
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: 'Resource not found' }));
    }
  };
  
  const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
    router(req, res);
  });
  console.log(' process.env.PORT', process.env.PORT);
  const PORT = process.env.PORT || 3000;
  
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });