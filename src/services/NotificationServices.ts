import { Service } from "typedi";
import { INotification } from "../models/notification";
import NotificationRepository from "../repositories/NotificationRepository";
import SocketServices from "./SocketServices";

@Service()
class NotificationService {


  constructor(private readonly notificationRepo: NotificationRepository, private readonly socketServices : SocketServices) {
  }

  async sendNotification(notificationData: Partial<INotification>) {
    let notification = await this.notificationRepo.create(notificationData);
    this.socketServices.sendSocketNotification(String(notification.userId), notification)
    return notification
  }

  async markNotificationAsRead(notificationId: string) {
    return this.notificationRepo.markAsRead(notificationId);
  }

  async getUserNotifications(userId: string) {
    return this.notificationRepo.getUserNotifications(userId);
  }
}

export default NotificationService;
