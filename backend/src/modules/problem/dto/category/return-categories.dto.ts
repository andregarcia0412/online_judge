import { ApiProperty } from '@nestjs/swagger';
import { CategoryEnum } from '../../enum/category.enum';

export class ReturnCategoriesDto {
  @ApiProperty()
  value: CategoryEnum;
  @ApiProperty()
  label: string;

  constructor(value: CategoryEnum, label: string) {
    this.value = value;
    this.label = label;
  }
}
