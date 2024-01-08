import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateOrderDto {
  @IsUUID('4', { message: 'Se debe proporcionar el Id del usuario' })
  @IsNotEmpty({ message: 'El campo $property no debe estar vacio' })
  userId: string;

  @IsUUID('4', {
    message: 'Recuerda mandar el Id de la direccion seleccionada',
  })
  @IsNotEmpty({ message: 'El campo $property no debe estar vacio' })
  directionId: string;
}
