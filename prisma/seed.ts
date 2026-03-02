import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.pokemonCard.deleteMany();
  await prisma.user.deleteMany();
  await prisma.type.deleteMany();
  await prisma.type.createMany({
    data: [
      { name: 'Normal' },
      { name: 'Fire' },
      { name: 'Water' },
      { name: 'Grass' },
      { name: 'Electric' },
      { name: 'Ice' },
      { name: 'Fighting' },
      { name: 'Poison' },
      { name: 'Ground' },
      { name: 'Flying' },
      { name: 'Psychic' },
      { name: 'Bug' },
      { name: 'Rock' },
      { name: 'Ghost' },
      { name: 'Dragon' },
      { name: 'Dark' },
      { name: 'Steel' },
      { name: 'Fairy' },
    ],
  });

  console.log('Seed completed!');

  const fireType = await prisma.type.findUnique({ where: { name: 'Fire' } });

  await prisma.pokemonCard.create({
    data: {
      name: 'Charizard',
      pokedexId: 6,
      type: { connect: { name: 'Fire' } },
      lifePoints: 78,
      size: 1.7,
      weight: 90.5,
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/6.png'
    }
  })

  await prisma.pokemonCard.create({
    data: {
      name: "Bulbizarre",
      pokedexId: 1,
      size: 0.7,
      type: { connect: { name: 'Grass' } },
      lifePoints: 45,
      imageUrl: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png"
    }
  })

  await prisma.user.create({
    data: {
      email: 'admin@gmail.com',
      password: await bcrypt.hash('admin', 10)
    }
  })
}



main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
