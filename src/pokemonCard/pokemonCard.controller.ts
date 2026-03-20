import type { Request, Response } from 'express';
import prisma from '../client';
export const getPokemonCards = async (_req: Request, res: Response) => {
    const pokemonCards = await prisma.pokemonCard.findMany({ include: { type: true } });
    res.status(200).send(pokemonCards);
}

export const getPokemonCardById = async (req: Request, res: Response) => {
    const { pokemonCardId } = req.params;
    const pokemonCard = await prisma.pokemonCard.findUnique({
        where: { id: parseInt(pokemonCardId) },
        include: { type: true }
    });
    if (!pokemonCard) {
        res.status(404).send({ error: 'Pokemon card not found' });
        return;
    }
    res.status(200).send(pokemonCard);
}

export const createPokemonCard = async (req: Request, res: Response) => {
    const { name, pokedexId, typeId, lifePoints, size, weight, imageUrl } = req.body;
    try {
        const pokemonCard = await prisma.pokemonCard.create({
            data: {
                name,
                pokedexId,
                typeId,
                lifePoints,
                size,
                weight,
                imageUrl
            },
            include: { type: true }
        });
        res.status(201).send(pokemonCard);
    } catch (error) {
        res.status(400).send({ error: 'Failed to create pokemon card' });
    }
}

export const updatePokemonCard = async (req: Request, res: Response) => {
    const { pokemonCardId } = req.params;
    const { name, pokedexId, typeId, lifePoints, size, weight, imageUrl } = req.body;
    try {
        const pokemonCard = await prisma.pokemonCard.update({
            where: { id: parseInt(pokemonCardId) },
            data: {
                name,
                pokedexId,
                typeId,
                lifePoints,
                size,
                weight,
                imageUrl
            },
            include: { type: true }
        });
        res.status(200).send(pokemonCard);
    } catch (error) {
        res.status(404).send({ error: 'Pokemon card not found' });
    }
}

export const deletePokemonCard = async (req: Request, res: Response) => {
    const { pokemonCardId } = req.params;
    try {
        await prisma.pokemonCard.delete({
            where: { id: parseInt(pokemonCardId) }
        });
        res.status(204).send();
    } catch (error) {
        res.status(404).send({ error: 'Pokemon card not found' });
    }
}