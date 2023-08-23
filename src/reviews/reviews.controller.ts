import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ActivateReviewDto } from './dto/activate-review.dto';
import { 
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiFoundResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guarg';
import { GetUser } from 'src/auth/auth-user.decorator';
import { UserChangePasswordDto } from 'src/auth/dto/user-change-password.dto';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  //El id viene por parámetro solo en la versión de desarroll. Ccuando se agreguen los guards
  // No será necesario un parámetro, así que no le hagas docu al id, Ok?
  @UseGuards(JwtAuthGuard)
  @Post()

  @ApiOperation({ summary: 'Crea una nueva reseña' })
  //Posibles respuestas--------------------------------------------------------------------
  @ApiNotFoundResponse({ description:'Sucede cuando el usuario no existe' })
  @ApiCreatedResponse({ description:'Se creó la reseña de forma exitosa' })
  @ApiBadRequestResponse({ description:'No se pudo crear la reseña, se sugiere revisar la información del body' })
  @ApiInternalServerErrorResponse({ description: 'Algo salió mal en el servidor, se sugiere revisar que el usuario en cuestión no tenga un review creado aún' })
  //Para la docu del dto--------------------------------------------------------------------
  @ApiBody({ type: CreateReviewDto })
  //Controller------------------------------------------------------------------------------
  @ApiBearerAuth('Bearer')
  create(@GetUser() user:UserChangePasswordDto, @Body() createReviewDto: CreateReviewDto) {
    //Se extrae el id del objeto req.user que nos retorna el decorador @GetUser
    const { userId } = user;
    return this.reviewsService.create(userId, createReviewDto);
  }

  @Get()
  @ApiOperation({ summary:'Obtiene todos los reviews no borrados(borrado lógico)' })
  //Posibles respuestas---------------------------------------------------------
  @ApiFoundResponse({ description: 'Cuando todo salga bien obtendrás este statusCode junto con todos los reviews' })
  @ApiNotFoundResponse({ description: 'Por si no hay reseñas activas en este momento' })
  @ApiInternalServerErrorResponse({ description: 'Hubo un problema en el servidor' })
  //Controller------------------------------------------------------------------
  findAll() {
    return this.reviewsService.findAll();
  }

  @Patch('update')
  @ApiBody({ type: UpdateReviewDto })
  @ApiOperation({ summary:'Actualiza un review' })
  //Posibles respuestas--------------------------------------------------------
  @ApiOkResponse({ description: 'Si todo sale bien, obtendrás la review editada con los nuevos datos' })
  @ApiNotFoundResponse({ description:'Cuando no existe la reseña que se está editando' })
  @ApiInternalServerErrorResponse({ description: 'Hubo un error en el servidor al momento de actualizar la review. Revisa una vez más los datos enviados' })
  //Controller-----------------------------------------------------------------
  update(@Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(updateReviewDto);
  }

  @Patch('activate')
  //Para los docs del dto------------------------------------------------------
  @ApiBody({ type: ActivateReviewDto })
  @ApiOperation({ summary:'Activa o desactiva un review(borrado lógico)' })
  //Posibles respuestas--------------------------------------------------------
  @ApiInternalServerErrorResponse({ description:'Hubo un error al momento de actualizar la reseña' })
  @ApiOkResponse({ description: 'Si todo sale bien, obtendrás el número de reviews actualizadas' })
  remove(@Body() activateReview: ActivateReviewDto) {
    return this.reviewsService.removeOrActivate(activateReview); 
  }
}
