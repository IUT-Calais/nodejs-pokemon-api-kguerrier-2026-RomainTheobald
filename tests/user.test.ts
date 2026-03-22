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

    it('should return 400 if login fails with database error', async () => {
      const loginData = {
        email: 'admin@gmail.com',
        password: 'truePassword'
      };

      prismaMock.user.findUnique.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/users/login')
        .send(loginData);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Login failed' });
    });
  });

  describe('GET /users', () => {
    it('should fetch all users', async () => {
      const mockUsers = [
        {
          id: 1,
          email: 'user1@example.com',
          password: 'hashedPassword1'
        },
        {
          id: 2,
          email: 'user2@example.com',
          password: 'hashedPassword2'
        }
      ];

      prismaMock.user.findMany.mockResolvedValue(mockUsers);

      const response = await request(app).get('/users');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
      expect(prismaMock.user.findMany).toHaveBeenCalled();
    });

    it('should return 400 if retrieval fails', async () => {
      prismaMock.user.findMany.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/users');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Failed to retrieve users' });
    });
  });

  describe('GET /users/:userId', () => {
    it('should fetch a user by ID', async () => {
      const mockUser = {
        id: 1,
        email: 'user1@example.com',
        password: 'hashedPassword'
      };

      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      const response = await request(app).get('/users/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 }
      });
    });

    it('should return 404 if user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/users/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'User not found' });
    });

    it('should return 404 if retrieval fails', async () => {
      prismaMock.user.findUnique.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/users/1');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'User not found' });
    });
  });

  describe('PATCH /users/:userId', () => {
    it('should update a user with valid token', async () => {
      const updateData = {
        email: 'updated@example.com'
      };

      const updatedUser = {
        id: 1,
        email: 'updated@example.com',
        password: 'hashedPassword'
      };

      prismaMock.user.update.mockResolvedValue(updatedUser);

      const response = await request(app)
        .patch('/users/1')
        .set('Authorization', 'Bearer mockedToken')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedUser);
      expect(prismaMock.user.update).toHaveBeenCalled();
    });

    it('should update user password with valid token', async () => {
      const updateData = {
        password: 'newPassword123'
      };

      const updatedUser = {
        id: 1,
        email: 'user@example.com',
        password: 'hashedNewPassword'
      };

      prismaMock.user.update.mockResolvedValue(updatedUser);

      const response = await request(app)
        .patch('/users/1')
        .set('Authorization', 'Bearer mockedToken')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedUser);
    });

    it('should return 401 if no token provided', async () => {
      const updateData = {
        email: 'updated@example.com'
      };

      const response = await request(app)
        .patch('/users/1')
        .send(updateData);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Token manquant' });
    });

    it('should return 404 if user not found', async () => {
      const updateData = {
        email: 'updated@example.com'
      };

      prismaMock.user.update.mockRejectedValue(new Error('Not found'));

      const response = await request(app)
        .patch('/users/999')
        .set('Authorization', 'Bearer mockedToken')
        .send(updateData);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'User not found' });
    });
  });

  describe('DELETE /users/:userId', () => {
    it('should delete a user with valid token', async () => {
      const deletedUser = {
        id: 1,
        email: 'user@example.com',
        password: 'hashedPassword'
      };

      prismaMock.user.delete.mockResolvedValue(deletedUser);

      const response = await request(app)
        .delete('/users/1')
        .set('Authorization', 'Bearer mockedToken');

      expect(response.status).toBe(204);
      expect(prismaMock.user.delete).toHaveBeenCalledWith({
        where: { id: 1 }
      });
    });

    it('should return 401 if no token provided', async () => {
      const response = await request(app).delete('/users/1');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Token manquant' });
    });

    it('should return 404 if user not found', async () => {
      prismaMock.user.delete.mockRejectedValue(new Error('Not found'));

      const response = await request(app)
        .delete('/users/999')
        .set('Authorization', 'Bearer mockedToken');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'User not found' });
    });
  });
});
