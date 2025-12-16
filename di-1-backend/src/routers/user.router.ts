import { Router } from 'express';

import AuthMiddleware from './../middleware/auth.middleware';

import CatchUntil from './../util/catch.util';

import UserController from './../controllers/user.controller';

const useCatch = CatchUntil.getUseCatch();

const authMiddleware = AuthMiddleware.getInstance();

const userController = new UserController();

const UserRouter = Router();

UserRouter.patch('/', authMiddleware.isAuthenticated, useCatch(userController.updateUser));

UserRouter.delete('/:userId', authMiddleware.isAuthenticated, useCatch(userController.deleteUser));

export default UserRouter;
