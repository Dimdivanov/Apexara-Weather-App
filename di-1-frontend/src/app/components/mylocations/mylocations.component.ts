import { Router } from '@angular/router';
import { Component, effect } from '@angular/core';

import { NumToFixedPipe } from './../../pipes/num-to-fixed.pipe';

import { UserService } from './../../services/user.service';
import { FavoriteService } from './../../services/favorite.service';

import { FavoriteCity } from './../../models/forecast.model';

@Component({
  selector: 'app-mylocations',
  templateUrl: './mylocations.component.html',
  styleUrls: ['./mylocations.component.css'],
  imports: [
    NumToFixedPipe,
  ],
})

export class MylocationsComponent {

  constructor(
    private favoriteService: FavoriteService) {

    effect(() => {
      this.myLocations = favoriteService.favorites();
    });
  }

  public myLocations: FavoriteCity[] = [];

  public deleteCity(cityName: string): void {
    this.favoriteService.removeFavorite(cityName);
  }
  
}
