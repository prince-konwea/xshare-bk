import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { TransactionService } from './modules/transaction/transaction.service';
import { TransactionController } from './modules/transaction/transaction.controller';
import { TransactionModule } from './modules/transaction/transaction.module';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/muskdb'), 
    UserModule, TransactionModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
