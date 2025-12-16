import mongoose from 'mongoose';

import jwt from 'jsonwebtoken';

import CustomError from './custom-error.util';

import Config from './../config';

export default class TokenUtil {

  private config = Config.getInstance();

  public getAccessToken(userId: mongoose.Types.ObjectId): string {    
    const token = this.createAccessJWT(userId);

    return token;
  }

  public getUserIdFromAccessToken(token: string): Promise<mongoose.Types.ObjectId> {
    const decodedToken = jwt.verify(token, this.config.jwt.accessSecret);

    if (decodedToken && typeof decodedToken !== 'string' && decodedToken.userId && mongoose.isValidObjectId(decodedToken.userId)) {
      return decodedToken.userId;
    }

    throw new CustomError(404, 'Invalid Token');
  }

  private createAccessJWT(userId: mongoose.Types.ObjectId): string {
    const token = jwt.sign(
      { userId }, 
      this.config.jwt.accessSecret,
      { expiresIn: this.config.jwt.accessExpireTime }
    );

    return token;
  }

  private static instance: TokenUtil;

  public  static getInstance(): TokenUtil {
    if (!TokenUtil.instance) {
      TokenUtil.instance = new TokenUtil();
    }
    
    return TokenUtil.instance;
  }

}
