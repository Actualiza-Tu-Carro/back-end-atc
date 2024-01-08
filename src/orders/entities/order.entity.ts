import {
  AllowNull,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Product } from '../../products/entities/product.entity';
import { OrderProduct } from './orderProduct.entity';
import { User } from '../../users/entities/user.entity';
import { Direction } from 'src/directions/entities/direction.entity';

export enum OrderStateEnum {
  APROBADO = 'APROBADO',
  PAGO = 'PAGO',
  RECHAZADO = 'RECHAZADO',
  DESPACHO = 'EN DESPACHO',
  PENDIENTE = 'EN PROCESO',
  ENTREGADO = 'ENTREGADO',
  CANCELADO = 'CANCELADO',
}

@Table({
  tableName: 'Order',
  timestamps: true,
  underscored: true,
})
export class Order extends Model<Order> {
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
  })
  total: number;

  @Column({
    type: DataType.ENUM(...Object.values(OrderStateEnum)),
    allowNull: false,
    defaultValue: OrderStateEnum.PENDIENTE,
  })
  state: OrderStateEnum;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  comment?: string;

  @BelongsToMany(() => Product, () => OrderProduct)
  products: Product[];

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId: string;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Direction)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  directionId: string;

  @BelongsTo(() => Direction)
  direction: Direction;
}
