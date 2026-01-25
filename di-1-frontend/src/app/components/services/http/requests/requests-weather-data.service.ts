import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { WeatherDashboardData } from './../../../models/forecast.model';

import { env } from './../../../../environments/environments';

@Injectable({
  providedIn: 'root'
})

export class RequestsWeatherDataService {

  constructor(
    private http: HttpClient) { }
    
  public fetchWeatherData(city: string, onSuccess: (data: WeatherDashboardData) => void, onError: () => void): void {
    const weatherApiUrl = `${env.apiUrl}${env.endpoints.apiEndpoints.weatherByCity(city)}`;
    
    this.http.get<WeatherDashboardData>(weatherApiUrl).subscribe({
      next: data => {                    
        onSuccess(data);
      },
      error: err => {
        console.error('Error fetching weather data', err);
        onError();
      }
    });
  }

  public fetchWeatherCoordsData(lat: number, lon: number, onSuccess: (data: WeatherDashboardData) => void, onError: () => void): void {
    const weatherApiUrl = `${env.apiUrl}${env.endpoints.apiEndpoints.weatherByCoords(lat, lon)}`;
    
    this.http.get<WeatherDashboardData>(weatherApiUrl).subscribe({
      next: data => {
        onSuccess(data);
        console.log(data);
      },
      error: err => {
        console.error('Error fetching test weather', err);
        onError();
      }
    }); 
  }
  
}
