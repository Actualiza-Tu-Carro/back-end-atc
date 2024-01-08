import { Column, DataType, Model, Table } from 'sequelize-typescript';

export enum PaymentState {
  SUCCESS = 'PAGO',
  PENDING = 'PENDIENTE',
  FAILED = 'RECHAZADO',
}

@Table({
  tableName: 'Payments',
  underscored: true,
  timestamps: true,
  createdAt: 'creation_date',
})
export class Payment extends Model<Payment> {
  @Column({
    type: DataType.STRING,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @Column({
    allowNull: false,
  })
  amount: number; // Cantidad de dinero pagada

  @Column({
    allowNull: false,
  })
  orderId: string;

  //Esto podría cambiar después
  @Column({
    allowNull: false,
    defaultValue: PaymentState.PENDING,
  })
  state: PaymentState;

  //Esto puede cambiar después
  @Column({
    allowNull: false,
  })
  user_email: string;
}
