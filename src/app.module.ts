import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './modules/products/products.module';

console.log(process.env.MONGO_URI)
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI), 
   
    UserModule, TransactionModule, ProductsModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
