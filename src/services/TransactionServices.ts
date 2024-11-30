import { Service } from "typedi";
import axios from "axios";
import TransactionRepository from "../repositories/TransactionRepository";
import { ITransaction } from "../models/transaction";
require("dotenv").config()

@Service()
export class TransactionService {
  private paystackApiUrl = "https://api.paystack.co";
  private paystackSecretKey = process.env.PAYSTACK_SECRET_KEY

  constructor(private readonly transactionRepository: TransactionRepository) {}

  // Payment Initialization
  async initializePayment(
    amount: number,
    userId: string,
    merchantId: string,
    refillId: string
  ): Promise<any> {
    const reference = `ref_${Date.now()}`;
    const transaction = await this.transactionRepository.create({
      user: userId,
      merchant: merchantId,
      amount,
      reference,
      status: "pending",
    });

    console.log(transaction);

    const response = await axios.post(
      `${this.paystackApiUrl}/transaction/initialize`,
      {
        amount: amount * 100,
        email: "user@example.com", // Replace with dynamic email if available
        reference,
        metadata: { refillId, userId },
      },
      {
        headers: {
          Authorization: `Bearer ${this.paystackSecretKey}`,
        },
      }
    );

    return { paymentUrl: response.data.data.authorization_url, reference };
  }

  // Payment Verification
  async verifyPayment(reference: string): Promise<ITransaction> {
    const transaction = await this.transactionRepository.findTransactionByReference(reference);
    if (!transaction) throw new Error("Transaction not found");

    const response = await axios.get(
      `${this.paystackApiUrl}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${this.paystackSecretKey}`,
        },
      }
    );

    const status = response.data.data.status === "success" ? "success" : "failed";
    transaction.status = status;
    await transaction.save();

    return transaction;
  }

  // Calculate Merchant Revenue
  async getMerchantRevenue(merchantId: string): Promise<number> {
    return await this.transactionRepository.calculateMerchantRevenue(merchantId);
  }

  // Calculate Rider Revenue
  async getRiderRevenue(riderId: string): Promise<number> {
    return await this.transactionRepository.calculateRiderRevenue(riderId);
  }

  // Get User Transactions
  async getUserTransactions(userId: string): Promise<ITransaction[]> {
    return await this.transactionRepository.findUserTransactions(userId);
  }

  // Create Transfer Recipient
  async createTransferRecipient(
    name: string,
    accountNumber: string,
    bankCode: string
  ): Promise<any> {
    try {
      const response = await axios.post(
        `${this.paystackApiUrl}/transferrecipient`,
        {
          type: "nuban",
          name,
          account_number: accountNumber,
          bank_code:bankCode,
          currency: "NGN",
        },
        {
          headers: {
            Authorization: `Bearer ${this.paystackSecretKey}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data)
      return response.data;
    } catch (error: any) {
      console.log(error.response.data)
      console.error("Error creating transfer recipient:", error.response?.data || error.message);
      throw error;
    }
  }

  // Initiate Transfer
  async initiateTransfer(
    amount: number,
    recipientCode: string,
    reason: string
  ): Promise<any> {
    try {
      const response = await axios.post(
        `${this.paystackApiUrl}/transfer`,
        {
          source: "balance",
          amount: amount * 100, // Convert to kobo
          recipient: recipientCode,
          reason,
        },
        {
          headers: {
            Authorization: `Bearer ${this.paystackSecretKey}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.log(error)
      console.error("Error initiating transfer:", error.response?.data || error.message);
      throw error;
    }
  }
}
