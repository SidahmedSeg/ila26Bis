import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export interface UploadFileOptions {
  file: Express.Multer.File;
  bucket: string;
  folder?: string;
  tenantId: string;
}

export interface FileMetadata {
  key: string;
  url: string;
  bucket: string;
  size: number;
  contentType: string;
}

@Injectable()
export class StorageService {
  private readonly s3Client: S3Client;
  private readonly bucketPrefix: string;
  private readonly endpoint: string;
  private readonly useSSL: boolean;

  constructor(private configService: ConfigService) {
    const endpoint = this.configService.get<string>('MINIO_ENDPOINT') || 'localhost';
    const port = this.configService.get<number>('MINIO_PORT') || 9000;
    const useSSL = this.configService.get<string>('MINIO_USE_SSL') === 'true';
    
    this.endpoint = `${endpoint}:${port}`;
    this.useSSL = useSSL;
    this.bucketPrefix = this.configService.get<string>('MINIO_BUCKET_PREFIX') || 'ila26';

    this.s3Client = new S3Client({
      endpoint: `http${useSSL ? 's' : ''}://${this.endpoint}`,
      region: 'us-east-1', // MinIO doesn't care about region
      credentials: {
        accessKeyId: this.configService.get<string>('MINIO_ACCESS_KEY') || '',
        secretAccessKey: this.configService.get<string>('MINIO_SECRET_KEY') || '',
      },
      forcePathStyle: true, // Required for MinIO
    });
  }

  /**
   * Upload a file to MinIO
   */
  async uploadFile(options: UploadFileOptions): Promise<FileMetadata> {
    const { file, bucket, folder, tenantId } = options;
    
    // Generate file key: bucket/folder/tenantId/timestamp-filename
    const timestamp = Date.now();
    const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = folder 
      ? `${bucket}/${folder}/${tenantId}/${timestamp}-${sanitizedFilename}`
      : `${bucket}/${tenantId}/${timestamp}-${sanitizedFilename}`;

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketPrefix,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
          Metadata: {
            originalName: file.originalname,
            tenantId,
          },
        }),
      );

      // Generate URL (in production, use CDN or signed URLs)
      const url = this.getFileUrl(key);

      return {
        key,
        url,
        bucket: this.bucketPrefix,
        size: file.size,
        contentType: file.mimetype,
      };
    } catch (error: any) {
      throw new HttpException(
        `Failed to upload file: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Delete a file from MinIO
   */
  async deleteFile(key: string): Promise<void> {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketPrefix,
          Key: key,
        }),
      );
    } catch (error: any) {
      throw new HttpException(
        `Failed to delete file: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get a signed URL for file download (valid for 1 hour)
   */
  async getSignedDownloadUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketPrefix,
        Key: key,
      });

      return await getSignedUrl(this.s3Client, command, { expiresIn });
    } catch (error: any) {
      throw new HttpException(
        `Failed to generate download URL: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get public URL for file (if bucket is public)
   */
  private getFileUrl(key: string): string {
    const protocol = this.useSSL ? 'https' : 'http';
    return `${protocol}://${this.endpoint}/${this.bucketPrefix}/${key}`;
  }

  /**
   * Validate file type
   */
  validateFileType(file: Express.Multer.File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.mimetype);
  }

  /**
   * Validate file size
   */
  validateFileSize(file: Express.Multer.File, maxSizeBytes: number): boolean {
    return file.size <= maxSizeBytes;
  }
}

