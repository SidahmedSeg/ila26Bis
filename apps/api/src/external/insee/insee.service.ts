import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

export interface InseeCompanyInfo {
  siret: string;
  siren: string;
  name: string;
  address: string;
  postalCode: string;
  city: string;
  activity: string;
  legalForm: string;
  creationDate: string;
}

@Injectable()
export class InseeService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.insee.fr/entreprises/sirene/V3';
  private readonly axiosInstance: AxiosInstance;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('INSEE_API_KEY') || '';
    
    if (!this.apiKey) {
      console.warn('INSEE_API_KEY not configured. INSEE validation will not work.');
    }

    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Accept': 'application/json',
      },
    });
  }

  /**
   * Validate SIRET number and retrieve company information
   */
  async validateSiret(siret: string): Promise<InseeCompanyInfo> {
    if (!this.apiKey) {
      throw new HttpException(
        'INSEE API key not configured',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    // Remove spaces and validate format (14 digits)
    const cleanSiret = siret.replace(/\s/g, '');
    if (!/^\d{14}$/.test(cleanSiret)) {
      throw new HttpException(
        'Invalid SIRET format. Must be 14 digits.',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const response = await this.axiosInstance.get(`/siret/${cleanSiret}`);
      const establishment = response.data?.etablissement;

      if (!establishment) {
        throw new HttpException(
          'SIRET not found in INSEE database',
          HttpStatus.NOT_FOUND,
        );
      }

      const uniteLegale = establishment.uniteLegale;

      return {
        siret: cleanSiret,
        siren: uniteLegale.siren,
        name: uniteLegale.denominationUniteLegale || 
              `${uniteLegale.prenom1UniteLegale || ''} ${uniteLegale.nomUniteLegale || ''}`.trim(),
        address: establishment.adresseEtablissement?.numeroVoieEtablissement 
          ? `${establishment.adresseEtablissement.numeroVoieEtablissement} ${establishment.adresseEtablissement.typeVoieEtablissement || ''} ${establishment.adresseEtablissement.libelleVoieEtablissement || ''}`.trim()
          : '',
        postalCode: establishment.adresseEtablissement?.codePostalEtablissement || '',
        city: establishment.adresseEtablissement?.libelleCommuneEtablissement || '',
        activity: uniteLegale.activitePrincipaleUniteLegale || '',
        legalForm: uniteLegale.categorieJuridiqueUniteLegale || '',
        creationDate: uniteLegale.dateCreationUniteLegale || '',
      };
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new HttpException(
          'SIRET not found in INSEE database',
          HttpStatus.NOT_FOUND,
        );
      }
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new HttpException(
          'INSEE API authentication failed',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      throw new HttpException(
        error.response?.data?.message || 'Failed to validate SIRET',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Validate KBIS number (simplified - uses SIREN from SIRET)
   */
  async validateKbis(kbis: string, siret?: string): Promise<boolean> {
    if (!this.apiKey) {
      throw new HttpException(
        'INSEE API key not configured',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    // If SIRET is provided, extract SIREN and validate
    if (siret) {
      const cleanSiret = siret.replace(/\s/g, '');
      const siren = cleanSiret.substring(0, 9);
      
      // KBIS typically contains SIREN
      if (kbis.includes(siren)) {
        return true;
      }
    }

    // Basic validation - KBIS format check
    // In production, you might want to call INSEE API with KBIS
    return kbis.length >= 9;
  }
}

