import { ActivatedRoute } from '@angular/router';
import { effect, Injectable, signal } from '@angular/core';

import { GeolocateService } from './geolocate.service';
import { RequestsWeatherDataService } from './http/requests/requests-weather-data.service';

import { WeatherDashboardData } from '././../models/forecast.model';

@Injectable({
  providedIn: 'root'
})

export class WeatherDataService {
 
  constructor(
    private route: ActivatedRoute,
    private geoLocateService: GeolocateService,
    private requestWeatherData: RequestsWeatherDataService) {

    this.geoLocateService.geoLocate();

    effect(() => {
      const city = this.route.snapshot.queryParamMap.get('search')?.toLocaleLowerCase() || '';
      
      this.routeSearchQuery.set(city);
      
      if (city && city !== this.currentCity()) {
        this.setCity(city);
      }
    });

    effect(() => {
      const coords = this.geoLocateService.coords();
      
      if (coords) {
        this.setGeoLocation(coords.lat, coords.lon);
      }

      this.setCity('varna');
    });
  }

  public authenticatingSignal = signal<boolean>(false);
  readonly isAuthenticating = this.authenticatingSignal.asReadonly();
  
  public weatherDataSignal = signal<WeatherDashboardData | null>(null);
  readonly weatherData = this.weatherDataSignal.asReadonly();

  private selectedCity = signal<string>('');
  readonly currentCity = this.selectedCity.asReadonly();
  
  private routeSearchQuery = signal<string>('');

  public setCity(city: string): void {
    this.selectedCity.set(city);
    
    this.getWeatherData(city);
  }
  
  public setGeoLocation(lat: number, lon: number): void {
    this.getWeatherGeoLocateData(lat, lon);
  }

  private getWeatherGeoLocateData(lat: number, lon: number): void {
    this.setAuthenticating(true);

    this.requestWeatherData.fetchWeatherCoordsData(
      lat,
      lon,
      this.handleWeatherDataSuccess,
      this.handleWeatherDataError,
    );
  }

  private getWeatherData(city: string): void {
    this.setAuthenticating(true);

    this.requestWeatherData.fetchWeatherData(
      city,
      this.handleWeatherDataSuccess,
      this.handleWeatherDataError,
    );
  }

  private handleWeatherDataSuccess = (mappedData: WeatherDashboardData): void => {
    this.weatherDataSignal.set(mappedData);
    
    this.selectedCity.set(mappedData.locationName);

    this.setAuthenticating(false);
  };

  private handleWeatherDataError = (): void => {
    this.weatherDataSignal.set(null);

    this.setAuthenticating(false);
  };

  private setAuthenticating(isAuthenticating: boolean): void {
    this.authenticatingSignal.set(isAuthenticating);
  }

}
