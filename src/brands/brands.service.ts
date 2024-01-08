import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';
import { Op } from 'sequelize';
import { miCache } from 'src/utils/nodeCache/nodeCache';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class BrandsService {
  constructor(
    @Inject(forwardRef(() => ProductsService))
    private productService: ProductsService,
  ) {}
  async findAllBrands(): Promise<{ id: string; name: string }[]> {
    try {
      const allBrands = await Brand.findAll();
      if (!allBrands.length)
        throw new NotFoundException(
          'No se encontró ninguna Marca en la base de datos',
        );
      return allBrands;
    } catch (error) {
      switch (error.constructor) {
        case NotFoundException:
          throw new NotFoundException(error.message);
        default:
          throw new InternalServerErrorException(
            'Ocurrió un error al en el servidor al trabajar las Marcas',
          );
      }
    }
  }

  public async findOneBrand(name: string) {
    try {
      const thisBrand = await Brand.findOne({
        where: { name: { [Op.eq]: name } },
      });
      if (thisBrand) {
        return thisBrand;
      } else {
        throw new NotFoundException(
          'No se encontró la Marca en la base de datos',
        );
      }
    } catch (error) {
      switch (error.constructor) {
        case NotFoundException:
          throw new NotFoundException(error.message);
        default:
          throw new InternalServerErrorException(
            'Ocurrió un error al en el servidor al trabajar las Marcas',
          );
      }
    }
  }

  public async postInCacheData() {
    try {
      const allBrands = await this.findOneBrand('Todas');
      miCache.set('AllBrands_Id', allBrands.id);
    } catch (error) {
      throw new InternalServerErrorException('Ocurrio un error con la cache del servidor')
    }
  }
}
