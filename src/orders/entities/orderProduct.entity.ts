import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';

@Table({})
export class OrderProduct extends Model<OrderProduct> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
  amount: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  price: number;

  @ForeignKey(() => Order)
  @Column({
    type: DataType.UUIDV4,
    allowNull: false,
  })
  orderId: string;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.UUIDV4,
    allowNull: false,
  })
  productId: string;
}
