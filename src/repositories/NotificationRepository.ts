import { Types } from "mongoose";
import Notification, { INotification } from "../models/notification";
import User from "../models/user";
import { BaseRepository } from "./BaseRepository";
import { Service } from "typedi";

@Service()
class NotificationRepository extends BaseRepository<INotification>{
    constructor(){
        super(Notification)
    }

    async markAsRead(notificationId: string) {
        return this.model.findByIdAndUpdate(notificationId, { read: true }, { new: true });
      }
    
      async getUserNotifications(userId: string) {
        return this.model.find({ userId, read: false }).sort({ createdAt: -1 });
      }

      async  sendNotification(userId: Types.ObjectId, level: string) {
        try {
          const user = await User.findById(userId);
          if (!user) {
            throw new Error('User not found');
          }
      
          let message = '';
          let action = '';
          let actionLabel = '';
          let notificationType = '';
      
          // Customize the notification based on the gas level
          switch (level) {
            case 'low':
              message = `Hello ${user.firstName}, your gas level is currently low.`;
              notificationType = 'low';
              action = '/refill'; // Hypothetical URL or action
              actionLabel = 'Refill Now';
              break;
      
            case 'average':
              message = `Hello ${user.firstName}, your gas level is at 50%.`;
              notificationType = 'average';
              action = ''; // No action necessary
              actionLabel = ''; 
              break;
      
            case 'full':
              message = `Hello ${user.firstName}, your gas tank is fully filled.`;
              notificationType = 'full';
              action = ''; // No action necessary
              actionLabel = ''; 
              break;
      
            default:
              throw new Error('Unknown gas level');
          }
      
          // Save the notification to the database
          const notification = new Notification({
            userId: user._id,
            message,
            action,
            actionLabel,
            read: false,
            createdAt: new Date()
          });
      
          await notification.save();
      
          // Optionally, send push notifications
          await this.create({
            userId: new Types.ObjectId(user._id as string),
            // title: 'Gas Level Update',
            message,
            notificationType,
            actionLabel
          });
      
          console.log(`Notification sent and saved for user ${user.firstName} regarding gas level: ${level}`);
        } catch (error) {
          console.error('Error sending notification:', error);
        }
      }
      

}

export default NotificationRepository