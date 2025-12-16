import { Router } from 'express';

import AuthMiddleware from './../middleware/auth.middleware';

import CatchUntil from './../util/catch.util';

import AuthController from './../controllers/auth.controller';

const authMiddleware = AuthMiddleware.getInstance();

const useCatch = CatchUntil.getUseCatch();
const authController = new AuthController();

const AuthRouter = Router();

AuthRouter.get('/me', authMiddleware.isAuthenticated, useCatch(authController.getMe));

AuthRouter.get('/logout', useCatch(authController.logout));

AuthRouter.post('/login', useCatch(authController.login));

AuthRouter.post('/register', useCatch(authController.register));

AuthRouter.patch('/password/change', authMiddleware.isAuthenticated, useCatch(authController.changePassword))

export default AuthRouter;
