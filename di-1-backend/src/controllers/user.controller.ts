import { UpdateQuery } from 'mongoose';
import { RequestHandler } from 'express';

import CustomError from './../util/custom-error.util';

import UserDataLayer from './../data-layers/user.data-layer';

import { IUser } from './../models/user.model';

export default class UserController {
  
  private userDataLayer = UserDataLayer.getInstance();

  public updateUser: RequestHandler = async (req, res) => {
    if (req.body.id) {
      const { username, email } = req.body;
      
      if (!username || !email) {
        throw new CustomError(400, 'Missing fields: username | email');
      }

      let user = await this.userDataLayer.getById(req.body.id);

      const updateUser: UpdateQuery<IUser> = {
        username,
        email,
      };

      user = await this.userDataLayer.update(user._id, updateUser);
      
      res.status(200).json(user);
      return;
    }
  }

  public deleteUser: RequestHandler = async (req, res) => {
      const id = req.params.userId;

      const user = await this.userDataLayer.getById(id);

      await this.userDataLayer.delete(user);

      res.status(200).json();
  }

}
