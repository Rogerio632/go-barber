import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';
import Appointment from '../models/Appointment';
import User from '../models/User';

class AppointmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: "I think you've written something wrong!" });
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

    /* Checa se há data anterior a data atual */
    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'past date   are not permitted' });
    }
    /* Verifica se a data está preenchida */
    const checkAvailable = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
      },
    });

    /*   if (checkAvailable) {
      return res.status(400).json({ error: 'Appointment date is not avaible' });
    } */
    return res.json(checkAvailable);
    /*    const store = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date,
    });

    return res.status(201).json(store);
  } */
  }
}

export default new AppointmentController();
