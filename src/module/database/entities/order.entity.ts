import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { OrderType } from 'src/common/order-type';
import { OrderSide } from 'src/common/order-side';
import { OrderStatus } from 'src/common/order-status';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  orderId: string;

  @Column()
  tokenA: string;

  @Column()
  tokenB: string;

  @Column({
    type: 'enum',
    enum: OrderType,
  })
  orderType: OrderType;

  @Column({
    type: 'enum',
    enum: OrderSide,
  })
  side: OrderSide;

  @Column('decimal', { precision: 18, scale: 8 })
  amount: number;

  @Column('decimal', { precision: 18, scale: 8, nullable: true })
  executionPrice?: number;

  @Column('decimal', { precision: 18, scale: 8, default: 0 })
  filled: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.ACTIVE,
  })
  status: OrderStatus;

  @Column('decimal', { precision: 18, scale: 8, default: 0 })
  fee: number;

  @Column('decimal', { precision: 18, scale: 8, default: 0 })
  feeRate: number;

  @Column('decimal', { precision: 18, scale: 8, default: 0 })
  amountLeftToFill: number;

  @Column({ default: false })
  cancellable: boolean;

  @Column()
  user: string;

  @Column('simple-array', { nullable: true })
  matchedOrderIds: number[];
}
