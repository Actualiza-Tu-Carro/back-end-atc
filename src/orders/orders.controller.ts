import {
  Controller,
  Get,
  Post,
  Param,
  Patch,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { IGetOrders, IOrder } from './interfaces/response-order.interface';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guarg';
import { GetUser } from 'src/auth/auth-user.decorator';
import { UserChangePasswordDto } from 'src/auth/dto/user-change-password.dto';
import { GetAllOrdersDto } from './dto/getAllOrders.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  //Obtener una orden por id
  @ApiOperation({ summary: 'Obtener orden' })
  @ApiResponse({
    status: 200,
    description: 'Orden obtenida',
  })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  @ApiResponse({ status: 500, description: 'Error del servidor' })
  @ApiParam({
    name: 'id',
    description: 'id de la orden que busco',
    type: 'string',
  })
  @Get(':id')
  async findOneOrder(@Param('id') id: string): Promise<IOrder> {
    const response = await this.ordersService.findOneOrder(id);
    return response;
  }

  //Obtener órdenes por usuario
  @Get('user-orders/:id')
  async findAlByUser(@Param('id') id: string): Promise<IOrder> {
    const response = await this.ordersService.findAllByUser(id);
    return response;
  }

  @ApiOperation({
    summary: 'Crear orden',
    description: 'Es necesario tener un producto en el carrito.',
  })
  
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@GetUser() user: UserChangePasswordDto) {
    const { userId } = user;
    const response = await this.ordersService.create(userId);

    return response;
  }

  @Get()
  async getAllOrders(
    @Query() getAllOrders: GetAllOrdersDto,
  ): Promise<IGetOrders> {
    const response = await this.ordersService.findAll(getAllOrders);
    return response;
  }

  //Actualizar el estado de una orden
  @Patch()
  async patchUpdateStateOrder(@Body() updateDto: UpdateOrderDto) {
    const response = await this.ordersService.updateStateOrder(updateDto);
    return response;
  }
}
