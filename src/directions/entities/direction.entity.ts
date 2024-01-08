import {
  Column,
  Model,
  DataType,
  Table,
  BelongsTo,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity';
import { Order } from 'src/orders/entities/order.entity';
@Table({
  tableName: 'Directions',
  timestamps: true,
  underscored: true,
  paranoid: true,
})
export class Direction extends Model<Direction> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  codigoPostal: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  ciudad: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  estado: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  calle: string;

  @HasMany(() => Order)
  orders: Order[];

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
  })
  userId: string;

  @BelongsTo(() => User)
  user: User;
}
