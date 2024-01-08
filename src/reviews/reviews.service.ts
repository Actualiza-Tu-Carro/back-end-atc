import {
  BadRequestException,
  HttpException,
  Inject,
  forwardRef,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import { User } from 'src/users/entities/user.entity';
import { IReview } from './interfaces/response-review.interface';
import { ActivateReviewDto } from './dto/activate-review.dto';
import { UsersService } from 'src/users/users.service';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review) private reviewModel: typeof Review,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
    private sequelize: Sequelize,
  ) {}

  async create(id: string, createReviewDto: CreateReviewDto): Promise<IReview> {
    const transaction: Transaction = await this.sequelize.transaction();
    try {
      const user = await this.userService.findByPkGenericUser(id, {
        transaction,
      });

      const Newreview = await this.reviewModel.create({
        ...createReviewDto,
        userId: user.id,
      });

      const response = {
        statusCode: 201,
        data: Newreview,
      };

      (await transaction).commit();
      return response;
    } catch (error) {
      (await transaction).rollback();
      throw new InternalServerErrorException(
        'Algo salió mal al momento de crear la reseña',
      );
    }
  }

  async findAll(): Promise<IReview> {
    try {
      const reviews = await this.reviewModel.findAll({
        include: {
          model: User,
          attributes: ['firstName', 'lastName'],
        },
        attributes: ['review', 'rating', 'updated_at'],
      });

      if (!reviews.length) throw new NotFoundException();

      return { statusCode: 200, data: reviews };
    } catch (error) {
      switch (error.constructor) {
        case NotFoundException:
          throw new NotFoundException('No se encontraron reseñas activas.');
        default:
          throw new InternalServerErrorException(
            'No ha sido posible trabajar en este momento con las reseñas.',
          );
      }
    }
  }

  async update(updateReviewDto: UpdateReviewDto): Promise<IReview> {
    try {
      //Update
      const count = await this.reviewModel.update(updateReviewDto, {
        where: {
          id: updateReviewDto.reviewId,
        },
      });

      if (count[0] === 0)
        throw new BadRequestException(
          'No se pudo actualizar la reseña, revisar el id enviado',
        );

      //Get review
      const newReview = await this.reviewModel.findOne({
        attributes: ['review', 'rating', 'updatedOn', 'active'],
        where: {
          id: updateReviewDto.reviewId,
        },
      });

      return { statusCode: 200, data: newReview };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async removeOrActivate(
    changeReviewState: ActivateReviewDto,
  ): Promise<IReview> {
    try {
      if (changeReviewState.activate) {
        await this.reviewModel.restore({
          where: {
            id: changeReviewState.reviewId,
          },
        });
        return {
          statusCode: 200,
          message: 'se actualizó el estado de su reseña a activa',
        };
      } else {
        await this.reviewModel.destroy({
          where: {
            id: changeReviewState.reviewId,
          },
        });
        return {
          statusCode: 200,
          message: 'se actualizó el estado de su reseña a inactiva',
        };
      }
    } catch (error) {
      throw new InternalServerErrorException(
        'Ocurrió un error al actualizar el estado de su reseña \nIntente más tarde',
      );
    }
  }
}
