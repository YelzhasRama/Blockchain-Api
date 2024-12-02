import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { OrderStatus } from 'src/common/order-status';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const order = this.orderRepository.create(orderData);
    return this.orderRepository.save(order);
  }

  async getOrderById(orderId: number): Promise<Order | undefined> {
    return this.orderRepository.findOne({ where: { id: orderId } });
  }

  async getOrderByOrderId(orderId: string): Promise<Order | undefined> {
    return this.orderRepository.findOne({ where: { orderId } });
  }

  async getAllOrders(): Promise<Order[]> {
    return this.orderRepository.find();
  }

  async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
    return this.orderRepository.find({ where: { status } });
  }

  async updateOrder(
    orderId: number,
    updateData: Partial<Order>,
  ): Promise<Order> {
    await this.orderRepository.update(orderId, updateData);
    return this.getOrderById(orderId);
  }

  async save(order: Order): Promise<Order> {
    return this.orderRepository.save(order);
  }

  async deleteOrder(orderId: number): Promise<void> {
    await this.orderRepository.delete(orderId);
  }

  async deleteOrderByOrderId(orderId: string): Promise<void> {
    await this.orderRepository.delete({ orderId });
  }
}
