import { CommonModule, DatePipe } from '@angular/common';
import { Component, effect, OnInit, signal } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';

import { NumToFixedPipe } from './../../../../pipes/num-to-fixed.pipe';

import { WeatherDataService } from './../../../../services/weather-data.service';
import { TemperatureUnitService } from './../../../../services/temperature-unit.service';

import { HourlyWeather } from './../../../../models/forecast.model';

@Component({
  selector: 'app-carousel-forecast',
  templateUrl: './carousel-forecast.component.html',
  styleUrls: ['./carousel-forecast.component.css'],
  imports: [
    DatePipe,
    CommonModule,
    ButtonModule,
    NumToFixedPipe,
    CarouselModule, 
  ],
})

export class CarouselForecastComponent implements OnInit{

  constructor(
    public weatherService: WeatherDataService,
    public temperatureToggleService: TemperatureUnitService) {
      
    effect(() => {
      const data = this.weatherService.weatherData(); 
      
      if (data?.hourlyWeather) {
        this.hourlyWeather.set(data.hourlyWeather);
      }
    });
  }

  public hourlyWeather = signal<HourlyWeather[]>([]);

  public responsiveOptions: any[] | undefined;
  
  public ngOnInit(): void {
    this.responsiveOptions = [
      {
        breakpoint: '1400px',
        numVisible: 3,
        numScroll: 1,
      },
      {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1,
      },
      {
        breakpoint: '767px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '575px',
        numVisible: 2,
        numScroll: 1,
      },
    ];
  }

}
