import { Router } from 'express';
import {
    getPokemonCards,
    getPokemonCardById,
    createPokemonCard,
    updatePokemonCard,
    deletePokemonCard
} from './pokemonCard.controller.js';

export const pokemonCardRouter = Router();

// Route pour obtenir la liste de tous les pokémons
pokemonCardRouter.get('/', getPokemonCards);

// Route pour obtenir un pokémon spécifique
pokemonCardRouter.get('/:pokemonCardId', getPokemonCardById);

// Route pour créer un nouveau pokémon
pokemonCardRouter.post('/', createPokemonCard);

// Route pour modifier un pokémon existant
pokemonCardRouter.patch('/:pokemonCardId', updatePokemonCard);

// Route pour supprimer un pokémon
pokemonCardRouter.delete('/:pokemonCardId', deletePokemonCard);
