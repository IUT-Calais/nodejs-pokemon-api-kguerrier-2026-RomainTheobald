import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../client';

export const createUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).send({ error: 'Email and password are required' });
        return;
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword
            }
        });
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send({ error: 'Email already exists' });
    }
}

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).send({ error: 'Email and password are required' });
        return;
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            res.status(401).send({ error: 'User not found' });
            return;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            res.status(401).send({ error: 'Invalid password' });
            return;
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: process.env.JWT_EXPIRATION || '1h' }
        );

        res.status(200).send({
            message: 'Connexion réussie',
            token,
            user: {
                id: user.id,
                email: user.email
            }
        });
    } catch (error) {
        res.status(400).send({ error: 'Login failed' });
    }
}

export const getUsers = async (_req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).send(users);
    } catch (error) {
        res.status(400).send({ error: 'Failed to retrieve users' });
    }
}

export const getUserById = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId) }
        });

        if (!user) {
            res.status(404).send({ error: 'User not found' });
            return;
        }

        res.status(200).send(user);
    } catch (error) {
        res.status(404).send({ error: 'User not found' });
    }
}

export const updateUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { email, password } = req.body;

    try {
        let updateData: any = {};

        if (email) {
            updateData.email = email;
        }

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const user = await prisma.user.update({
            where: { id: parseInt(userId) },
            data: updateData
        });

        res.status(200).send(user);
    } catch (error) {
        res.status(404).send({ error: 'User not found' });
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        await prisma.user.delete({
            where: { id: parseInt(userId) }
        });

        res.status(204).send();
    } catch (error) {
        res.status(404).send({ error: 'User not found' });
    }
}
