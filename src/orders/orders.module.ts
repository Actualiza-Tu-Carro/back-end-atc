import { Module, forwardRef } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ShoppingCartModule } from 'src/shopping-cart/shopping-cart.module';
import { PaymentsModule } from 'src/payments/payments.module';
import { UsersModule } from 'src/users/users.module';
import sequelize from 'sequelize';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from './entities/order.entity';
import { OrderProduct } from './entities/orderProduct.entity';

@Module({
  imports: [
    forwardRef(() => ShoppingCartModule),
    forwardRef(() => PaymentsModule),
    forwardRef(() => UsersModule),
    SequelizeModule.forFeature([Order, OrderProduct]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
