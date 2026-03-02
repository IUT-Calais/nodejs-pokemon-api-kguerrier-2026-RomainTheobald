import { Router } from 'express';
import { createUser, loginUser } from './user.controller.js';

export const userRouter = Router();

userRouter.post('/', createUser);
userRouter.post('/login', loginUser);
