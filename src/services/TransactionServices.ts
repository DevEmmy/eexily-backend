import { Service } from "typedi";
import axios from "axios";
import TransactionRepository from "../repositories/TransactionRepository";
import { ITransaction } from "../models/transaction";

@Service()
export class TransactionService {
  private paystackApiUrl = "https://api.paystack.co";
  private paystackSecretKey = "sk_test_de08c04eb8b47c95d24fc8383fdcae573dbdb996";

  constructor(private readonly transactionRepository: TransactionRepository) {}

  async initializePayment(amount: number, userId: string, merchantId: string): Promise<any> {
    const reference = `ref_${Date.now()}`;
    const transaction = await this.transactionRepository.create({
      user: userId,
      merchant: merchantId,
      amount,
      reference,
      status: "pending"
    });
console.log(transaction)
    const response = await axios.post(
      `${this.paystackApiUrl}/transaction/initialize`,
      { amount: amount * 100, email: "user@example.com", reference },
      { headers: { Authorization: `Bearer ${this.paystackSecretKey}` } }
    );

    return { paymentUrl: response.data.data.authorization_url, reference };
  }

  async verifyPayment(reference: string): Promise<ITransaction> {
    const transaction = await this.transactionRepository.findTransactionByReference(reference);
    if (!transaction) throw new Error("Transaction not found");

    const response = await axios.get(
      `${this.paystackApiUrl}/transaction/verify/${reference}`,
      { headers: { Authorization: `Bearer ${this.paystackSecretKey}` } }
    );

    const status = response.data.data.status === "success" ? "success" : "failed";
    transaction.status = status;
    await transaction.save();

    return transaction;
  }

  async getMerchantRevenue(merchantId: string): Promise<number> {
    return await this.transactionRepository.calculateMerchantRevenue(merchantId);
  }

  async getRiderRevenue(riderId: string): Promise<number> {
    return await this.transactionRepository.calculateRiderRevenue(riderId);
  }

  async getUserTransactions(userId: string): Promise<ITransaction[]> {
    return await this.transactionRepository.findUserTransactions(userId);
  }
}
