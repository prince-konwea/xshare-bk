import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { WithdrawMethod } from './withdraw.dto';






export enum DepositMethod {
  BTC = 'BTC',
  ETH = 'ETH',
  USDT = 'USDT',
}

export class CreateTransactionDto {
  @IsNumber()
  @Min(100, { message: 'Minimum deposit amount is $100' })
  amount: number;

  @IsEnum(DepositMethod, { message: 'Invalid deposit method' })
  depositMethod: DepositMethod;
}





export enum TransactionType {
  WITHDRAWAL = 'WITHDRAWAL',
  DEPOSIT = "DEPOSIT"
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export class TransactionDto {
  userId: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  method: WithdrawMethod;
  details: {
    walletAddress?: string;
    bankRouting?: string;
    bankAccount?: string;
    paypalEmail?: string;
  };
}

