import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getDatabaseConfig } from '../../config/database.config';
import { Order } from './entities/order.entity';
import { OrderRepository } from './repository/order.repository';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        await getDatabaseConfig(configService),
    }),
    TypeOrmModule.forFeature([Order]),
  ],
  providers: [OrderRepository],
  exports: [TypeOrmModule, OrderRepository],
})
export class DatabaseModule {}
