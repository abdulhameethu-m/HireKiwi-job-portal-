import { dbStore } from '../models/Store.js';
import { profileUpdateSchema } from '../utils/validators.js';

export const getProfile = (req, res) => {
  const user = dbStore.findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({
      error: { code: 'USER_NOT_FOUND', message: 'User not found.' }
    });
  }

  const { password, ...safeUser } = user;
  return res.status(200).json({ profile: safeUser });
};

export const updateProfile = (req, res, next) => {
  try {
    const validated = profileUpdateSchema.parse(req.body);
    const updated = dbStore.updateUser(req.user.id, validated);
    if (!updated) {
      return res.status(404).json({
        error: { code: 'USER_NOT_FOUND', message: 'User not found.' }
      });
    }

    const { password, ...safeUser } = updated;
    return res.status(200).json({
      message: 'Profile updated successfully.',
      profile: safeUser
    });
  } catch (err) {
    next(err);
  }
};
