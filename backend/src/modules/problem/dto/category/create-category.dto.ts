import { ApiProperty } from '@nestjs/swagger';
import { CategoryEnum } from '../../enum/category.enum';

export class CreateCategoryDto {
  @ApiProperty()
  category: CategoryEnum;

  constructor(category: CategoryEnum) {
    this.category = category;
  }
}
