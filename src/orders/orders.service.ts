import {
  BadRequestException,
  HttpException,
  Inject,
  forwardRef,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Order, OrderStateEnum } from './entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { OrderProduct } from './entities/orderProduct.entity';
import {
  IOrder,
  UpdateStateOrder,
  IGetOrders,
} from './interfaces/response-order.interface';
import { GetAllOrdersDto } from './dto/getAllOrders.dto';
import { Op } from 'sequelize';
import { ShoppingCart } from 'src/shopping-cart/entities/shopping-cart.entity';
import { User } from 'src/users/entities/user.entity';
import { ShoppingCartService } from 'src/shopping-cart/shopping-cart.service';
import { PaymentsService } from 'src/payments/payments.service';
import { UsersService } from 'src/users/users.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { Direction } from 'src/directions/entities/direction.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order)
    private orderModel: typeof Order,
    @InjectModel(OrderProduct)
    private orderProductModel: typeof OrderProduct,
    @Inject(forwardRef(() => ShoppingCartService))
    private shoppingCartService: ShoppingCartService,
    @Inject(forwardRef(() => PaymentsService))
    private paymentsService: PaymentsService,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
    private sequelize: Sequelize,
  ) {}

  async findOneOrder(id: string) {
    try {
      const order = await this.orderModel.findOne({
        where: {
          id: id,
        },
        attributes: ['id', 'total', 'state'],
        include: [
          {
            model: Product,
            attributes: ['id', 'title', 'price', 'image', 'model', 'year'],
            through: {
              attributes: ['amount', 'price'],
            },
          },
          {
            model: Direction,
          },
        ],
      });

      if (order) {
        return {
          statusCode: 200,
          data: order,
        };
      } else {
        throw new NotFoundException('Orden no encontrada');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Orden no encontrada');
      } else {
        throw new InternalServerErrorException('Error del servidor');
      }
    }
  }

  //Obtener todas las órdenes de un usuario en particular
  async findAllByUser(id: string): Promise<IOrder> {
    try {
      const orders = await this.orderModel.findAll({
        where: {
          userId: id,
        },
        attributes: ['id', 'total', 'state'],
        include: [
          {
            model: Product,
            attributes: ['id', 'title', 'price', 'image', 'model', 'year'],
            through: {
              attributes: ['amount', 'price'],
            },
          },
          {
            model: Direction,
          },
        ],
      });

      if (!orders)
        throw new InternalServerErrorException(
          'Algo salió mal al momento de buscar las órdenes. Revisar id enviado',
        );
      if (!orders.length)
        throw new NotFoundException(
          'No se encontraron órdenes asociadas a este usuario',
        );
      return {
        statusCode: 200,
        data: orders,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  //Crear Orden
  async create(data: { userId: string; directionId: string }): Promise<object> {
    const transaction: Transaction = await this.sequelize.transaction();
    try {
      const { userId, directionId } = data;
      //Obtenemos el id del carrito del usuario que realiza la peticion
      const thisUser = await this.userService.findByPkGenericUser(userId, {
        include: [
          {
            model: ShoppingCart,
            attributes: ['id'],
            include: [
              { model: Product, attributes: ['id', 'stock', 'price', 'state'] },
            ],
          },
        ],
        transaction,
      });

      //Aqui obtenemos el monto total y los productos para realizar la orden
      const { total, products } =
        await this.shoppingCartService.getCartProductsForNewOrder(
          { where: { cartId: thisUser.cart.id }, transaction },
          thisUser.cart.products,
        );

      const newOrder = await this.orderModel.create(
        {
          total,
          userId,
          directionId,
        },
        { transaction },
      );

      for (const product of Object(products)) {
        await this.orderProductModel.create(
          {
            amount: product.amount,
            price: product.price,
            orderId: newOrder.id,
            productId: product.id,
          },
          { transaction },
        );
      }
      const urlBuy = await this.paymentsService.createPayment(
        total,
        thisUser,
        newOrder.id,
        transaction,
      );

      await this.shoppingCartService.destroyShoppingCart(
        { userId },
        transaction,
      );

      await this.shoppingCartService.CreateShoppingCart(
        { userId },
        transaction,
      );

      await transaction.commit();
      return {
        statusCode: 201,
        data: `Nueva orden creada exitosamente. _id: ${newOrder.id}`,
        orderId: newOrder.id,
        ...urlBuy,
      };
    } catch (error) {
      transaction.rollback();
      throw new InternalServerErrorException(
        `Ocurrió un error al crear su orden. \n ${error.message}`,
      );
    }
  }

  async updateStateOrder(updateDto: UpdateOrderDto): Promise<UpdateStateOrder> {
    const transaction = await this.sequelize.transaction();
    try {
      const order = await this.orderModel.findByPk(updateDto.idOrder, {
        transaction,
      });
      if (!order) throw new NotFoundException('Orden no encontrada');

      //* Cancelar orden
      //! Falta realizar validacion de rol
      if (order.state === OrderStateEnum.APROBADO)
        throw new ForbiddenException(
          'No se permite cambiar la orden a este estado',
        );

      if (updateDto.OrderStateEnum === OrderStateEnum.CANCELADO) {
        order.state = updateDto.OrderStateEnum;
        order.save({ transaction });
      }

      return {
        statusCode: 200,
        message: 'Orden actualizada',
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findAll(getAllOrdersDto: GetAllOrdersDto): Promise<IGetOrders> {
    try {
      const limit = parseInt(getAllOrdersDto.limit);
      const page = parseInt(getAllOrdersDto.page);

      //Querying
      const { rows: orders, count: totalOrders } =
        await this.orderModel.findAndCountAll({
          limit,
          offset: (page - 1) * limit,
          order: [['created_at', getAllOrdersDto.order]],
          attributes: ['id', 'total', 'state', 'comment'],
          where: {
            state: {
              [Op.or]: getAllOrdersDto.status
                .split(',')
                .map((status) => ({ [Op.eq]: OrderStateEnum[status.trim()] })),
            },
          },
          include: [
            {
              model: Product,
              attributes: ['id', 'title'],
              through: { attributes: ['id', 'price', 'amount'] },
            },
            {
              model: Direction,
              attributes: ['id', 'codigoPostal', 'ciudad', 'estado', 'calle'],
            },
            {
              model: User,
              attributes: ['id', 'email', 'firstName', 'lastName', 'phone'],
            },
          ],
        });

      if (!orders.length)
        throw new NotFoundException(
          'No se encontraron órdenes con los filtros aplicados',
        );

      const totalPages = Math.ceil(totalOrders / Number(limit));

      return {
        statusCode: 200,
        data: { orders, totalOrders, totalPages, page: Number(page) },
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
