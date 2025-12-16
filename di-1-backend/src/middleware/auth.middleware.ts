import { RequestHandler } from 'express';

import CustomError from './../util/custom-error.util';

import TokenUtil from './../util/token.util';

import UserDataLayer from './../data-layers/user.data-layer';

import { UserDoc } from './../models/user.model';

declare global {
  namespace Express {
    interface Request {
      user: UserDoc;
    }
  }
}

export default class AuthMiddleware {
  
  private tokenUtil = TokenUtil.getInstance();
  private userDataLayer = UserDataLayer.getInstance();

  public isAuthenticated: RequestHandler = async (req, res, next) => {
    const accessToken = req.cookies?.accessToken;
    
    if (!accessToken) {
      return next(new CustomError(401, 'Unauthorized'));
    }

    try {
      const userId = await this.tokenUtil.getUserIdFromAccessToken(accessToken);
      const user = await this.userDataLayer.getById(userId);

      req.user = user;

      next();
    } catch (err) {
      return next(new CustomError(498, 'Invalid or expired token'));
    }
  }

  private static instance: AuthMiddleware;

  public static getInstance(): AuthMiddleware {
    if (!AuthMiddleware.instance) {
      AuthMiddleware.instance = new AuthMiddleware();
    }

    return AuthMiddleware.instance;
  }

}
