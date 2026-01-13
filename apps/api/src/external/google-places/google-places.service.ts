import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

export interface GooglePlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export interface GooglePlaceDetails {
  place_id: string;
  formatted_address: string;
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

@Injectable()
export class GooglePlacesService {
  private readonly apiKey: string;
  private readonly axiosInstance: AxiosInstance;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('GOOGLE_PLACES_API_KEY') || '';
    
    if (!this.apiKey) {
      console.warn('GOOGLE_PLACES_API_KEY not configured. Address autocomplete will not work.');
    }

    this.axiosInstance = axios.create({
      baseURL: 'https://maps.googleapis.com/maps/api/place',
      params: {
        key: this.apiKey,
      },
    });
  }

  /**
   * Get address autocomplete predictions
   */
  async autocomplete(input: string, countryCode?: string): Promise<GooglePlacePrediction[]> {
    if (!this.apiKey) {
      throw new HttpException(
        'Google Places API key not configured',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    if (!input || input.length < 3) {
      return [];
    }

    try {
      const params: any = {
        input,
        types: 'address',
      };

      if (countryCode) {
        params.components = `country:${countryCode}`;
      }

      const response = await this.axiosInstance.get('/autocomplete/json', { params });
      
      if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
        throw new HttpException(
          `Google Places API error: ${response.data.status}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      return response.data.predictions || [];
    } catch (error: any) {
      throw new HttpException(
        error.response?.data?.error_message || 'Failed to get address suggestions',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get place details by place_id
   */
  async getPlaceDetails(placeId: string): Promise<GooglePlaceDetails> {
    if (!this.apiKey) {
      throw new HttpException(
        'Google Places API key not configured',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    try {
      const response = await this.axiosInstance.get('/details/json', {
        params: {
          place_id: placeId,
          fields: 'place_id,formatted_address,address_components,geometry',
        },
      });

      if (response.data.status !== 'OK') {
        throw new HttpException(
          `Google Places API error: ${response.data.status}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      return response.data.result;
    } catch (error: any) {
      throw new HttpException(
        error.response?.data?.error_message || 'Failed to get place details',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

