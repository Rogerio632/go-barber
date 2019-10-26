import { Router } from 'express';
import User from './app/models/User';

const routes = new Router();

routes.get('/', async (req, res) => {
  const user = await User.create({
    name: 'Rogério De Oliveira',
    email: 'rogeriofilho632@gmail.com',
    password_hash: '12344321',
  });
  return res.json(user);
});

export default routes;
