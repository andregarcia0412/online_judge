import { ApiProperty } from '@nestjs/swagger';

export class AnalyzeResponseDto {
  constructor(
    model: string,
    created_at: string,
    response: string,
    thinking: string,
    done: boolean,
    done_reason: string,
    total_duration: number,
    load_duration: number,
    prompt_eval_count: number,
    prompt_eval_duration: number,
    eval_count: number,
    eval_duration: number,
  ) {
    this.model = model;
    this.created_at = created_at;
    this.response = response;
    this.thinking = thinking;
    this.done = done;
    this.done_reason = done_reason;
    this.total_duration = total_duration;
    this.load_duration = load_duration;
    this.prompt_eval_count = prompt_eval_count;
    this.prompt_eval_duration = prompt_eval_duration;
    this.eval_count = eval_count;
    this.eval_duration = eval_duration;
  }

  @ApiProperty()
  model: string;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  response: string;

  @ApiProperty()
  thinking: string;

  @ApiProperty()
  done: boolean;
  done_reason: string;

  @ApiProperty()
  total_duration: number;

  @ApiProperty()
  load_duration: number;

  @ApiProperty()
  prompt_eval_count: number;

  @ApiProperty()
  prompt_eval_duration: number;

  @ApiProperty()
  eval_count: number;

  @ApiProperty()
  eval_duration: number;
}
