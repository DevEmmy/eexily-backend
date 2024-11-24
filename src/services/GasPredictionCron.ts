import cron from "node-cron";
import { Container, Service } from "typedi";
import GasPredictionService from "./GasPredictionServices";
import NotificationService from "./NotificationServices";
import { INotification } from "../models/notification";

@Service()
class GasPredictionCron {
    private gasPredictionService: GasPredictionService;

    constructor(private notificationService: NotificationService) {
        this.gasPredictionService = Container.get(GasPredictionService);
    }

    public start() {
        // Schedule the job to run every day at noon
        cron.schedule("* * * * *", async () => {
            console.log("[Cron Job] Starting gas prediction updates...");

            try {
                // Fetch all users with gas prediction data
                const gasPredictions = await this.gasPredictionService.findAll();

                for (const gasPrediction of gasPredictions) {
                    const userId = String(gasPrediction.user);

                    // Calculate updated prediction for each user
                    const prediction = await this.gasPredictionService.predictGasCompletion(userId);

                    const daysLeft = prediction.daysLeft;
                    const completionDate = prediction.completionDate.toDateString();
                    console.log(
                        `[Cron Job] Updated prediction for user: ${userId}. Days left: ${daysLeft}, Estimated completion date: ${completionDate}`
                    );

                    // Notify user based on days left
                    if (daysLeft === 3) {
                        const notification = {
                            userId: gasPrediction.user,
                            actionLabel: "🚨 Critical",
                            message: `You have 3 days left before your gas runs out. Please plan ahead!`,
                        };
                        await this.notificationService.sendNotification(notification);
                    } else if (daysLeft === 1) {
                        const notification = {
                            userId: gasPrediction.user,
                            actionLabel: "⚠️ Urgent",
                            message: `Your gas is almost finished. Only 1 day left!`,
                        };
                        await this.notificationService.sendNotification(notification);
                    } else if (daysLeft === 0) {
                        const notification = {
                            userId: gasPrediction.user,
                            actionLabel: "⚠️ Urgent",
                            message: `⏳ Today is the estimated day your gas should run out. Did it finish? Please update your gas refill data.`,
                        };
                        await this.notificationService.sendNotification(notification);
                    } else if (daysLeft < 0) {
                        const overdueDays = Math.abs(daysLeft);
                        const notification = {
                            userId: gasPrediction.user,
                            actionLabel: "⛽ Reminder",
                            message: `Your gas ran out ${overdueDays} days ago. Please refill and update your gas history.`,
                        };
                        await this.notificationService.sendNotification(notification);
                    }
                }

                console.log("[Cron Job] Gas prediction updates completed.");
            } catch (error: any) {
                console.error("[Cron Job] Error updating gas predictions:", error.message);
            }
        });
    }
}

export default GasPredictionCron;
