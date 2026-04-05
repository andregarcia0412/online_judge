import { ApiProperty } from '@nestjs/swagger';
import { CategoryEnum } from '../../enum/category.enum';
import { IsEnum } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty()
  @IsEnum(CategoryEnum)
  category: CategoryEnum;

  constructor(category: CategoryEnum) {
    this.category = category;
  }
}
