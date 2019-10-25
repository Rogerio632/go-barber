import { Router } from 'express';

const routes = new Router();

routes.get('/post/:id', (req, res) => {
  const { id } = req.params;

  return res.send(`O número digitado foi: ${id}`);
});


export default routes;
