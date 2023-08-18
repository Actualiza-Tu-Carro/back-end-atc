import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Direction } from '../directions/entities/direction.entity';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { ShoppingCart } from 'src/shopping-cart/entities/shopping-cart.entity';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    SequelizeModule.forFeature([User, Direction, ShoppingCart]),
  ],
  providers: [UsersService, AuthService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule { }
