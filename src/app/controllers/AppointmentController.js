import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Appointment from '../models/Appointment';
import User from '../models/User';
import Notification from '../schemas/Notification';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const showAppointment = await Appointment.findAll({
      where: {
        user_id: req.userId,
        canceled_at: null,
      },
      order: ['date'],
      attributes: ['id', 'date'],
      limit: 2,
      offset: (page - 1) * 2,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
    return res.json(showAppointment);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: "Maybe you've written something wrong!" });
    }

    const { provider_id, date } = req.body;

    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res.status(401).json({
        error: "You don't have enought rights to make an appointment",
      });
    }

    if (provider_id === req.userId) {
      return res
        .status(401)
        .json({ error: 'You not be able to make an appointment to yourself' });
    }

    /* INÍCIO */

    /* Recebe a data com timezone, transforma no formato do new Date() e arredonda o horário */
    const hourStart = startOfHour(parseISO(date));

    /* Checa se há data anterior a data atual */
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'past date   are not permitted' });
    }
    /* FIM */

    /* Verifica se a data está preenchida */
    const checkAvailable = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailable) {
      return res
        .status(400)
        .json({ error: 'Appointment date is not available' });
    }

    const store = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date: hourStart,
    });

    /**
     * Notifiy new appoitment to provider
     */

    const user = await User.findByPk(req.userId);
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      { locale: pt }
    );

    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formattedDate}`,
      user: provider_id,
    });

    return res.status(201).json(store);
  }
}

export default new AppointmentController();
