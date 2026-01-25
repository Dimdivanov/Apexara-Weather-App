import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { TruncatePipe } from './../../../pipes/truncate.pipe';

import { FavoriteService } from './../../../services/favorite.service';
import { NavigationService } from './../../../services/navigation.service';
import { WeatherDataService } from './../../../services/weather-data.service';

import { FavoriteCity } from './../../../models/forecast.model';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  imports: [
    RouterLink, 
    CommonModule, 
    TruncatePipe,
  ],
  standalone: true,
})

export class NavigationComponent {

  constructor(
    public weatherService: WeatherDataService,
    public navigationService: NavigationService,
    private router: Router,
    private favoriteService: FavoriteService) { }

  public onSubmit(event: Event, input: HTMLInputElement): void {
    event?.preventDefault();
    const query = input.value.trim().toLocaleLowerCase();

    if (query) {
      this.weatherService.setCity(query);

      this.router.navigate(['dashboard'], {
        queryParams: { search: query },
        queryParamsHandling: 'merge',
      });

      input.value = '';
    }
  }

  public addCurrentCityToFavorites(): void {
    const weather = this.weatherService.weatherData();

    if (!weather){
      return
    };

    const city: FavoriteCity = {
      name: weather.locationName,
      temp: weather.currentWeather.temp,
      icon: weather.currentWeather.weather.icon,
      description: weather.currentWeather.weather.description,
    };

    this.favoriteService.addFavorite(city);
  }

  public isCurrentCityFavorite(): boolean {
    const city = this.weatherService.currentCity();

    return city ? this.favoriteService.isFavorite(city) : false;
  }
  
}
