import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export enum WithdrawMethod {
  BANK_TRANSFER = 'Bank Transfer',
  PAYPAL = 'PayPal',
  BTC = 'BTC',
  ETH = 'ETH',
  USDT = 'USDT',
}

export class WithdrawDto {
  @IsNumber()
  @Min(100, { message: 'Minimum withdrawal amount is $100' })
  amount: number;

  @IsEnum(WithdrawMethod, { message: 'Invalid withdrawal method' })
  withdrawMethod: WithdrawMethod;

  @IsOptional()
  @IsString({ message: 'Bank routing must be a string' })
  bankRouting?: string;

  @IsOptional()
  @IsString({ message: 'Bank account must be a string' })
  bankAccount?: string;

  @IsOptional()
  @IsString({ message: 'PayPal email must be a valid string' })
  paypalEmail?: string;

  @IsOptional()
  @IsString({ message: 'Wallet address must be a string' })
  walletAddress?: string;
}
