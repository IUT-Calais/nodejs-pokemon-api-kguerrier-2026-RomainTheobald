import express from 'express';
import { pokemonCardRouter } from './pokemonCard/pokemonCard.router.js';
import { userRouter } from './user/user.router.js';

export const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/users', userRouter);
app.use('/pokemon-cards', pokemonCardRouter);

export const server = app.listen(port);

export function stopServer() {
  server.close();
}
