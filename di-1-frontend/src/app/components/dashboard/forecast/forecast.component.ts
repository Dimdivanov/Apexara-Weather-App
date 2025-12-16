import { RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, DoCheck, effect, OnDestroy, OnInit, signal } from '@angular/core';

import { SkeletonModule } from 'primeng/skeleton';
import { ProgressBarModule } from 'primeng/progressbar';

import { rotateUv } from './../../../animations/uv-scale.animation';

import { NumToFixedPipe } from './../../../pipes/num-to-fixed.pipe';
import { TimeTransformPipe } from './../../../pipes/time-transform.pipe';

import { WeeklyForecastComponent } from './../weekly-forecast/weekly-forecast.component';
import { CarouselForecastComponent } from './carousel-forecast/carousel-forecast.component';

import { UserService } from './../../../services/user.service';
import { WeatherDataService } from './../../../services/weather-data.service';
import { TemperatureUnitService } from './../../../services/temperature-unit.service';


@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css'],
  animations: [rotateUv],
  imports: [
    DatePipe,
    RouterLink,
    CommonModule,
    SkeletonModule,
    NumToFixedPipe,
    TimeTransformPipe,
    ProgressBarModule,
    WeeklyForecastComponent,
    CarouselForecastComponent,
],
})

export class ForecastComponent implements DoCheck, OnInit, OnDestroy {

  constructor(
    public userService: UserService,
    public weatherService: WeatherDataService, 
    public temperatureToggleService: TemperatureUnitService) { 

    effect(() => {
      this.airQuality.set(weatherService.weatherData()?.airPollution?.aqi || 1);
      this.timeSignal.set(new Date());

      if (this.weatherService.weatherData()) {
        this.isLoading.set(false);
      }

      this.getDailyRain();
    });
  }
    
  public airQuality = signal<number>(0);
  public timeSignal = signal<Date>(new Date());
  public isLoading = signal<Boolean>(true);
  
  public uviMessage = signal<String>('');
  public userName = signal<String>('');

  public rainIdx = signal<Number | String | null>(null);

  public uvIndex: number = 0; //value 0 lowest UV index
  public windDirection: number = 10; //value 10 lowest value on compass

  private clockIntervalId: number = 0;
  
  public get rotationAngle(): number {
    return this.weatherService.weatherData()?.currentWeather.uvi || 0; 
  }

  public get windDirectionAngle(): number {
    return this.weatherService.weatherData()?.currentWeather.windDeg || 10;
  }

  public async ngOnInit(): Promise<void> {
    this.clockIntervalId= window.setInterval(() => {
      this.timeSignal.set(new Date());
    }, 1000);

    const user = await this.userService.checkUser();

    if (user?.data) {
      this.userName.set(user.data.username);
    };

  }

  public ngDoCheck(): void {
    const value = this.weatherService.weatherData()?.currentWeather?.uvi;
    
    if (value !== undefined && value !== this.uvIndex) {
      this.uvIndex = value;
    }

    if (this.uvIndex <= 2) {
      this.uviMessage.set('You can safely stay outside!');
    } else if (this.uvIndex > 2 && this.uvIndex <= 7 ) {
      this.uviMessage.set('Seek shade during midday hours!');
    } else if (this.uvIndex > 7) {
      this.uviMessage.set('Avoid being outside, make sure you seek shade!')
    }

    const windValue = this.weatherService.weatherData()?.currentWeather?.windDeg;

    if (windValue !== undefined && windValue !== this.windDirection) {
      this.windDirection = windValue;
    }
  }

  public get getAirQualityColor(): string {
    const value = this.airQuality();

    if (value <= 2) return 'green';
    if (value > 2 && value <= 4) return 'orange';
    if (value > 4) return 'red';

    return 'gray';
  }

  public setUnit(isCelsius: boolean) {
    const current = this.temperatureToggleService.isCelsius();
    
    if (current !== isCelsius) {
      this.temperatureToggleService.toggleUnit();
    }
  }


  public getDailyRain(): void {
    const data = this.weatherService.weatherData();

    this.rainIdx.set(data?.dailyWeather[0]?.rain ?? null);
  }

  public ngOnDestroy(): void {
    clearInterval(this.clockIntervalId);  
  }

}
