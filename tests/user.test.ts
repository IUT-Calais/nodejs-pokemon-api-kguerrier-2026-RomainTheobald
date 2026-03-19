import request from 'supertest';
import { app } from '../src';
import { prismaMock } from './jest.setup';

describe('User API', () => {
  describe('POST /users', () => {
    it('should create a new user with valid email and password', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const createdUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword'
      };

      prismaMock.user.create.mockResolvedValue(createdUser);

      const response = await request(app)
        .post('/users')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdUser);
      expect(prismaMock.user.create).toHaveBeenCalled();
    });

    it('should return 400 if email is missing', async () => {
      const userData = {
        password: 'password123'
      };

      const response = await request(app)
        .post('/users')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Email and password are required' });
    });

    it('should return 400 if password is missing', async () => {
      const userData = {
        email: 'test@example.com'
      };

      const response = await request(app)
        .post('/users')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Email and password are required' });
    });

    it('should return 400 if email already exists', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'password123'
      };

      prismaMock.user.create.mockRejectedValue(new Error('Email already exists'));

      const response = await request(app)
        .post('/users')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Email already exists' });
    });
  });

  describe('POST /users/login', () => {
    it('should login a user and return a token with valid credentials', async () => {
      const loginData = {
        email: 'admin@gmail.com',
        password: 'truePassword'
      };

      const mockUser = {
        id: 1,
        email: 'admin@gmail.com',
        password: 'hashedPassword'
      };

      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/users/login')
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('message', 'Connexion réussie');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.id).toBe(mockUser.id);
      expect(response.body.user.email).toBe(mockUser.email);
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginData.email }
      });
    });

    it('should return 400 if email is missing', async () => {
      const loginData = {
        password: 'truePassword'
      };

      const response = await request(app)
        .post('/users/login')
        .send(loginData);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Email and password are required' });
    });

    it('should return 400 if password is missing', async () => {
      const loginData = {
        email: 'admin@gmail.com'
      };

      const response = await request(app)
        .post('/users/login')
        .send(loginData);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Email and password are required' });
    });

    it('should return 401 if user not found', async () => {
      const loginData = {
        email: 'notfound@example.com',
        password: 'password123'
      };

      prismaMock.user.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/users/login')
        .send(loginData);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'User not found' });
    });

    it('should return 401 if password is incorrect', async () => {
      const loginData = {
        email: 'admin@gmail.com',
        password: 'wrongPassword'
      };

      const mockUser = {
        id: 1,
        email: 'admin@gmail.com',
        password: 'hashedPassword'
      };

      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/users/login')
        .send(loginData);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Invalid password' });
    });
  });
});
