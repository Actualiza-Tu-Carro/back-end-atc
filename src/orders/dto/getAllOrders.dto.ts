import {
  ArrayContains,
  ArrayMaxSize,
  ArrayMinSize,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsPositive,
} from 'class-validator';
import { OrderStateEnum } from '../entities/order.entity';

export enum DateOrder {
  Latest = 'created_at DESC',
  Oldest = 'created_at ASC',
}

//Pautas para el filtrado de las órdenes
export class GetAllOrdersDto {
  @IsNotEmpty({
    message: '$property no debe estar vacío',
  })
  @IsString({ message: 'la propiedad $property debe ser un numero' })
  //Número de órdenes por página
  limit: string;

  @IsNotEmpty({
    message: '$property no debe estar vacío',
  })
  @IsString({ message: 'la propiedad $property debe ser un numero' })
  //Según el limit, la página de las órdenes
  page: string;

  @IsNotEmpty({
    message: '$property no debe estar vacío',
  })
  @IsString({
    message: 'la propiedad $property debe ser un tipo de estado de las ordenes',
  })
  //El estado actual de la orden
  status: string;

  @IsNotEmpty({
    message: '$property no debe estar vacío',
  })
  @IsString({
    message:
      'la propiedad $property contener "ASC" o "DESC" acorde al tipo de orden que requiera',
  })
  //El orden en el que se envían las órdenes
  order: string;
}
