import Web3 from 'web3';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { abiContract } from '../abi-contract/abi.contract';
import * as process from 'node:process';
import { OrderRepository } from '../../database/repository/order.repository';
import { OrderStatus } from '../../../common/order-status';
import { OrderSide } from '../../../common/order-side';
import { OrderType } from '../../../common/order-type';

@Injectable()
export class BlockchainListenerService implements OnModuleInit {
  private web3: Web3;
  private contract: any;
  private contractAddress = '0x2CbD217895fB88eE3db0F7eC1168a3D8592ecDDa';

  constructor(
    private readonly blockchainService: BlockchainService,
    private readonly orderRepository: OrderRepository,
  ) {
    this.web3 = new Web3(
      new Web3.providers.HttpProvider(
        'https://mainnet.infura.io/v3/' + process.env.INFURA_URL,
      ),
    );

    const abi = abiContract;
    this.contract = new this.web3.eth.Contract(abi, this.contractAddress);
  }

  async onModuleInit() {
    this.listenForEvents();
  }

  async listenForEvents() {
    this.contract.events.OrderCreated({}, async (error, event) => {
      if (error) {
        console.error('Error in OrderCreated event:', error);
      } else {
        await this.handleOrderCreated(event);
      }
    });

    this.contract.events.OrderMatched({}, async (error, event) => {
      if (error) {
        console.error('Error in OrderMatched event:', error);
      } else {
        await this.handleOrderMatched(event);
      }
    });

    this.contract.events.OrderCancelled({}, async (error, event) => {
      if (error) {
        console.error('Error in OrderCancelled event:', error);
      } else {
        await this.handleOrderCancelled(event);
      }
    });
  }

  private async handleOrderCreated(event: any) {
    const { id, amountA, tokenA, tokenB, user, isMarket } = event.returnValues;

    const newOrder = await this.orderRepository.createOrder({
      orderId: id,
      amount: parseFloat(amountA),
      tokenA,
      tokenB,
      user,
      side: isMarket ? OrderSide.BUY : OrderSide.SELL,
      orderType: isMarket ? OrderType.MARKET : OrderType.LIMIT,
      status: OrderStatus.ACTIVE,
      fee: 0,
      cancellable: true,
    });

    console.log('OrderCreated saved:', newOrder);
  }

  private async handleOrderMatched(event: any) {
    const { orderId, amountReceived, amountLeftToFill, fee } =
      event.returnValues;

    const order = await this.orderRepository.getOrderByOrderId(orderId);
    if (order) {
      order.filled = (order.filled || 0) + parseFloat(amountReceived);
      order.amountLeftToFill = parseFloat(amountLeftToFill);
      order.fee = parseFloat(fee);

      if (order.amountLeftToFill === 0) {
        order.status = OrderStatus.ACTIVE;
      }

      await this.orderRepository.save(order);
      console.log('OrderMatched updated:', order);
    }
  }

  private async handleOrderCancelled(event: any) {
    const { orderId } = event.returnValues;

    const order = await this.orderRepository.getOrderByOrderId(orderId);
    if (order) {
      order.status = OrderStatus.ACTIVE;
      await this.orderRepository.save(order);
      console.log('OrderCancelled updated:', order);
    }
  }
}
