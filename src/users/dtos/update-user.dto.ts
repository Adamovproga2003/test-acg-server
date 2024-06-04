import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches, ValidateIf } from 'class-validator';
import { NAME_REGEX, SLUG_REGEX } from '../../common/consts/regex.const';
import { isNull, isUndefined } from '../../common/utils/validation.util';

export abstract class UpdateUserDto {
  @ApiProperty({
    description: 'The new name',
    example: 'John Doe',
    type: String,
  })
  @IsString()
  @Length(3, 100)
  @Matches(NAME_REGEX, {
    message: 'Name must not have special characters',
  })
  @ValidateIf(
    (o: UpdateUserDto) =>
      !isUndefined(o.name),
  )
  public name?: string;
}