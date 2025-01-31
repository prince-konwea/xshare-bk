import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI), 
    UserModule, TransactionModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
