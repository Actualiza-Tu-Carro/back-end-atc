import {
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsEnum,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StateProduct } from '../entities/product.entity';

export enum OrderType {
  nameAsc = 'NOMBRE ASC',
  nameDesc = 'NOMBRE DESC',
  priceAsc = 'PRECIO ASC',
  priceDesc = 'PRECIO DESC',
}

export class QueryProductsDto {
  @IsNotEmpty({ message: 'El límite no puede estar vacío' })
  @IsString({
    message:
      'El límite debe ser string que sea un número entero pasado por query',
  })
  @ApiProperty({ description: 'Límite de resultados' })
  limit: string;

  @IsNotEmpty({ message: 'La página no puede estar vacía' })
  @IsString({
    message:
      'La página debe ser un string que sea un número entero pasado por query',
  })
  @ApiProperty({ description: 'Página de resultados' })
  page: string;

  @IsOptional()
  @IsEnum(OrderType, { message: 'Tipo de orden inválido' })
  @ApiProperty({ description: 'Tipo de orden', enum: OrderType })
  order?: OrderType;

  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @ApiProperty({ description: 'Nombre' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'El ID de categoría debe ser una cadena de texto' })
  @IsUUID('4', { message: '$property debe ser un Id' })
  @ApiProperty({ description: 'ID de categoría' })
  categoryId?: string;

  @IsOptional()
  @IsUUID('4', { message: '$property debe ser un Id' })
  @IsString({ message: 'El ID de marca debe ser una cadena de texto' })
  @ApiProperty({ description: 'ID de marca' })
  brandId?: string;

  @IsOptional()
  @IsEnum(StateProduct, { message: 'Estado de producto inválido' })
  @ApiProperty({ description: 'Estado de producto', enum: StateProduct })
  active?: StateProduct;
}
