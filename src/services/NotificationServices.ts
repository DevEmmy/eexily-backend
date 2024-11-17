import { Service } from "typedi";
import { INotification } from "../models/notification";
import NotificationRepository from "../repositories/NotificationRepository";
import SocketServices from "./SocketServices";

@Service()
class NotificationService {


  constructor(private readonly notificationRepo: NotificationRepository, private readonly socketServices : SocketServices) {
  }

  async sendNotification(notificationData: Partial<INotification>) {
    this.socketServices.sendSocketNotification(String(notificationData.userId), notificationData)
    return this.notificationRepo.create(notificationData);
  }

  async markNotificationAsRead(notificationId: string) {
    return this.notificationRepo.markAsRead(notificationId);
  }

  async getUserNotifications(userId: string) {
    return this.notificationRepo.getUserNotifications(userId);
  }
}

export default NotificationService;
