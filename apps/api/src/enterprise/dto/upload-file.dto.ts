import { ApiProperty } from '@nestjs/swagger';

export class UploadLogoResponseDto {
  @ApiProperty({ description: 'Logo URL' })
  url: string;

  @ApiProperty({ description: 'File key in storage' })
  key: string;
}

export class UploadCoverResponseDto {
  @ApiProperty({ description: 'Cover image URL' })
  url: string;

  @ApiProperty({ description: 'File key in storage' })
  key: string;
}

export class UploadDocumentDto {
  @ApiProperty({ description: 'Document name' })
  name: string;

  @ApiProperty({ description: 'Document category ID' })
  categoryId: string;
}

export class UploadDocumentResponseDto {
  @ApiProperty({ description: 'Document ID' })
  id: string;

  @ApiProperty({ description: 'Document name' })
  name: string;

  @ApiProperty({ description: 'Document URL' })
  url: string;

  @ApiProperty({ description: 'File size in bytes' })
  size: number;

  @ApiProperty({ description: 'MIME type' })
  mimeType: string;
}

