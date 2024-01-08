import { Module, forwardRef } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { UsersModule } from 'src/users/users.module';
import { MailService } from 'src/mail/mail.service';
import { OrdersModule } from 'src/orders/orders.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Payment } from './entities/payment.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([Payment]),
    forwardRef(() => UsersModule),
    forwardRef(() => OrdersModule),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, MailService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
