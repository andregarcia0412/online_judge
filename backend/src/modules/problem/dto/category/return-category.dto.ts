import { ApiProperty } from '@nestjs/swagger';
import { CategoryEnum } from '../../enum/category.enum';
import { Category } from '../../entities/category.entity';
import { Expose } from 'class-transformer';

export class ReturnCategoryDto {
  @ApiProperty()
  id: number;

  @Expose({ name: 'id_problem' })
  @ApiProperty({ name: 'id_problem' })
  idProblem: number;

  @ApiProperty()
  category: CategoryEnum;

  constructor(id: number, idProblem: number, category: CategoryEnum) {
    this.id = id;
    this.idProblem = idProblem;
    this.category = category;
  }

  static fromEntity(category: Category): ReturnCategoryDto {
    return new ReturnCategoryDto(
      category.id,
      category.idProblem,
      category.category,
    );
  }

  static fromEntityList(categories: Category[]): ReturnCategoryDto[] {
    return categories.map((category) => ReturnCategoryDto.fromEntity(category));
  }
}
