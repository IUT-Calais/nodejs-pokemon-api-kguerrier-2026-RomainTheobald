import { Router } from 'express';
import { createUser, loginUser } from './user.controller';

export const userRouter = Router();

userRouter.post('/', createUser);
userRouter.post('/login', loginUser);
