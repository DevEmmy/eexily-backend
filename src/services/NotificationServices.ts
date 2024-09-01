import { INotification } from "../models/notification";
import NotificationRepository from "../repositories/NotificationRepository";

class NotificationService {
  private notificationRepo: NotificationRepository;

  constructor(notificationRepo: NotificationRepository) {
    this.notificationRepo = notificationRepo;
  }

  async sendNotification(notificationData: Partial<INotification>) {
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
