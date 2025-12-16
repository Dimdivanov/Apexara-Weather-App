import { Component, effect } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { HighlightContainerDirective } from './../../../directives/highlight-container.directive';

import { NumToFixedPipe } from './../../../pipes/num-to-fixed.pipe';

import { WeatherDataService } from './../../../services/weather-data.service';
import { DashboardModalService } from './../../../services/dashboard-modal.service';
import { TemperatureUnitService } from './../../../services/temperature-unit.service';

import { ForecastDetails } from './../../../models/forecast.model';

@Component({
  selector: 'app-weekly-forecast',
  templateUrl: './weekly-forecast.component.html',
  styleUrls: ['./weekly-forecast.component.css'],
  imports: [
    DatePipe,
    CommonModule,
    NumToFixedPipe,
    HighlightContainerDirective, 
  ],
})

export class WeeklyForecastComponent {
  
  constructor(
    public modalService: DashboardModalService,
    public weatherDataService: WeatherDataService,
    public temperatureToggleService: TemperatureUnitService) {
    
    effect(() => {
      const fullData = this.weatherDataService.weatherData();
        
      this.forecastData = fullData?.dailyWeather ?? null;      
    });
  }

  public forecastData: ForecastDetails[] | null = null;
  
}
