import { Router } from 'express';
import {
    getPokemonCards,
    getPokemonCardById,
    createPokemonCard,
    updatePokemonCard,
    deletePokemonCard
} from './pokemonCard.controller';
import { verifyJWT } from '../common/auth.middleware';

export const pokemonCardRouter = Router();

// Route pour obtenir la liste de tous les pokémons
pokemonCardRouter.get('/', getPokemonCards);

// Route pour obtenir un pokémon spécifique
pokemonCardRouter.get('/:pokemonCardId', getPokemonCardById);

// Route pour créer un nouveau pokémon (protégée)
pokemonCardRouter.post('/', verifyJWT, createPokemonCard);

// Route pour modifier un pokémon existant (protégée)
pokemonCardRouter.patch('/:pokemonCardId', verifyJWT, updatePokemonCard);

// Route pour supprimer un pokémon (protégée)
pokemonCardRouter.delete('/:pokemonCardId', verifyJWT, deletePokemonCard);
