import { ApiProperty } from '@nestjs/swagger';
import { CategoryEnum } from '../../enum/category.enum';
import { Category } from '../../entities/category.entity';

export class ReturnCategoryDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  id_problem: number;

  @ApiProperty()
  category: CategoryEnum;

  constructor(id: number, id_problem: number, category: CategoryEnum) {
    this.id = id;
    this.id_problem = id_problem;
    this.category = category;
  }

  static fromEntity(category: Category): ReturnCategoryDto {
    return new ReturnCategoryDto(
      category.id,
      category.id_problem,
      category.category,
    );
  }
}
