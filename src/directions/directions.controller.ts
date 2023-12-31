import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DirectionsService } from './directions.service';
import { CreateDireetionDto } from './dto/create-direetion.dto';
import { UpdateDireetionDto } from './dto/update-direetion.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { IDirections, IResDirection } from './interfaces/direction.interface';
import { IResponse } from 'src/utils/interfaces/response.interface';

@ApiTags('Directions')
@Controller('directions')
export class DireetionsController {
  constructor(private readonly directionsService: DirectionsService) {}

  @ApiOperation({ summary: 'Crear una nueva dirección' })
  @ApiBody({ type: CreateDireetionDto })
  @ApiResponse({
    status: 201,
    description: 'La dirección ha sido creada exitosamente',
  })
  @ApiResponse({ status: 400, description: 'Solicitud inválida' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @Post()
  async create(
    @Body() createDireetionDto: CreateDireetionDto,
  ): Promise<IResDirection> {
    const response = await this.directionsService.create(createDireetionDto);
    return response;
  }

  @ApiOperation({ summary: 'Obtener direcciones' })
  @ApiResponse({
    status: 200,
    description: 'Direcciones obtenidas',
  })
  @ApiResponse({ status: 404, description: 'Direcciones no encontradas' })
  @ApiResponse({ status: 500, description: 'Error del servidor' })
  @ApiParam({
    name: 'id',
    description: 'id del usuario del que obtengo las direcciones',
    type: 'string',
  })
  @Get(':id')
  async findAll(@Param('id') id: string): Promise<IDirections> {
    const response = await this.directionsService.findAll(id);
    return response;
  }

  @ApiOperation({ summary: 'Obtener dirección por id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.directionsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Modificar una direccion' })
  @ApiBody({ type: UpdateDireetionDto })
  @ApiResponse({
    status: 200,
    description: 'La dirección ha sido modificada exitosamente',
  })
  @ApiResponse({ status: 400, description: 'Solicitud inválida' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @ApiParam({
    name: 'id',
    description: 'id de la dirección a modificar',
    type: 'string',
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDireetionDto: UpdateDireetionDto,
  ): Promise<IResDirection> {
    const response = await this.directionsService.update(
      id,
      updateDireetionDto,
    );
    return response;
  }

  @ApiOperation({ summary: 'Eliminar una direccion' })
  @ApiResponse({
    status: 204,
    description: 'Direccion eliminada exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Direccion no encontrada' })
  @ApiResponse({ status: 500, description: 'Error del servidor' })
  @ApiParam({
    name: 'id',
    description: 'id de la dirección a eliminar',
    type: 'string',
  })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<IResponse> {
    const response = await this.directionsService.remove(id);
    return response;
  }
}
