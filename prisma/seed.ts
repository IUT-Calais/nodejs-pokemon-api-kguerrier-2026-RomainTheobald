import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
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

}



main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
