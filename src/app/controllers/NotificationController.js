import Notification from '../schemas/Notification';
import User from '../models/User';

class NotificationController {
  async index(req, res) {
    const isProvider = await User.findOne({
      id: req.userId,
      provider: true,
    });

    if (!isProvider) {
      return res.status(401).json({
        error: "You don't have permission to see these notifications",
      });
    }

    const notifications = await Notification.find({
      user: req.userId,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);

    return res.json(notifications);
  }
}
export default new NotificationController();
