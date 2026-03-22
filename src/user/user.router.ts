import { Router } from 'express';
import { createUser, loginUser, getUsers, getUserById, updateUser, deleteUser } from './user.controller';
import { verifyJWT } from '../common/auth.middleware';

export const userRouter = Router();

userRouter.post('/', createUser);
userRouter.post('/login', loginUser);
userRouter.get('/', getUsers);
userRouter.get('/:userId', getUserById);
userRouter.patch('/:userId', verifyJWT, updateUser);
userRouter.delete('/:userId', verifyJWT, deleteUser);
