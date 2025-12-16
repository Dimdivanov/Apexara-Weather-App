import { RequestHandler } from 'express';

import bcryptjs from 'bcryptjs';

import CustomError from './../util/custom-error.util';

import TokenUtil from './../util/token.util';

import UserDataLayer from './../data-layers/user.data-layer';

import { IUser } from './../models/user.model';

export default class AuthController {

  private tokenUtil = TokenUtil.getInstance();
  private userDataLayer = UserDataLayer.getInstance();

  public register: RequestHandler = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      throw new CustomError(400, 'Missing fields: username | email | password');
    }

    const createdUser: Partial<IUser> = {
      username,
      email,
      password,
    };

    const user = await this.userDataLayer.create(createdUser);

    const accessToken = this.tokenUtil.getAccessToken(user._id);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });
    
    res.status(200).json({
      success: true,
      message: 'Register successful',
      token: accessToken,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      }
    });
  }
  
  public login: RequestHandler = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new CustomError(404, 'User not found / Wrong credentials');
    }

    const user = await this.userDataLayer.get({ email: email }, 'password');

    const isPasswordValid = await bcryptjs.compare(password, user.password)
      .catch(err => {
        throw new CustomError(500, err.message);
      });

    if (!isPasswordValid) {
      throw new CustomError(404, 'User not found / Wrong credentials');
    }

    const accessToken = this.tokenUtil.getAccessToken(user._id);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: accessToken,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      }
    });
  }

  public logout: RequestHandler = async (req, res) => {
    res.cookie('accessToken', '', {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 0,
    });

    res.status(204).json();
  }

  public changePassword: RequestHandler = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      throw new CustomError(400, 'Missing fields: password | newPassword');
    }

    const freshUser = await this.userDataLayer.getById(req.user._id, 'password'); 

    const isOldPasswordValid = await bcryptjs.compare(oldPassword, freshUser.password)
      .catch(err => {
        throw new CustomError(500, err.message);
      });

    if (!isOldPasswordValid) {
      throw new CustomError(400, 'Invalid old password');
    }

    await this.userDataLayer.updatePassword(freshUser, newPassword);

    res.status(200).json();
  }

  public getMe: RequestHandler = async (req, res) => {
    const user = req.user;
    
    if (!user) {
      throw new CustomError(404, 'User not found');
    }

    res.status(200).json(user);
  }

}
