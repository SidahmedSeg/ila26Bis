import { IsString, IsOptional, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEnterpriseProfileDto {
  @ApiPropertyOptional({ description: 'Enterprise name' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiPropertyOptional({ description: 'SIRET number' })
  @IsOptional()
  @IsString()
  siret?: string;

  @ApiPropertyOptional({ description: 'KBIS number' })
  @IsOptional()
  @IsString()
  kbis?: string;

  @ApiPropertyOptional({ description: 'Activity domain ID' })
  @IsOptional()
  @IsString()
  activityDomainId?: string;

  @ApiPropertyOptional({ description: 'Speciality ID' })
  @IsOptional()
  @IsString()
  specialityId?: string;
}

export class UpdateEnterpriseAddressDto {
  @ApiProperty({ description: 'Street address' })
  @IsNotEmpty()
  @IsString()
  street: string;

  @ApiProperty({ description: 'City' })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ description: 'Postal code' })
  @IsNotEmpty()
  @IsString()
  postalCode: string;

  @ApiProperty({ description: 'Country' })
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiPropertyOptional({ description: 'Google Place ID (if from autocomplete)' })
  @IsOptional()
  @IsString()
  placeId?: string;

  @ApiPropertyOptional({ description: 'Latitude' })
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional({ description: 'Longitude' })
  @IsOptional()
  longitude?: number;
}

export class ValidateSiretDto {
  @ApiProperty({ description: 'SIRET number to validate' })
  @IsNotEmpty()
  @IsString()
  siret: string;
}

export class ValidateKbisDto {
  @ApiProperty({ description: 'KBIS number to validate' })
  @IsNotEmpty()
  @IsString()
  kbis: string;

  @ApiPropertyOptional({ description: 'SIRET number (for validation)' })
  @IsOptional()
  @IsString()
  siret?: string;
}

