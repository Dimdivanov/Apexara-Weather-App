import mongoose, { FilterQuery, UpdateQuery } from 'mongoose';

import CustomError from './../util/custom-error.util';

import { IUser, User, UserDoc } from './../models/user.model';

export default class UserDataLayer {

  public async create(data: Partial<IUser>): Promise<UserDoc> {
    return await User.create(data)
      .catch(err => {
        if (err.code === 11000) {
          throw new CustomError(400, 'Email already exists');
        }

        throw new CustomError(500, err.message);
      });
  }

  public async get(filter: FilterQuery<IUser>, projection: string = '-password'): Promise<UserDoc> {
    const user = await User.findOne(filter)
      .select(projection)
      .catch(err => {
        throw new CustomError(500, err.message, 'No user found in database');
      });
    
    if (!user) {
      throw new CustomError(404, 'No user found');
    }

    return user;
  }

  public async getById(id: string | mongoose.Types.ObjectId, projection: string = '-password'): Promise<UserDoc> {
    if (!mongoose.isValidObjectId(id)) {
      throw new CustomError(400, 'Invalid ID');
    }

    const user = await User.findById(id)
      .select(projection)
      .catch(err => {
        throw new CustomError(500, err.message);
      });

    if (!user) {
      throw new CustomError(404, 'No user found');
    }

    return user;
  }

  public async update(id: string | mongoose.Types.ObjectId, update: UpdateQuery<IUser>, projection: string = '-password'): Promise <UserDoc> {
    if (!mongoose.isValidObjectId(id)) {
      throw new CustomError(400, 'Invalid ID');
    }
    
    const user = await User.findByIdAndUpdate(id, update, { new: true })
      .select(projection)
      .catch(err => {
        if (err.code === 11000) {
          throw new CustomError(400, 'Email already exists');
        }

        throw new CustomError(500, err.message);
      });

    if (!user) {
      throw new CustomError(404, 'No user found');
    }

    return user;
  }

  public async delete(user: UserDoc): Promise<void> {
    await user.deleteOne()
      .catch(err => {
        throw new CustomError(500, err.message);
      })
  }

  public async updatePassword(user: UserDoc, password: string): Promise<UserDoc> {
    user.password = password;

    await user.save()
      .catch(err => {
        throw new CustomError(500, err.message);
      });
      
    return user;
  }

  private static instance: UserDataLayer;

  public static getInstance(): UserDataLayer {
    if (!UserDataLayer.instance) {
      UserDataLayer.instance = new UserDataLayer();
    }

    return UserDataLayer.instance;
  }

}
