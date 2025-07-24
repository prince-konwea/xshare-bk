import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction, TransactionStatus, } from './models/transaction.model';
import { CreateTransactionDto, TransactionType, } from './dto/transaction.dto';
import { User } from '../user/models/user.model';
import { WithdrawDto } from './dto/withdraw.dto';
@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    @InjectModel(User.name) private userModel: Model<User>, // Injecting the User model to find users
  ) {}

  async createDeposit(createTransactionDto: CreateTransactionDto, userId: string) {
    // Find user by userId
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    // Validate minimum deposit amount
    if (createTransactionDto.amount < 100) {
      throw new BadRequestException('Minimum deposit amount is $100');
    }
  
    // Create transaction with 'pending' status by default
    const transaction = new this.transactionModel({
      userId: user._id,
      amount: createTransactionDto.amount,
      depositMethod: createTransactionDto.depositMethod,
      status: TransactionStatus.PENDING,
      type: TransactionType.DEPOSIT,
    });
  
    // Save transaction to the database
    await transaction.save();
  
    return {
      success: true,
      message: 'Deposit created successfully',
      data: transaction,
    };
  }
  
  // Additional methods for approving/rejecting transactions can be added here

  async getTransactionsByUserId(userId: string, type?: string) {
    // Construct the query to include the userId and optionally filter by type
    const query: any = { userId };
    
    if (type) {
      query.type = type.toUpperCase(); // Ensure type is in uppercase to match the DB value
    }
  
    const transactions = await this.transactionModel.find(query);
    
    if (!transactions.length) {
      throw new NotFoundException('No transactions found for this user');
    }
    
    return {
      success: true,
      message: 'Transactions retrieved successfully',
      data: transactions,
    };
  }
  

  async getAllTransactions() {
    const transactions = await this.transactionModel.find();
  
    if (!transactions.length) {
      throw new NotFoundException('No transactions found');
    }
  
    return {
      success: true,
      message: 'All transactions retrieved successfully',
      data: transactions,
    };
  }
  


  async createWithdraw(withdrawDto: WithdrawDto, userId: string) {
  const user = await this.userModel.findById(userId);
  if (!user) {
    throw new NotFoundException('User not found');
  }

  // Ensure balances are numbers
  const balance = Number(user.balance) || 0;
  const profitBalance = Number(user.profitBalance) || 0;
  const totalAvailable = balance + profitBalance;

  // Validate withdrawal amount
  if (withdrawDto.amount < 100) {
    throw new BadRequestException('Minimum withdrawal amount is $100');
  }

  if (withdrawDto.amount > totalAvailable) {
    throw new BadRequestException('Insufficient funds for withdrawal');
  }

  // Remove deduction logic from createWithdraw. Only validate funds and method fields

  // Validate method-specific fields
  const { withdrawMethod } = withdrawDto;
  switch (withdrawMethod) {
    case 'Bank Transfer':
      if (!withdrawDto.bankRouting || !withdrawDto.bankAccount) {
        throw new BadRequestException('Bank routing and account numbers are required');
      }
      break;
    case 'PayPal':
      if (!withdrawDto.paypalEmail) {
        throw new BadRequestException('PayPal email is required');
      }
      break;
    case 'BTC':
    case 'ETH':
    case 'USDT':
      if (!withdrawDto.walletAddress) {
        throw new BadRequestException('Wallet address is required');
      }
      break;
    default:
      throw new BadRequestException('Invalid withdrawal method');
  }

  // Create withdrawal transaction
  const withdrawalData = {
    userId: user._id,
    amount: withdrawDto.amount,
    type: TransactionType.WITHDRAWAL,
    status: TransactionStatus.PENDING,
    method: withdrawDto.withdrawMethod,
    details: {
      ...(withdrawDto.walletAddress && { walletAddress: withdrawDto.walletAddress }),
      ...(withdrawDto.bankRouting && { bankRouting: withdrawDto.bankRouting }),
      ...(withdrawDto.bankAccount && { bankAccount: withdrawDto.bankAccount }),
      ...(withdrawDto.paypalEmail && { paypalEmail: withdrawDto.paypalEmail }),
    },
  };

  const transaction = new this.transactionModel(withdrawalData);
  await transaction.save();

  return {
    success: true,
    message: 'Withdrawal request submitted for processing',
    data: transaction,
  };
}


  
  // Updated approveTransaction to handle withdrawals
async approveTransaction(transactionId: string) {
  const transaction = await this.transactionModel.findById(transactionId);
  if (!transaction) {
    throw new NotFoundException('Transaction not found');
  }

  if (transaction.status !== TransactionStatus.PENDING) {
    throw new BadRequestException('Only pending transactions can be approved');
  }

  const user = await this.userModel.findById(transaction.userId);
  if (!user) {
    throw new NotFoundException('User not found');
  }

  // Handle balance update based on transaction type
  if (transaction.type === TransactionType.DEPOSIT) {
    user.balance += transaction.amount;
  } 
  // No deduction needed for withdrawal since already handled during createWithdraw
  // But optionally, verify that user still has enough balance to have covered it
  else if (transaction.type === TransactionType.WITHDRAWAL) {
    const totalBefore = user.balance + user.profitBalance;
    const totalAfter = totalBefore + transaction.amount;

    if (totalAfter < 0) {
      throw new BadRequestException('Inconsistent state: negative total balance after withdrawal');
    }

    // Optional: Log if current total is unexpectedly high (means balance wasn't deducted earlier)
    const expectedTotal = user.balance + user.profitBalance + transaction.amount;
    if (expectedTotal === totalAfter) {
      console.warn(`Warning: Withdrawal might not have been deducted at creation. Consider adjusting balance now.`);
    }
  }

  transaction.status = TransactionStatus.APPROVED;
  await transaction.save();
  await user.save();

  return {
    success: true,
    message: `Transaction approved successfully.`,
    data: {
      transaction,
      updatedBalance: user.balance,
      updatedProfitBalance: user.profitBalance,
    }
  };
}


  async cancelTransaction(transactionId: string) {
    const transaction = await this.transactionModel.findById(transactionId);
    
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
  
    if (transaction.status !== TransactionStatus.PENDING) {
      throw new BadRequestException('Only pending transactions can be cancelled');
    }
  
    transaction.status = TransactionStatus.REJECTED;
    await transaction.save();
  
    return {
      success: true,
      message: 'Transaction cancelled successfully',
      data: transaction,
    };
  }
  
}
