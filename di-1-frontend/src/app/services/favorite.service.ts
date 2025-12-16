import { Injectable, signal } from '@angular/core';

import { FavoriteCity } from './../models/forecast.model';

@Injectable({
  providedIn: 'root'
})

export class FavoriteService {

  private favoritesSignal = signal<FavoriteCity[]>([]);
  readonly favorites = this.favoritesSignal.asReadonly();

  public addFavorite(city: FavoriteCity): void {
    const current = this.favoritesSignal();

    if (!current.some(fav => fav.name.toLowerCase() === city.name.toLowerCase())) {
      this.favoritesSignal.set([...current, city]);
    }
  }

  public isFavorite(cityName: string): boolean {
    return this.favoritesSignal().some(c => c.name.toLowerCase() === cityName.toLowerCase());
  }

  public removeFavorite(cityName: string): void {
    this.favoritesSignal.set(
      this.favoritesSignal().filter(c => c.name.toLowerCase() !== cityName.toLowerCase())
    );
  }
}
