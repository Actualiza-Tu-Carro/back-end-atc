import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  Res,
  Query,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { GetUser } from '../auth/auth-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guarg';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // Ruta para crear un pago
  /*  @ApiOperation({
    summary: 'Ruta para realizar pagos.',
  })
  @UseGuards(JwtAuthGuard)
  @Post('create-payment')
  async createPayment(
    @GetUser() { userId }: any,
    @Body() { amount, orderId }: CreatePaymentDto,
    @Res() res: Response,
  ) {
    try {
      const payment = await this.paymentsService.createPayment(
        amount,
        userId,
        orderId,
      );
      // Redirige al usuario a la URL de pago generada por Mercado Pago

      res.send(payment.url);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el pago' });
    }
  } */

  // Ruta para manejar un pago exitoso
  @ApiOperation({
    summary: 'Ruta para manejar un pago exitoso.',
  })
  @Get('success/:orderid')
  async handleSuccessPayment(
    @Param('orderid') orderid: string,
    @Res() res: Response,
  ) {
    await this.paymentsService.actualizePayment('success', orderid);
    res.redirect('https://google.com'); // Insertar ruta a donde queremos que se diriga cuando se realize el pago
  }

  // Ruta para manejar un pago fallido
  @ApiOperation({
    summary: 'Ruta para manejar un pago fallido.',
  })
  @Get('failure/:orderid')
  async handleFailurePayment(
    @Param('orderid') orderid: string,
    @Res() res: Response,
  ) {
    await this.paymentsService.actualizePayment('failure', orderid);
    res.redirect('https://google.com'); // Insertar ruta a donde queremos que se diriga cuando falle el pago
  }

  // Ruta para manejar un pago pendiente
  @ApiOperation({
    summary: 'Ruta para manejar un pago pendiente.',
  })
  @Get('pending/:orderid')
  async handlePendingPayment(
    @Param('orderid') orderid: string,
    @Res() res: Response,
  ) {
    await this.paymentsService.actualizePayment('pending', orderid);
    res.redirect('https://google.com'); // Insertar ruta a donde queremos que se diriga cuando falle el pago
  }

  @Post('webhook/:orderid')
  async notifWebHook(@Query() query, @Param('orderid') orderid: string) {
    if (query.type && query.type == 'payment') {
      const actualizeOrder = await this.paymentsService.actualizeOrder(
        query['data.id'],
        orderid,
      );
      return actualizeOrder;
    }
  }
}
