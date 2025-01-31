import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { Transaction, TransactionSchema } from './models/transaction.model';
import { UserModule } from '../user/user.module'; // Import UserModule

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema }, // Only Transaction here
    ]),
    UserModule, // Access UserModel via UserModule
  ],
  providers: [TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}