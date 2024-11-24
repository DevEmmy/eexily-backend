import { Service } from "typedi";
import { Request, Response } from "express";
import { TransactionService } from "../services/TransactionServices";

@Service()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  async initializePayment(req: Request, res: Response): Promise<void> {
    // const { amount, merchantId } = req.body;
    // const userId = req.body.user;

    // const result = await this.transactionService.initializePayment(amount, userId, merchantId);
    // res.status(200).json(result);
    res.json("hey")
  }

  async verifyPayment(req: Request, res: Response): Promise<void> {
    const { reference } = req.query;

    const transaction = await this.transactionService.verifyPayment(reference as string);
    res.status(200).json(transaction);
  }

  async getMerchantRevenue(req: Request, res: Response): Promise<void> {
    const { merchantId } = req.params;

    const revenue = await this.transactionService.getMerchantRevenue(merchantId);
    res.status(200).json({ revenue });
  }

  async getUserTransactions(req: Request, res: Response): Promise<void> {
    const userId = req.body.user;

    const transactions = await this.transactionService.getUserTransactions(userId);
    res.status(200).json(transactions);
  }
}
