import { Service } from "typedi";
import { BaseRepository } from "./BaseRepository";
import MerchantTransactions, { IMerchantTransactions } from "../models/merchantTransaction";
import { startOfWeek, startOfMonth, subWeeks, subMonths, endOfWeek, endOfMonth } from 'date-fns';
import mongoose from 'mongoose';

@Service()
class MerchantRepository extends BaseRepository<IMerchantTransactions> {
    constructor() {
        super(MerchantTransactions);
    }

    // Method to calculate total revenue
    async getTotalRevenue(): Promise<number> {
        const result = await MerchantTransactions.aggregate([
            { $match: { transactionType: 'CREDIT', status: 'COMPLETED' } },
            { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
        ]);
        return result[0]?.totalRevenue || 0;
    }

    // Helper method to get revenue by date range
    private async getRevenueByDateRange(startDate: Date, endDate: Date): Promise<number[]> {
        const dailyRevenue = await MerchantTransactions.aggregate([
            {
                $match: {
                    transactionDate: { $gte: startDate, $lte: endDate },
                    transactionType: 'CREDIT',
                    status: 'COMPLETED'
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$transactionDate" } },
                    dailyTotal: { $sum: "$amount" }
                }
            },
            { $sort: { "_id": 1 } }  // Sort by date in ascending order
        ]);

        // Generate an array of revenues, fill missing dates with 0
        const revenueArray: number[] = [];
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const dateStr = currentDate.toISOString().split('T')[0];
            const dayData = dailyRevenue.find(day => day._id === dateStr);
            revenueArray.push(dayData ? dayData.dailyTotal : 0);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return revenueArray;
    }

    // Method to get revenue data for this week, last week, this month, and last month
    async getRevenueBreakdown(): Promise<number[][]> {
        const now = new Date();

        // This week (daily)
        const startOfThisWeek = startOfWeek(now, { weekStartsOn: 1 });
        const endOfThisWeek = endOfWeek(now, { weekStartsOn: 1 });
        const thisWeekRevenue = await this.getRevenueByDateRange(startOfThisWeek, endOfThisWeek);

        // Last week (daily)
        const startOfLastWeek = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
        const endOfLastWeek = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
        const lastWeekRevenue = await this.getRevenueByDateRange(startOfLastWeek, endOfLastWeek);

        // This month (weekly)
        const startOfThisMonth = startOfMonth(now);
        const endOfThisMonth = endOfMonth(now);
        const thisMonthRevenue = await this.getWeeklyRevenueBreakdown(startOfThisMonth, endOfThisMonth);

        // Last month (weekly)
        const startOfLastMonth = startOfMonth(subMonths(now, 1));
        const endOfLastMonth = endOfMonth(subMonths(now, 1));
        const lastMonthRevenue = await this.getWeeklyRevenueBreakdown(startOfLastMonth, endOfLastMonth);

        return [thisWeekRevenue, lastWeekRevenue, thisMonthRevenue, lastMonthRevenue];
    }

    // Helper method to get weekly revenue breakdown for a month
    private async getWeeklyRevenueBreakdown(startDate: Date, endDate: Date): Promise<number[]> {
        const weeklyRevenue = await MerchantTransactions.aggregate([
            {
                $match: {
                    transactionDate: { $gte: startDate, $lte: endDate },
                    transactionType: 'CREDIT',
                    status: 'COMPLETED'
                }
            },
            {
                $group: {
                    _id: { week: { $week: "$transactionDate" }, year: { $year: "$transactionDate" } },
                    weeklyTotal: { $sum: "$amount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.week": 1 } }  // Sort by year and week in ascending order
        ]);

        // Generate weekly revenue for the month, padding with 0 if any week is missing
        const revenueArray: number[] = [];
        const startOfWeekInMonth = new Date(startDate);
        while (startOfWeekInMonth <= endDate) {
            const weekData = weeklyRevenue.find(week => {
                const startOfWeekDate = startOfWeek(new Date(week._id.year, 0, (week._id.week - 1) * 7 + 1));
                return startOfWeekDate.getTime() === startOfWeekInMonth.getTime();
            });
            revenueArray.push(weekData ? weekData.weeklyTotal : 0);
            startOfWeekInMonth.setDate(startOfWeekInMonth.getDate() + 7);
        }
        return revenueArray;
    }
}

export default MerchantRepository;
