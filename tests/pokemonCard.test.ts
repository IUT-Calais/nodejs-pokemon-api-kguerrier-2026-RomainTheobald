import request from 'supertest';
import { app } from '../src';
import { prismaMock } from './jest.setup';

describe('PokemonCard API', () => {
  describe('GET /pokemon-cards', () => {
    it('should fetch all PokemonCards', async () => {
      const mockPokemonCards = [
        {
          id: 1,
          name: 'Bulbizarre',
          pokedexId: 1,
          typeId: 1,
          weaknessId: 2,
          lifePoints: 45,
          size: 0.7,
          weight: 6.9,
          imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png',
          type: { id: 1, name: 'Plante' },
          weakness: { id: 2, name: 'Feu' }
        }
      ];

      prismaMock.pokemonCard.findMany.mockResolvedValue(mockPokemonCards);

      const response = await request(app).get('/pokemon-cards');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPokemonCards);
      expect(prismaMock.pokemonCard.findMany).toHaveBeenCalled();
    });
  });

  describe('GET /pokemon-cards/:pokemonCardId', () => {
    it('should fetch a PokemonCard by ID', async () => {
      const mockPokemonCard = {
        id: 1,
        name: 'Bulbizarre',
        pokedexId: 1,
        typeId: 1,
        weaknessId: 2,
        lifePoints: 45,
        size: 0.7,
        weight: 6.9,
        imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png',
        type: { id: 1, name: 'Plante' },
        weakness: { id: 2, name: 'Feu' }
      };

      prismaMock.pokemonCard.findUnique.mockResolvedValue(mockPokemonCard);

      const response = await request(app).get('/pokemon-cards/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPokemonCard);
      expect(prismaMock.pokemonCard.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { type: true, weakness: true }
      });
    });

    it('should return 404 if PokemonCard is not found', async () => {
      prismaMock.pokemonCard.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/pokemon-cards/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Pokemon card not found' });
    });
  });

  describe('POST /pokemon-cards', () => {
    it('should create a new PokemonCard with valid token', async () => {
      const mockPokemonCardData = {
        name: 'Bulbizarre',
        pokedexId: 1,
        typeId: 1,
        lifePoints: 45,
        size: 0.7,
        weight: 6.9,
        imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png',
        weaknessId: 2
      };

      const createdPokemonCard = {
        id: 1,
        ...mockPokemonCardData,
        type: { id: 1, name: 'Plante' },
        weakness: { id: 2, name: 'Feu' }
      };

      prismaMock.pokemonCard.create.mockResolvedValue(createdPokemonCard);

      const response = await request(app)
        .post('/pokemon-cards')
        .set('Authorization', 'Bearer mockedToken')
        .send(mockPokemonCardData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdPokemonCard);
      expect(prismaMock.pokemonCard.create).toHaveBeenCalled();
    });

    it('should return 401 if no token provided', async () => {
      const mockPokemonCardData = {
        name: 'Bulbizarre',
        pokedexId: 1,
        typeId: 1,
        lifePoints: 45,
        size: 0.7,
        weight: 6.9,
        imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png'
      };

      const response = await request(app)
        .post('/pokemon-cards')
        .send(mockPokemonCardData);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Token manquant' });
    });

    it('should return 401 if token is invalid', async () => {
      const mockPokemonCardData = {
        name: 'Bulbizarre',
        pokedexId: 1,
        typeId: 1,
        lifePoints: 45,
        size: 0.7,
        weight: 6.9,
        imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png'
      };

      const response = await request(app)
        .post('/pokemon-cards')
        .set('Authorization', 'Bearer invalidToken')
        .send(mockPokemonCardData);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Token invalide ou expiré' });
    });

    it('should return 400 if creation fails', async () => {
      const mockPokemonCardData = {
        name: 'Bulbizarre',
        pokedexId: 1,
        typeId: 1,
        lifePoints: 45
      };

      prismaMock.pokemonCard.create.mockRejectedValue(new Error('Duplicate entry'));

      const response = await request(app)
        .post('/pokemon-cards')
        .set('Authorization', 'Bearer mockedToken')
        .send(mockPokemonCardData);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Failed to create pokemon card' });
    });
  });

  describe('PATCH /pokemon-cards/:pokemonCardId', () => {
    it('should update a PokemonCard with valid token', async () => {
      const updateData = {
        name: 'Bulbizarre Updated',
        lifePoints: 50,
        weaknessId: 3
      };

      const updatedPokemonCard = {
        id: 1,
        name: 'Bulbizarre Updated',
        pokedexId: 1,
        typeId: 1,
        weaknessId: 3,
        lifePoints: 50,
        size: 0.7,
        weight: 6.9,
        imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png',
        type: { id: 1, name: 'Plante' },
        weakness: { id: 3, name: 'Eau' }
      };

      prismaMock.pokemonCard.update.mockResolvedValue(updatedPokemonCard);

      const response = await request(app)
        .patch('/pokemon-cards/1')
        .set('Authorization', 'Bearer mockedToken')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedPokemonCard);
      expect(prismaMock.pokemonCard.update).toHaveBeenCalled();
    });

    it('should return 401 if no token provided', async () => {
      const updateData = {
        name: 'Bulbizarre Updated'
      };

      const response = await request(app)
        .patch('/pokemon-cards/1')
        .send(updateData);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Token manquant' });
    });

    it('should return 401 if token is invalid', async () => {
      const updateData = {
        name: 'Bulbizarre Updated'
      };

      const response = await request(app)
        .patch('/pokemon-cards/1')
        .set('Authorization', 'Bearer invalidToken')
        .send(updateData);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Token invalide ou expiré' });
    });

    it('should return 404 if PokemonCard not found', async () => {
      const updateData = {
        name: 'Bulbizarre Updated'
      };

      prismaMock.pokemonCard.update.mockRejectedValue(new Error('Not found'));

      const response = await request(app)
        .patch('/pokemon-cards/999')
        .set('Authorization', 'Bearer mockedToken')
        .send(updateData);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Pokemon card not found' });
    });
  });

  describe('DELETE /pokemon-cards/:pokemonCardId', () => {
    it('should delete a PokemonCard with valid token', async () => {
      const deletedPokemonCard = {
        id: 1,
        name: 'Bulbizarre',
        pokedexId: 1,
        typeId: 1,
        weaknessId: 2,
        lifePoints: 45,
        size: 0.7,
        weight: 6.9,
        imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png'
      };

      prismaMock.pokemonCard.delete.mockResolvedValue(deletedPokemonCard);

      const response = await request(app)
        .delete('/pokemon-cards/1')
        .set('Authorization', 'Bearer mockedToken');

      expect(response.status).toBe(204);
      expect(prismaMock.pokemonCard.delete).toHaveBeenCalledWith({
        where: { id: 1 }
      });
    });

    it('should return 401 if no token provided', async () => {
      const response = await request(app).delete('/pokemon-cards/1');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Token manquant' });
    });

    it('should return 401 if token is invalid', async () => {
      const response = await request(app)
        .delete('/pokemon-cards/1')
        .set('Authorization', 'Bearer invalidToken');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Token invalide ou expiré' });
    });

    it('should return 404 if PokemonCard not found', async () => {
      prismaMock.pokemonCard.delete.mockRejectedValue(new Error('Not found'));

      const response = await request(app)
        .delete('/pokemon-cards/999')
        .set('Authorization', 'Bearer mockedToken');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Pokemon card not found' });
    });
  });
});
