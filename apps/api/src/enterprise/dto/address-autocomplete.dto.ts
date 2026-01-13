import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddressAutocompleteDto {
  @ApiProperty({ description: 'Address input for autocomplete' })
  @IsNotEmpty()
  @IsString()
  input: string;

  @ApiPropertyOptional({ description: 'Country code (e.g., FR)' })
  @IsOptional()
  @IsString()
  countryCode?: string;
}

