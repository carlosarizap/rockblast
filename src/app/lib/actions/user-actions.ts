import { getAllUsersFromDB, getUserByIdFromDB } from '@/app/lib/data/user-data';
import { User } from '@/app/lib/definitions/user';

// Action to fetch all users
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const users = await getAllUsersFromDB();
    return users;
  } catch (error) {
    throw new Error('Failed to fetch users');
  }
};

// Action to fetch a single user by ID
export const getUserById = async (id: string): Promise<User | null> => {
  try {
    const user = await getUserByIdFromDB(id);
    return user;
  } catch (error) {
    throw new Error('Failed to fetch user');
  }
};
