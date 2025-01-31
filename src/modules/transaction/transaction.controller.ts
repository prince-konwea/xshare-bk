import { Controller, Post, Body, Param, NotFoundException, Get, Patch, BadRequestException, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/transaction.dto';
import { WithdrawDto } from './dto/withdraw.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  // Create a new deposit
  @Post('deposit/:userId')
  async createDeposit(
    @Param('userId') userId: string,  // Extracting userId from URL params
    @Body() createTransactionDto: CreateTransactionDto,  // Extracting transaction data from the body
  ) {
    try {
      const result = await this.transactionService.createDeposit(createTransactionDto, userId);
      return result;
    } catch (error) {
    
      throw new NotFoundException(error.message || 'Transaction creation failed');
    }
  }

  @Get(':userId')
  async getUserTransactions(
    @Param('userId') userId: string,
    @Query('type') type?: string, 
  ) {
    return this.transactionService.getTransactionsByUserId(userId, type);
  }

  @Post('withdraw/:userId')
  async createWithdraw(
    @Param('userId') userId: string,
    @Body() withdrawDto: WithdrawDto,
  ) {
    try {
      return await this.transactionService.createWithdraw(withdrawDto, userId);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error.message || 'Withdrawal request failed');
    }
  }


  @Patch('approve/:id')
  async approveTransaction(@Param('id') transactionId: string) {
    return this.transactionService.approveTransaction(transactionId);
  }
}
