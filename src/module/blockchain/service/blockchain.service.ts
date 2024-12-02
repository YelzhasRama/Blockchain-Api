import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../database/entities/order.entity';

@Injectable()
export class BlockchainService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async getOrders(
    tokenA?: string,
    tokenB?: string,
    user?: string,
    active: boolean = false,
  ) {
    const queryBuilder = this.orderRepository.createQueryBuilder('order');

    if (tokenA) {
      queryBuilder.andWhere('order.tokenA = :tokenA', { tokenA });
    }

    if (tokenB) {
      queryBuilder.andWhere('order.tokenB = :tokenB', { tokenB });
    }

    if (user) {
      queryBuilder.andWhere('order.userId = :user', { user });
    }

    if (active) {
      queryBuilder.andWhere('order.status = :status', { status: 'ACTIVE' });
    }

    return queryBuilder.getMany();
  }

  async getMatchingOrders(
    tokenA: string,
    tokenB: string,
    amountA: number,
    amountB: number,
  ) {
    const queryBuilder = this.orderRepository.createQueryBuilder('order');

    queryBuilder.andWhere('order.tokenA = :tokenA', { tokenA });
    queryBuilder.andWhere('order.tokenB = :tokenB', { tokenB });
    queryBuilder.andWhere('order.filled < order.amount');

    if (amountA > 0) {
      queryBuilder.andWhere('order.amount >= :amountA', { amountA });
    }

    if (amountB > 0) {
      queryBuilder.andWhere('order.amount >= :amountB', { amountB });
    }

    return queryBuilder.getMany();
  }
}
