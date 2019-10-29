import User from '../models/User';

class UserController {
  async store(req, res) {
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.json({ error: 'this user already exists' });
    }

    const user = User.create(req.body);

    return res.json({ message: 'Cadastrado com sucesso' });
  }

  async update(req, res) {
    return res.json(req.userId);
  }
}
export default new UserController();
