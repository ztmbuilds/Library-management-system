import { AppError } from '../middlewares/error.middleware';
import { User } from '../models/user.model';
import { IUserUpdate } from '../types';

class UserService {
  async update(id: string, data: IUserUpdate) {
    try {
      const user = await User.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      }).select('-password');

      if (!user) throw new AppError('User not found', 404);

      return user;
    } catch (err) {
      throw err;
    }
  }

  async get(id: string) {
    try {
      const user = await User.findById(id).select('-password');

      if (!user) throw new AppError('User not found', 404);

      return user;
    } catch (err) {
      throw err;
    }
  }
}

export default new UserService();
