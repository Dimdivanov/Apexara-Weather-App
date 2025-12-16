import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

interface IUser {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updateAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
}, 
{
  timestamps: true,
  collection: 'users',
});

UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc: any, ret: any) { delete ret._id, delete ret.password },
});

UserSchema.pre<any>('save', async function(): Promise<void> {
  const user = this;

  if (user.isModified('password')) {
    const salt = await bcryptjs.genSalt(12);

    user.password = await bcryptjs.hash(user.password, salt);
  }
});

UserSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model<IUser>('User', UserSchema);

type UserDoc = ReturnType<(typeof User)['hydrate']>;

export { User, IUser, UserDoc };
